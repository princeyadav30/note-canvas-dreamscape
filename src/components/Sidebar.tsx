
import React from 'react';
import { ChevronLeft, ChevronRight, File } from 'lucide-react';
import { useNoteStore } from '@/stores/noteStore';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { 
    notebooks,
    selectedNotebook,
    collapsed,
    toggleSidebar,
    selectNotebook
  } = useNoteStore();

  return (
    <div className={cn("bg-white border-r border-gray-200 transition-all duration-300 h-full flex flex-col z-10", 
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && <h3 className="font-semibold">Notebooks</h3>}
        <button 
          className="p-2 rounded-md hover:bg-light" 
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        <ul className="notebook-list">
          {notebooks.map((notebook) => (
            <li 
              key={notebook.id}
              className={cn(
                "flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                selectedNotebook?.id === notebook.id && "bg-blue-50 border-l-4 border-l-primary",
                collapsed && "justify-center"
              )}
              onClick={() => selectNotebook(notebook.id)}
            >
              <File 
                size={18} 
                className={cn("text-secondary", collapsed ? "mx-auto" : "mr-3")} 
              />
              {!collapsed && (
                <span className="text-sm truncate">{notebook.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
