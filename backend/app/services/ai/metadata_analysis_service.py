"""
TrustChain AI - Document Metadata Analysis Service
Inspects embedded PDF and image EXIF metadata, creation/modification timestamps,
editing software signatures, and embedded fonts.
Considers metadata as supporting evidence, never sole proof of fraud.
"""

import io
import os
import re
from datetime import datetime
from typing import Dict, Any, List, Optional
from PIL import Image, ExifTags
import pypdf


class MetadataAnalysisService:
    """
    Extracts and evaluates file metadata headers to detect
    editing tool signatures, timestamp discrepancies, and font modifications.
    """

    SUSPICIOUS_SOFTWARE_SIGNATURES = [
        "photoshop", "gimp", "canva", "coreldraw", "paint.net",
        "sejda", "ilovepdf", "pdfescape", "nitro pro", "foxit phantom",
        "pdf-xchange editor", "pdfedit"
    ]

    TRUSTED_ENTERPRISE_PRODUCERS = [
        "adobe acrobat", "distiller", "ghostscript", "microsoft word",
        "quartz pdfcontext", "mac os x", "google docs", "latex", "reportlab",
        "pdfkit", "cups", "skia"
    ]

    def analyze_metadata(
        self,
        file_path_or_bytes: Any,
        file_name: str = "document"
    ) -> Dict[str, Any]:
        """
        Extracts metadata from PDF or Image files and returns structured findings.
        """
        if isinstance(file_path_or_bytes, bytes):
            is_pdf = file_path_or_bytes.startswith(b"%PDF")
        else:
            is_pdf = isinstance(file_path_or_bytes, str) and file_path_or_bytes.lower().endswith(".pdf")

        if is_pdf:
            return self._analyze_pdf_metadata(file_path_or_bytes)
        else:
            return self._analyze_image_metadata(file_path_or_bytes)

    def _analyze_pdf_metadata(self, file_path_or_bytes: Any) -> Dict[str, Any]:
        try:
            if isinstance(file_path_or_bytes, str):
                reader = pypdf.PdfReader(file_path_or_bytes)
            else:
                reader = pypdf.PdfReader(io.BytesIO(file_path_or_bytes))

            info = reader.metadata or {}
            raw_meta = {}
            for k, v in info.items():
                clean_k = str(k).replace("/", "").strip()
                raw_meta[clean_k] = str(v)

            creator = raw_meta.get("Creator", "")
            producer = raw_meta.get("Producer", "")
            creation_date_raw = raw_meta.get("CreationDate", "")
            mod_date_raw = raw_meta.get("ModDate", "")
            page_count = len(reader.pages)

            # Analyze fonts
            embedded_fonts = set()
            try:
                for page in reader.pages[:5]:
                    if "/Font" in page.get("/Resources", {}):
                        fonts = page["/Resources"]["/Font"]
                        for f_key in fonts:
                            embedded_fonts.add(str(f_key))
            except Exception:
                pass

            # Detect software signatures
            full_software_str = f"{creator} {producer}".lower()
            suspicious_tools = []
            for tool in self.SUSPICIOUS_SOFTWARE_SIGNATURES:
                if tool in full_software_str:
                    suspicious_tools.append(tool.title())

            is_enterprise = any(t in full_software_str for t in self.TRUSTED_ENTERPRISE_PRODUCERS)

            # Date consistency
            creation_dt = self._parse_pdf_date(creation_date_raw)
            mod_dt = self._parse_pdf_date(mod_date_raw)
            timestamp_inconsistent = False
            time_gap_hours = 0.0

            if creation_dt and mod_dt:
                time_gap_hours = (mod_dt - creation_dt).total_seconds() / 3600.0
                if mod_dt < creation_dt:
                    timestamp_inconsistent = True  # Impossible chronology

            findings = []
            if suspicious_tools:
                findings.append(
                    f"Document produced or altered with graphic editing software ({', '.join(suspicious_tools)})."
                )
            if timestamp_inconsistent:
                findings.append("Modification timestamp precedes creation timestamp (chronological inconsistency).")
            elif time_gap_hours > 720:  # modified > 30 days after creation
                findings.append(f"Document modified {int(time_gap_hours // 24)} days after original creation.")

            risk_level = "low"
            if suspicious_tools or timestamp_inconsistent:
                risk_level = "moderate"

            return {
                "file_type": "PDF",
                "page_count": page_count,
                "creator": creator or "Unavailable",
                "producer": producer or "Unavailable",
                "creation_date": creation_dt.isoformat() if creation_dt else creation_date_raw or "Unavailable",
                "modification_date": mod_dt.isoformat() if mod_dt else mod_date_raw or "Unavailable",
                "timestamp_inconsistency": timestamp_inconsistent,
                "suspicious_software_detected": bool(len(suspicious_tools) > 0),
                "suspicious_software_list": suspicious_tools,
                "is_enterprise_certified_producer": is_enterprise,
                "embedded_font_count": len(embedded_fonts),
                "metadata_risk_level": risk_level,
                "findings": findings,
                "raw_metadata": raw_meta
            }

        except Exception as e:
            return self._fallback_result(f"Error parsing PDF metadata: {str(e)}")

    def _analyze_image_metadata(self, file_path_or_bytes: Any) -> Dict[str, Any]:
        try:
            if isinstance(file_path_or_bytes, str):
                pil_img = Image.open(file_path_or_bytes)
            else:
                pil_img = Image.open(io.BytesIO(file_path_or_bytes))

            width, height = pil_img.size
            color_mode = pil_img.mode
            img_format = pil_img.format

            exif_data = {}
            software = ""
            date_time = ""

            try:
                raw_exif = pil_img._getexif()
                if raw_exif:
                    for tag_id, val in raw_exif.items():
                        tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
                        exif_data[tag_name] = str(val)
                        if tag_name == "Software":
                            software = str(val)
                        elif tag_name == "DateTime":
                            date_time = str(val)
            except Exception:
                pass

            suspicious_tools = []
            for tool in self.SUSPICIOUS_SOFTWARE_SIGNATURES:
                if tool in software.lower():
                    suspicious_tools.append(tool.title())

            findings = []
            if suspicious_tools:
                findings.append(f"Image EXIF indicates editing software: {', '.join(suspicious_tools)}")
            if not exif_data:
                findings.append("No EXIF metadata present (standard for web-compressed or scanned images).")

            return {
                "file_type": f"Image ({img_format or 'Raster'})",
                "dimensions": {"width": width, "height": height},
                "color_mode": color_mode,
                "software": software or "Unavailable",
                "creation_date": date_time or "Unavailable",
                "suspicious_software_detected": bool(len(suspicious_tools) > 0),
                "suspicious_software_list": suspicious_tools,
                "metadata_risk_level": "moderate" if suspicious_tools else "low",
                "findings": findings,
                "raw_metadata": exif_data
            }

        except Exception as e:
            return self._fallback_result(f"Error parsing image metadata: {str(e)}")

    def _parse_pdf_date(self, date_str: str) -> Optional[datetime]:
        """Parses PDF date format D:YYYYMMDDHHmmSS."""
        if not date_str:
            return None
        try:
            clean = date_str.replace("D:", "").replace("'", "")[:14]
            return datetime.strptime(clean, "%Y%m%d%H%M%S")
        except Exception:
            return None

    def _fallback_result(self, message: str) -> Dict[str, Any]:
        return {
            "file_type": "Unknown",
            "metadata_risk_level": "low",
            "suspicious_software_detected": False,
            "findings": [f"Metadata inspection: {message}"],
            "raw_metadata": {}
        }


# Global singleton
metadata_analysis_service = MetadataAnalysisService()
