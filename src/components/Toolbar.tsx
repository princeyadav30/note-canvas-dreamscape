
import React from 'react';
import { 
  Pen, 
  Highlighter, 
  Eraser, 
  Type,
  Undo, 
  Redo, 
  Trash2, 
  Save 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNoteStore } from '@/stores/noteStore';

const Toolbar: React.FC = () => {
  const { 
    currentTool, 
    currentColor, 
    currentThickness,
    canUndo,
    canRedo,
    setTool,
    setColor,
    setThickness,
    undoCanvasState,
    redoCanvasState,
    clearCanvas,
    saveNotebook
  } = useNoteStore();

  // Color options
  const colorOptions = [
    { color: '#000000', label: 'Black' },
    { color: '#ff0000', label: 'Red' },
    { color: '#0000ff', label: 'Blue' },
    { color: '#00aa00', label: 'Green' },
    { color: '#ff9900', label: 'Orange' }
  ];

  // Thickness options
  const thicknessOptions = [
    { size: 2, label: 'Extra Fine' },
    { size: 4, label: 'Fine' },
    { size: 6, label: 'Medium' },
    { size: 8, label: 'Thick' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-2 flex items-center flex-wrap gap-2">
      <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
        <button 
          className={cn("w-10 h-10 rounded flex items-center justify-center transition-colors", 
            currentTool === 'pen' ? 'bg-light text-primary' : 'hover:bg-gray-100'
          )}
          title="Pen Tool"
          onClick={() => setTool('pen')}
        >
          <Pen size={18} />
        </button>
        <button 
          className={cn("w-10 h-10 rounded flex items-center justify-center transition-colors", 
            currentTool === 'highlighter' ? 'bg-light text-primary' : 'hover:bg-gray-100'
          )}
          title="Highlighter"
          onClick={() => setTool('highlighter')}
        >
          <Highlighter size={18} />
        </button>
        <button 
          className={cn("w-10 h-10 rounded flex items-center justify-center transition-colors", 
            currentTool === 'eraser' ? 'bg-light text-primary' : 'hover:bg-gray-100'
          )}
          title="Eraser"
          onClick={() => setTool('eraser')}
        >
          <Eraser size={18} />
        </button>
        <button 
          className={cn("w-10 h-10 rounded flex items-center justify-center transition-colors", 
            currentTool === 'text' ? 'bg-light text-primary' : 'hover:bg-gray-100'
          )}
          title="Text Tool"
          onClick={() => setTool('text')}
        >
          <Type size={18} />
        </button>
      </div>
      
      <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
        {thicknessOptions.map((option) => (
          <button
            key={option.size}
            className={cn("w-8 h-8 rounded flex items-center justify-center mx-1", 
              currentThickness === option.size ? 'bg-light' : 'hover:bg-gray-100'
            )}
            title={option.label}
            onClick={() => setThickness(option.size)}
          >
            <div 
              className="bg-dark rounded-full" 
              style={{ 
                width: `${option.size}px`, 
                height: `${option.size}px` 
              }}
            />
          </button>
        ))}
      </div>
      
      <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
        {colorOptions.map((option) => (
          <button
            key={option.color}
            className={cn("w-6 h-6 rounded-full mx-1 border-2", 
              currentColor === option.color ? 'border-dark' : 'border-transparent'
            )}
            style={{ backgroundColor: option.color }}
            title={option.label}
            onClick={() => setColor(option.color)}
          />
        ))}
      </div>
      
      <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
        <button 
          className={cn("w-10 h-10 rounded flex items-center justify-center transition-colors",
            canUndo ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          )}
          title="Undo"
          onClick={undoCanvasState}
          disabled={!canUndo}
        >
          <Undo size={18} />
        </button>
        <button 
          className={cn("w-10 h-10 rounded flex items-center justify-center transition-colors",
            canRedo ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          )}
          title="Redo"
          onClick={redoCanvasState}
          disabled={!canRedo}
        >
          <Redo size={18} />
        </button>
      </div>
      
      <div className="flex items-center">
        <button 
          className="w-10 h-10 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Clear Page"
          onClick={clearCanvas}
        >
          <Trash2 size={18} />
        </button>
        <button 
          className="w-10 h-10 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Save Notebook"
          onClick={saveNotebook}
        >
          <Save size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
