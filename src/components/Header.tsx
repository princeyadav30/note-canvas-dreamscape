
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNoteStore } from '@/stores/noteStore';

const Header: React.FC = () => {
  const { openNewNotebookModal } = useNoteStore();

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span className="text-xl font-bold">NoteCanvas</span>
      </div>
      <Button 
        className="flex items-center bg-accent text-accent-foreground hover:bg-accent-hover"
        onClick={openNewNotebookModal}
      >
        <Plus size={16} className="mr-2" />
        New Notebook
      </Button>
    </header>
  );
};

export default Header;
