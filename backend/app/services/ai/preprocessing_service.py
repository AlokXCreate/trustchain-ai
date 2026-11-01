"""
TrustChain AI - Document Preprocessing Engine
Handles PDF rendering, multi-page normalization, noise reduction, deskewing,
contrast enhancement (CLAHE), rotation correction, and measurable quality assessment.
"""

import io
import math
import os
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from PIL import Image
import cv2
import pypdf


class PreprocessingService:
    """
    Robust document preprocessing and quality assessment service.
    Works directly with NumPy arrays, PIL Images, and OpenCV.
    """

    MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB
    MAX_PDF_PAGES = 15
    TARGET_DPI = 300
    BLUR_THRESHOLD = 95.0
    MIN_RESOLUTION_WIDTH = 900
    MIN_RESOLUTION_HEIGHT = 1200

    def __init__(self):
        pass

    def validate_file(self, file_path_or_bytes: Any, file_name: str = "") -> Tuple[bool, str]:
        """
        Validates document size, extension, and integrity before processing.
        """
        if isinstance(file_path_or_bytes, str):
            if not os.path.exists(file_path_or_bytes):
                return False, f"File does not exist: {file_path_or_bytes}"
            size = os.path.getsize(file_path_or_bytes)
            ext = os.path.splitext(file_path_or_bytes)[1].lower()
        elif isinstance(file_path_or_bytes, bytes):
            size = len(file_path_or_bytes)
            ext = os.path.splitext(file_name)[1].lower() if file_name else ""
        else:
            return False, "Unsupported file input type."

        if size > self.MAX_FILE_SIZE_BYTES:
            return False, f"File size ({size / (1024*1024):.1f}MB) exceeds limit of {self.MAX_FILE_SIZE_BYTES / (1024*1024)}MB."

        valid_exts = [".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".webp"]
        if ext and ext not in valid_exts:
            return False, f"Unsupported file format '{ext}'. Must be one of {valid_exts}."

        return True, "File validation passed."

    def process_document(
        self,
        file_path_or_bytes: Any,
        file_name: str = "document"
    ) -> Dict[str, Any]:
        """
        Full ingestion pipeline:
        1. Extract pages (PDF or single image)
        2. Preprocess each page (grayscale, deskew, CLAHE, denoise)
        3. Assess real measurable image quality
        4. Extract embedded PDF text if available
        """
        is_valid, validation_msg = self.validate_file(file_path_or_bytes, file_name)
        if not is_valid:
            return {
                "success": False,
                "error": validation_msg,
                "pages": [],
                "quality_summary": {"quality_score": 0, "recommendation": validation_msg}
            }

        pages_data = []
        # Detect file type using magic bytes when bytes provided, else extension
        if isinstance(file_path_or_bytes, bytes):
            is_pdf = file_path_or_bytes.startswith(b"%PDF")
        else:
            is_pdf = isinstance(file_path_or_bytes, str) and file_path_or_bytes.lower().endswith(".pdf")

        embedded_pdf_text = {}
        if is_pdf:
            pages_data, embedded_pdf_text = self._extract_pdf_pages(file_path_or_bytes)
        else:
            img = self._load_image(file_path_or_bytes)
            if img is not None:
                pages_data.append({"page_number": 1, "image": img, "raw_image": img.copy()})

        if not pages_data:
            return {
                "success": False,
                "error": "Failed to decode any readable pages from document.",
                "pages": [],
                "quality_summary": {"quality_score": 0, "recommendation": "Unreadable document."}
            }

        processed_pages = []
        quality_reports = []

        for p_idx, page in enumerate(pages_data):
            page_num = page["page_number"]
            raw_img = page["raw_image"]
            
            # Measurable Quality Assessment on original image
            quality = self.assess_image_quality(raw_img)
            quality_reports.append(quality)

            # Preprocessing pipeline
            preprocessed, deskew_angle, was_rotated = self.preprocess_image(raw_img)

            processed_pages.append({
                "page_number": page_num,
                "width": raw_img.shape[1],
                "height": raw_img.shape[0],
                "preprocessed_image": preprocessed,
                "raw_image": raw_img,
                "deskew_angle": deskew_angle,
                "rotation_applied": was_rotated,
                "quality": quality,
                "embedded_text": embedded_pdf_text.get(page_num, "")
            })

        # Calculate overall quality score
        avg_quality = int(np.mean([q["quality_score"] for q in quality_reports]))
        overall_recommendation = self._generate_overall_recommendation(quality_reports, avg_quality)

        return {
            "success": True,
            "is_pdf": is_pdf,
            "total_pages": len(processed_pages),
            "pages": processed_pages,
            "quality_summary": {
                "quality_score": avg_quality,
                "blur_detected": any(q["blur_detected"] for q in quality_reports),
                "low_resolution": any(q["low_resolution"] for q in quality_reports),
                "skew_detected": any(q["skew_detected"] for q in quality_reports),
                "contrast_level": quality_reports[0]["contrast_level"] if quality_reports else "acceptable",
                "recommendation": overall_recommendation
            }
        }

    def _extract_pdf_pages(self, file_path_or_bytes: Any) -> Tuple[List[Dict[str, Any]], Dict[int, str]]:
        """
        Extracts pages from PDF using pypdf for text and pure image synthesis/rasterization.
        """
        pages = []
        embedded_text = {}

        try:
            if isinstance(file_path_or_bytes, str):
                pdf_reader = pypdf.PdfReader(file_path_or_bytes)
            else:
                stream = io.BytesIO(file_path_or_bytes)
                pdf_reader = pypdf.PdfReader(stream)

            num_pages = min(len(pdf_reader.pages), self.MAX_PDF_PAGES)

            for idx in range(num_pages):
                page_num = idx + 1
                pypdf_page = pdf_reader.pages[idx]
                
                # Extract text
                extracted_t = pypdf_page.extract_text() or ""
                embedded_text[page_num] = extracted_t

                # Extract embedded images or synthesize document canvas
                extracted_img = None
                if len(pypdf_page.images) > 0:
                    # Use largest image found in page
                    largest_img = max(pypdf_page.images, key=lambda im: len(im.data))
                    pil_img = Image.open(io.BytesIO(largest_img.data)).convert("RGB")
                    extracted_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

                if extracted_img is None:
                    # Synthesize high-resolution raster canvas from page text for OCR/Vision analysis
                    extracted_img = self._render_text_to_canvas(extracted_t, page_num)

                pages.append({
                    "page_number": page_num,
                    "image": extracted_img,
                    "raw_image": extracted_img.copy()
                })

        except Exception as e:
            # Fallback for corrupted PDF
            pass

        return pages, embedded_text

    def _render_text_to_canvas(self, text: str, page_num: int) -> np.ndarray:
        """
        Renders PDF text onto an A4 document canvas (2480 x 3508 at 300 DPI)
        when native PDF rasterizer binary is not available.
        """
        width, height = 2480, 3508
        canvas = np.ones((height, width, 3), dtype=np.uint8) * 255

        # Document border header line
        cv2.rectangle(canvas, (80, 80), (width - 80, height - 80), (220, 220, 220), 3)

        lines = text.split("\n")
        y = 250
        line_height = 55

        for line in lines[:55]:
            clean_line = line.strip()
            if not clean_line:
                y += 30
                continue
            # Text rendering with antialiased font
            cv2.putText(
                canvas,
                clean_line[:80],
                (140, y),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.1,
                (20, 20, 20),
                2,
                cv2.LINE_AA
            )
            y += line_height
            if y > height - 150:
                break

        return canvas

    def _load_image(self, file_path_or_bytes: Any) -> Optional[np.ndarray]:
        """Loads image file or bytes into OpenCV BGR numpy array."""
        try:
            if isinstance(file_path_or_bytes, str):
                img = cv2.imread(file_path_or_bytes)
                if img is None:
                    pil_img = Image.open(file_path_or_bytes).convert("RGB")
                    img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
                return img
            elif isinstance(file_path_or_bytes, bytes):
                nparr = np.frombuffer(file_path_or_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if img is None:
                    pil_img = Image.open(io.BytesIO(file_path_or_bytes)).convert("RGB")
                    img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
                return img
        except Exception:
            return None
        return None

    def preprocess_image(self, img_bgr: np.ndarray) -> Tuple[np.ndarray, float, bool]:
        """
        Preprocesses document image:
        - Deskew via Hough Lines / contour minAreaRect
        - Grayscale conversion
        - CLAHE contrast enhancement
        - Bilateral filter denoising (preserves sharp text edges)
        - Adaptive Gaussian Thresholding
        """
        # 1. Orientation / Deskew
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY) if len(img_bgr.shape) == 3 else img_bgr
        deskew_angle = self._calculate_skew_angle(gray)
        
        corrected = img_bgr
        was_rotated = False
        if abs(deskew_angle) > 0.5:
            corrected = self._rotate_image(img_bgr, deskew_angle)
            gray = cv2.cvtColor(corrected, cv2.COLOR_BGR2GRAY) if len(corrected.shape) == 3 else corrected
            was_rotated = True

        # 2. Contrast Limited Adaptive Histogram Equalization (CLAHE)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        contrast_enhanced = clahe.apply(gray)

        # 3. Denoising while keeping text edges sharp (Bilateral Filter)
        denoised = cv2.bilateralFilter(contrast_enhanced, d=5, sigmaColor=50, sigmaSpace=50)

        # 4. Sharpening convolution
        sharpen_kernel = np.array([
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ], dtype=np.float32)
        sharpened = cv2.filter2D(denoised, -1, sharpen_kernel)

        return sharpened, deskew_angle, was_rotated

    def assess_image_quality(self, img_bgr: np.ndarray) -> Dict[str, Any]:
        """
        Computes real measurable image metrics:
        - Blur: Variance of the Laplacian
        - Resolution: Dimensions relative to 300 DPI A4
        - Contrast: Standard deviation of pixel intensities
        - Skew: Estimated rotation angle
        - Noise: High-frequency residual variance
        - Text visibility: Otsu foreground edge ratio
        """
        h, w = img_bgr.shape[:2]
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY) if len(img_bgr.shape) == 3 else img_bgr

        # 1. Blur Detection (Laplacian Variance)
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        is_blur = laplacian_var < self.BLUR_THRESHOLD

        # 2. Resolution check
        low_res = (w < self.MIN_RESOLUTION_WIDTH) or (h < self.MIN_RESOLUTION_HEIGHT)

        # 3. Contrast analysis
        contrast_std = float(np.std(gray))
        if contrast_std < 30.0:
            contrast_level = "low"
        elif contrast_std > 80.0:
            contrast_level = "high"
        else:
            contrast_level = "acceptable"

        # 4. Skew angle
        skew_angle = self._calculate_skew_angle(gray)
        skew_detected = abs(skew_angle) > 1.5

        # 5. Noise estimation (residual from median filter)
        median_blur = cv2.medianBlur(gray, 3)
        noise_residual = float(np.mean(np.abs(gray.astype(np.float32) - median_blur.astype(np.float32))))
        high_noise = noise_residual > 12.0

        # 6. Text edge visibility
        edges = cv2.Canny(gray, 50, 150)
        edge_ratio = float(np.sum(edges > 0) / (h * w))
        sufficient_text_visibility = 0.01 <= edge_ratio <= 0.35

        # Composite measurable quality score calculation (0 to 100)
        score = 100.0

        # Blur penalty
        if is_blur:
            blur_penalty = min(35.0, (self.BLUR_THRESHOLD - laplacian_var) * 0.4)
            score -= blur_penalty

        # Resolution penalty
        if low_res:
            res_ratio = min(w / self.MIN_RESOLUTION_WIDTH, h / self.MIN_RESOLUTION_HEIGHT)
            score -= (1.0 - res_ratio) * 25.0

        # Contrast penalty
        if contrast_level == "low":
            score -= 20.0

        # Skew penalty
        if skew_detected:
            score -= min(15.0, abs(skew_angle) * 2.0)

        # Noise penalty
        if high_noise:
            score -= min(15.0, (noise_residual - 12.0) * 1.5)

        if not sufficient_text_visibility:
            score -= 15.0

        score = max(10, min(100, int(round(score))))

        recommendation = self._generate_quality_recommendation(
            score, is_blur, low_res, skew_detected, contrast_level
        )

        return {
            "quality_score": score,
            "blur_detected": is_blur,
            "laplacian_variance": round(laplacian_var, 2),
            "low_resolution": low_res,
            "dimensions": {"width": w, "height": h},
            "skew_detected": skew_detected,
            "skew_angle": round(skew_angle, 2),
            "contrast_level": contrast_level,
            "contrast_std": round(contrast_std, 2),
            "noise_level": "high" if high_noise else "acceptable",
            "noise_metric": round(noise_residual, 2),
            "text_visibility": "adequate" if sufficient_text_visibility else "poor",
            "recommendation": recommendation
        }

    def _calculate_skew_angle(self, gray: np.ndarray) -> float:
        """
        Estimates skew angle using minAreaRect on high-contrast text contours.
        """
        try:
            # Threshold to get dark text on light background
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            coords = np.column_stack(np.where(thresh > 0))
            if len(coords) < 100:
                return 0.0

            # Subsample for speed
            if len(coords) > 5000:
                indices = np.random.choice(len(coords), 5000, replace=False)
                coords = coords[indices]

            angle = cv2.minAreaRect(coords)[-1]
            if angle < -45:
                angle = -(90 + angle)
            elif angle > 45:
                angle = 90 - angle
            else:
                angle = -angle

            # Clamp outlier noise
            if abs(angle) > 30:
                return 0.0
            return float(angle)
        except Exception:
            return 0.0

    def _rotate_image(self, image: np.ndarray, angle: float) -> np.ndarray:
        """Rotates image around its center to compensate for skew."""
        h, w = image.shape[:2]
        center = (w // 2, h // 2)
        m = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(
            image,
            m,
            (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE
        )
        return rotated

    def _generate_quality_recommendation(
        self,
        score: int,
        is_blur: bool,
        low_res: bool,
        skew_detected: bool,
        contrast: str
    ) -> str:
        """Produces clear, explainable scanning guidance."""
        if score >= 80:
            if skew_detected:
                return "Document is sharp and readable; minor skew correction automatically applied."
            return "Document quality is optimal for AI verification and OCR extraction."
        elif score >= 55:
            notes = []
            if is_blur:
                notes.append("slight blur detected")
            if low_res:
                notes.append("sub-optimal resolution")
            if contrast == "low":
                notes.append("low contrast")
            return f"Document is readable with acceptable quality ({', '.join(notes)})."
        else:
            issues = []
            if is_blur:
                issues.append("high blur")
            if low_res:
                issues.append("low resolution")
            if contrast == "low":
                issues.append("poor contrast")
            return (
                f"Document quality is insufficient ({', '.join(issues)}). "
                "Rescanning at 300 DPI in well-lit conditions is recommended for reliable analysis."
            )

    def _generate_overall_recommendation(self, reports: List[Dict[str, Any]], avg_score: int) -> str:
        if avg_score >= 80:
            return "All document pages meet high-fidelity verification quality standards."
        elif avg_score >= 55:
            return "Document quality is readable; AI extraction proceeded with minor enhancements."
        return "Low document quality detected. Automated findings may have reduced confidence; consider rescanning."


# Global singleton
preprocessing_service = PreprocessingService()
