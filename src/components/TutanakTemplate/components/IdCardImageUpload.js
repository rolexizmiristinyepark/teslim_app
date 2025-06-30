/**
 * IdCardImageUpload Component
 * Handles ID card image upload, display, and manipulation
 */

import React, { useState, useMemo } from 'react';
import { Upload, Trash2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const IdCardImageUpload = () => {
  const [uploadedIdImage, setUploadedIdImage] = useState(null);
  const [imageTransform, setImageTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedIdImage(e.target.result);
        setImageTransform({ scale: 1, translateX: 0, translateY: 0 });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleDeleteImage = () => {
    setUploadedIdImage(null);
    setImageTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  const handleZoomIn = (amount = 0.05) => {
    setImageTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale + amount, 3)
    }));
  };

  const handleZoomOut = (amount = 0.05) => {
    setImageTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale - amount, 0.3)
    }));
  };

  const handleMove = (direction, isFine = true) => {
    const amount = isFine ? 2 : 8;
    setImageTransform(prev => {
      const newTransform = { ...prev };
      const limit = 150;

      switch (direction) {
        case 'up':
          newTransform.translateY = Math.max(prev.translateY - amount, -limit);
          break;
        case 'down':
          newTransform.translateY = Math.min(prev.translateY + amount, limit);
          break;
        case 'left':
          newTransform.translateX = Math.max(prev.translateX - amount, -limit);
          break;
        case 'right':
          newTransform.translateX = Math.min(prev.translateX + amount, limit);
          break;
        default:
          break;
      }
      return newTransform;
    });
  };

  const handleMouseDown = (direction) => {
    let timeoutId;
    let intervalId;

    // İlk tıklama - hassas ayar
    handleMove(direction, true);

    // 300ms sonra normal ayara geç
    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        handleMove(direction, false);
      }, 100);
    }, 300);

    const cleanup = () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      document.removeEventListener('mouseup', cleanup);
      document.removeEventListener('mouseleave', cleanup);
    };

    document.addEventListener('mouseup', cleanup);
    document.addEventListener('mouseleave', cleanup);
  };

  const handleReset = () => {
    setImageTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  // Memoize dynamic styles
  const imageTransformStyle = useMemo(() => ({
    transform: `scale(${imageTransform.scale}) translate(${imageTransform.translateX}px, ${imageTransform.translateY}px)`,
    transformOrigin: 'center',
    transition: 'transform 0.2s ease'
  }), [imageTransform.scale, imageTransform.translateX, imageTransform.translateY]);

  // Common button style for control panel - transparent background
  const commonButtonStyle = {
    background: 'transparent !important',
    border: 'none !important', 
    padding: '0 !important',
    margin: '0 !important',
    minHeight: '14px !important',
    width: '14px !important',
    height: '14px !important',
    gap: '0 !important',
    cursor: 'pointer',
    display: 'flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    outline: 'none !important',
    boxShadow: 'none !important',
    fontSize: '10px',
    fontWeight: 'bold'
  };
  const arrowStyle = { textShadow: '1px 1px 1px rgba(255,255,255,0.8)' };

  return (
    <div className="absolute flex flex-col items-start" style={{
      bottom: '15mm',
      left: '15mm'
    }}>
      <h2 className="text-xs font-bold text-left mb-2 m-0">
        Teslim Alan TC Kimlik Kartı
      </h2>

      <div
        className="id-card-area flex items-center justify-center bg-white relative overflow-hidden border border-gray-400 rounded"
        style={{
          width: '85.60mm',
          height: '53.98mm'
        }}
      >
        {uploadedIdImage ? (
          <>
            <img
              src={uploadedIdImage}
              alt="Yüklenen Kimlik"
              className="w-full h-full object-cover rounded"
              style={imageTransformStyle}
            />

            {/* Delete button */}
            <button
              onClick={handleDeleteImage}
              className="print:hidden absolute top-1 right-1 bg-white bg-opacity-90 border-none rounded-full w-6 h-6 cursor-pointer flex items-center justify-center shadow-md"
              title="Fotoğrafı Sil"
            >
              <Trash2 size={12} stroke="#666" />
            </button>

            {/* Compact Control Panel */}
            <div className="print:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-3 grid-rows-3 gap-px bg-white bg-opacity-50 rounded p-0.5 shadow-lg">
              {/* Top Row */}
              <button 
                onClick={() => handleZoomOut(0.05)} 
                style={{
                  background: 'transparent !important',
                  border: 'none !important', 
                  padding: '0 !important',
                  margin: '0 !important',
                  minHeight: '14px !important',
                  width: '14px !important',
                  height: '14px !important',
                  gap: '0 !important',
                  cursor: 'pointer',
                  display: 'flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  outline: 'none !important',
                  boxShadow: 'none !important'
                }}
                onMouseEnter={(e) => e.target.style.background = 'white'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                title="Küçült"
              >
                <ZoomOut size={12} stroke="#000000" strokeWidth="2" fill="none" />
              </button>
              <button
                onMouseDown={() => handleMouseDown('up')}
                title="Yukarı"
                style={{
                  ...commonButtonStyle,
                  textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'white'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                ↑
              </button>
              <button 
                onClick={() => handleZoomIn(0.05)} 
                style={{
                  background: 'transparent !important',
                  border: 'none !important', 
                  padding: '0 !important',
                  margin: '0 !important',
                  minHeight: '14px !important',
                  width: '14px !important',
                  height: '14px !important',
                  gap: '0 !important',
                  cursor: 'pointer',
                  display: 'flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  outline: 'none !important',
                  boxShadow: 'none !important'
                }}
                onMouseEnter={(e) => e.target.style.background = 'white'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                title="Büyült"
              >
                <ZoomIn size={12} stroke="#000000" strokeWidth="2" fill="none" />
              </button>

              {/* Middle Row */}
              <button
                onMouseDown={() => handleMouseDown('left')}
                title="Sol"
                style={{
                  ...commonButtonStyle,
                  textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'white'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                ←
              </button>
              <button 
                onClick={handleReset} 
                style={{
                  background: 'transparent !important',
                  border: 'none !important', 
                  padding: '0 !important',
                  margin: '0 !important',
                  minHeight: '14px !important',
                  width: '14px !important',
                  height: '14px !important',
                  gap: '0 !important',
                  cursor: 'pointer',
                  display: 'flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  outline: 'none !important',
                  boxShadow: 'none !important'
                }}
                onMouseEnter={(e) => e.target.style.background = 'white'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                title="Sıfırla"
              >
                <RotateCcw size={12} stroke="#000000" strokeWidth="2" fill="none" />
              </button>
              <button
                onMouseDown={() => handleMouseDown('right')}
                title="Sağ"
                style={{
                  ...commonButtonStyle,
                  textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'white'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                →
              </button>

              {/* Bottom Row */}
              <button 
                onClick={() => handleZoomOut(0.02)} 
                title="İnce Küçült" 
                style={{
                  ...commonButtonStyle,
                  textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'white'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                −
              </button>
              <button
                onMouseDown={() => handleMouseDown('down')}
                title="Aşağı"
                style={{
                  ...commonButtonStyle,
                  textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'white'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                ↓
              </button>
              <button 
                onClick={() => handleZoomIn(0.02)} 
                title="İnce Büyült" 
                style={{
                  ...commonButtonStyle,
                  textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'white'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                +
              </button>
            </div>
          </>
        ) : (
          <div className="print:hidden text-center text-gray-600 text-xs p-5 w-full h-full flex flex-col items-center justify-center">
            <p className="m-0 mb-3 leading-tight">
              Kimlik kartı fotoğrafı yükleyin
            </p>
            <label className="bg-gray-100 border border-gray-300 rounded px-2.5 py-1.5 cursor-pointer text-xs flex items-center gap-1">
              <Upload size={12} />
              Dosya Seç
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdCardImageUpload;