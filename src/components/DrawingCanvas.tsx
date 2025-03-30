
import React, { useRef, useState, useEffect } from 'react';
import { useNoteStore } from '@/stores/noteStore';

interface DrawingCanvasProps {
  width: number;
  height: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    currentTool, 
    currentColor, 
    currentThickness, 
    selectedNotebook,
    saveCanvasState,
    undoCanvasState,
    redoCanvasState,
    canUndo,
    canRedo
  } = useNoteStore();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas background to white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // If we have existing drawing data, load it
        if (selectedNotebook?.canvasData) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = selectedNotebook.canvasData;
        }
        
        // Save initial state to history
        saveCanvasState(canvas.toDataURL());
      }
    }
  }, [selectedNotebook?.id]);

  // Get canvas coordinates
  const getCoordinates = (event: React.MouseEvent | React.TouchEvent): { x: number, y: number } => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    
    const { x, y } = getCoordinates(event);
    setIsDrawing(true);
    setLastPosition({ x, y });
    
    // Draw a single dot
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      
      // Set drawing style based on tool
      if (currentTool === 'pen') {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentThickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else if (currentTool === 'highlighter') {
        // Highlighter with transparency
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentThickness * 3;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'round';
      } else if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = currentThickness * 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 1;
      }
      
      ctx.stroke();
    }
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const { x, y } = getCoordinates(event);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(x, y);
      
      // Set drawing style based on tool
      if (currentTool === 'pen') {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentThickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 1;
      } else if (currentTool === 'highlighter') {
        // Highlighter with transparency
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentThickness * 3;
        ctx.lineCap = 'square';
      } else if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = currentThickness * 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 1;
      }
      
      ctx.stroke();
      setLastPosition({ x, y });
    }
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      // Save state to history
      saveCanvasState(canvasRef.current.toDataURL());
    }
  };

  // Cursor styles based on current tool
  const getCursorStyle = () => {
    switch(currentTool) {
      case 'text':
        return 'text';
      case 'eraser':
        return 'crosshair';
      default:
        return 'crosshair';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-light p-8 flex justify-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="bg-white shadow-md"
        style={{ cursor: getCursorStyle() }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};

export default DrawingCanvas;
