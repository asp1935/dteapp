import React, { useRef, useEffect, useState } from 'react';

const FaceMesh = window.FaceMesh;
const Camera = window.Camera;

const EAR_THRESHOLD = 0.2; // Blink threshold
const MAR_THRESHOLD = 0.5; // Smile threshold
const CONSEC_FRAMES = 2;

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function calculateEAR(eye) {
  const v1 = getDistance(eye[1], eye[5]);
  const v2 = getDistance(eye[2], eye[4]);
  const h = getDistance(eye[0], eye[3]);
  return (v1 + v2) / (2.0 * h);
}

function calculateMAR(mouth) {
  const v = getDistance(mouth[1], mouth[2]);
  const h = getDistance(mouth[0], mouth[3]);
  return v / h;
}

const FaceScanner = ({ onLivenessVerified, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [status, setStatus] = useState('Loading camera...');
  const [instruction, setInstruction] = useState('Please position your face in the frame');
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [blinked, setBlinked] = useState(false);
  const [smiled, setSmiled] = useState(false);
  
  const blinkCounter = useRef(0);
  
  useEffect(() => {
    if (blinked && smiled && !livenessPassed) {
      setLivenessPassed(true);
      setStatus('Liveness verified! Capturing...');
      setInstruction('Hold still...');
      
      // Capture frame after a short delay
      setTimeout(() => {
        captureAndComplete();
      }, 1000);
    }
  }, [blinked, smiled, livenessPassed]);

  useEffect(() => {
    if (!instruction.includes('Hold still') && !livenessPassed) {
      if (!blinked) setInstruction('Please Blink');
      else if (!smiled) setInstruction('Please Smile');
    }
  }, [blinked, smiled, instruction, livenessPassed]);

  const captureAndComplete = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const captureCanvas = document.createElement('canvas');
      captureCanvas.width = video.videoWidth;
      captureCanvas.height = video.videoHeight;
      const ctx = captureCanvas.getContext('2d');
      ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
      const dataUrl = captureCanvas.toDataURL('image/jpeg', 0.9);
      if (onLivenessVerified) onLivenessVerified(dataUrl);
    }
  };

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results) => {
      if (!canvasRef.current || !videoRef.current) return;
      const canvasCtx = canvasRef.current.getContext('2d');
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        setStatus('Face detected');
        const landmarks = results.multiFaceLandmarks[0];
        
        // Draw mesh
        canvasCtx.globalAlpha = 0.4;
        for (const pt of landmarks) {
           canvasCtx.beginPath();
           canvasCtx.arc(pt.x * canvasRef.current.width, pt.y * canvasRef.current.height, 1, 0, 2 * Math.PI);
           canvasCtx.fillStyle = '#00FF00';
           canvasCtx.fill();
        }
        canvasCtx.globalAlpha = 1.0;

        // Left Eye: 33, 160, 158, 133, 153, 144
        const leftEye = [
          landmarks[33], landmarks[160], landmarks[158],
          landmarks[133], landmarks[153], landmarks[144]
        ];
        
        // Right Eye: 362, 385, 387, 263, 373, 380
        const rightEye = [
          landmarks[362], landmarks[385], landmarks[387],
          landmarks[263], landmarks[373], landmarks[380]
        ];
        
        // Mouth: 61, 13, 14, 291
        const mouth = [
          landmarks[61], landmarks[13], landmarks[14], landmarks[291]
        ];

        const leftEAR = calculateEAR(leftEye);
        const rightEAR = calculateEAR(rightEye);
        const ear = (leftEAR + rightEAR) / 2.0;

        const mar = calculateMAR(mouth);

        if (ear < EAR_THRESHOLD) {
          blinkCounter.current += 1;
        } else {
          if (blinkCounter.current >= CONSEC_FRAMES) {
            setBlinked(true);
          }
          blinkCounter.current = 0;
        }

        if (mar > MAR_THRESHOLD) {
          setSmiled(true);
        }
      } else {
        setStatus('No face detected');
      }
    });

    let camera = null;
    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await faceMesh.send({image: videoRef.current});
          }
        },
        width: 640,
        height: 480
      });
      camera.start().catch(err => setStatus(`Camera Error: ${err.message}`));
    }

    return () => {
      if (camera) camera.stop();
      faceMesh.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center bg-slate-900 rounded-xl p-4 w-full max-w-lg mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-2">
        <span className={status === 'Face detected' ? 'w-2 h-2 rounded-full bg-green-500 animate-pulse' : 'w-2 h-2 rounded-full bg-red-500'}></span>
        <span>{status}</span>
      </div>
      
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border-2 border-slate-700">
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover" 
          playsInline 
          autoPlay
        ></video>
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          width={640} 
          height={480}
        ></canvas>
        
        {/* Overlay scanning guides */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-64 border-2 border-dashed border-white/40 rounded-[100px] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
        </div>
      </div>

      <div className="mt-6 text-center w-full">
        <h3 className="text-xl font-bold text-white mb-2">{instruction}</h3>
        <div className="flex justify-center space-x-4 text-sm font-semibold">
          <div className={`px-4 py-2 rounded-lg transition-colors ${blinked ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
            1. Blink Eyes {blinked && '✓'}
          </div>
          <div className={`px-4 py-2 rounded-lg transition-colors ${smiled ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
            2. Smile {smiled && '✓'}
          </div>
        </div>
      </div>
      
      {onCancel && (
        <button 
          onClick={onCancel}
          className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-semibold w-full"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default FaceScanner;
