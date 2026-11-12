import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import {
  QrCode,
  Camera,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult?: (decoded: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
}) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const notify = useNotification();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [decodedData, setDecodedData] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream safely
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Start live camera scanning
  const startCamera = async () => {
    setCameraError(null);
    setDecodedData(null);
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanning(true);
        scanFrame();
      }
    } catch (err: any) {
      setCameraError(
        err.message || 'Camera permission denied or camera device not accessible.'
      );
      setIsScanning(false);
    }
  };

  // Continuous frame scanner loop
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        handleCodeDetected(code.data);
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // Process detected QR code payload
  const handleCodeDetected = (rawPayload: string) => {
    stopCamera();
    setDecodedData(rawPayload);
    notify.success('QR Code / Barcode Decoded', rawPayload);

    if (onScanResult) {
      onScanResult(rawPayload);
    }

    // Extract credential ID or URL
    let targetId = rawPayload.trim();
    if (targetId.includes('/verify/credential/')) {
      targetId = targetId.split('/verify/credential/')[1]?.split('?')[0] || targetId;
    } else if (targetId.includes('/verify/report/')) {
      targetId = targetId.split('/verify/report/')[1]?.split('?')[0] || targetId;
    }

    // Auto-navigate to verify after 800ms
    setTimeout(() => {
      onClose();
      if (rawPayload.includes('/verify/report/')) {
        navigate(`/verify/report/${targetId}`);
      } else {
        navigate(`/verify/credential/${targetId}`);
      }
    }, 900);
  };

  // Image file upload decoder
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleCodeDetected(code.data);
          } else {
            notify.warning(
              'No QR Code Found',
              'Could not detect a valid QR code in the uploaded image. Try another image or use camera.'
            );
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const sampleQrs = [
    {
      id: 'TC-2026-MIT941',
      title: 'MIT Graduate Degree (Sepolia Verified)',
      issuer: 'Massachusetts Institute of Technology',
      payload: 'https://alokxcreate.github.io/trustchain-ai/#/verify/credential/TC-2026-MIT941',
      status: 'Verified',
    },
    {
      id: 'TC-2026-STA302',
      title: 'Stanford University Transcript',
      issuer: 'Stanford Registrar Office',
      payload: 'https://alokxcreate.github.io/trustchain-ai/#/verify/credential/TC-2026-STA302',
      status: 'Verified',
    },
    {
      id: 'TC-2026-GDM401',
      title: 'Google DeepMind Research Fellowship',
      issuer: 'Google DeepMind Research',
      payload: 'https://alokxcreate.github.io/trustchain-ai/#/verify/credential/TC-2026-GDM401',
      status: 'Verified',
    },
    {
      id: 'TC-2026-FAKE991',
      title: 'FastTrack Academy Dubious Diploma',
      issuer: 'Unaccredited Issuer',
      payload: 'https://alokxcreate.github.io/trustchain-ai/#/verify/credential/TC-2026-FAKE991',
      status: 'Unregistered',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-navy-800/80 border-b border-slate-200 dark:border-navy-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Scan Certificate QR / Barcode
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Instantly extract on-chain links and verify authenticity
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-850 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('camera')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'camera'
                ? 'border-brand-accent text-brand-accent'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('upload');
            }}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'upload'
                ? 'border-brand-accent text-brand-accent'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload QR Image</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('samples');
            }}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'samples'
                ? 'border-brand-accent text-brand-accent'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Test Samples</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {decodedData ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Certificate Decoded Successfully!
              </h4>
              <p className="text-xs font-mono bg-slate-100 dark:bg-navy-800 p-2.5 rounded-xl break-all text-brand-primary font-semibold max-w-sm mx-auto">
                {decodedData}
              </p>
              <p className="text-xs text-slate-500 animate-pulse">
                Redirecting to cryptographic on-chain verification...
              </p>
            </div>
          ) : activeTab === 'camera' ? (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Viewfinder crosshairs and scanning line */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-brand-accent rounded-2xl relative shadow-2xl">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-400 -mt-1 -ml-1 rounded-tl" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-400 -mt-1 -mr-1 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-400 -mb-1 -ml-1 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-400 -mb-1 -mr-1 rounded-br" />
                      {/* Laser scanning line */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute inset-0 bg-slate-900/90 p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-amber-500" />
                    <p className="text-xs text-slate-300 font-medium">{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="text-xs font-bold text-brand-accent hover:underline"
                    >
                      Use Upload Image or Test Samples instead →
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Align QR code inside the viewfinder</span>
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center gap-1 font-semibold text-brand-accent hover:underline"
                >
                  <RefreshCw className="w-3 h-3" /> Restart Camera
                </button>
              </div>
            </div>
          ) : activeTab === 'upload' ? (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-navy-700 hover:border-brand-accent rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 dark:bg-navy-950/40 transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-brand-accent/10 text-brand-accent mx-auto flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Drop a certificate image with a QR code here
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Supports PNG, JPG, JPEG, and WebP certificate scans
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Click any pre-anchored certificate QR payload to simulate instant verification:
              </p>
              <div className="space-y-2">
                {sampleQrs.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleCodeDetected(s.payload)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-brand-accent bg-slate-50 dark:bg-navy-800 text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-accent">
                          {s.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            s.status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        ID: {s.id} • {s.issuer}
                      </p>
                    </div>
                    <Zap className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

