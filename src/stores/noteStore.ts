
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type NotebookType = 'blank' | 'lined' | 'grid' | 'dotted';
export type DrawingTool = 'pen' | 'highlighter' | 'eraser' | 'text';

export interface Notebook {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  canvasData?: string;
}

interface CanvasHistory {
  past: string[];
  future: string[];
  current: string | null;
}

interface NoteState {
  notebooks: Notebook[];
  selectedNotebook: Notebook | null;
  isNewNotebookModalOpen: boolean;
  currentTool: DrawingTool;
  currentColor: string;
  currentThickness: number;
  canvasHistory: CanvasHistory;
  collapsed: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

interface NoteActions {
  createNotebook: (data: { name: string; type: string }) => void;
  selectNotebook: (id: string) => void;
  openNewNotebookModal: () => void;
  closeNewNotebookModal: () => void;
  saveNotebook: () => void;
  setTool: (tool: DrawingTool) => void;
  setColor: (color: string) => void;
  setThickness: (thickness: number) => void;
  toggleSidebar: () => void;
  saveCanvasState: (dataUrl: string) => void;
  undoCanvasState: () => void;
  redoCanvasState: () => void;
  clearCanvas: () => void;
}

type NoteStore = NoteState & NoteActions;

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      // Initial state
      notebooks: [
        {
          id: '1',
          name: 'Class Notes',
          type: 'blank',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Meeting Notes',
          type: 'lined',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Ideas and Sketches',
          type: 'blank',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      selectedNotebook: null,
      isNewNotebookModalOpen: false,
      currentTool: 'pen',
      currentColor: '#000000',
      currentThickness: 4,
      collapsed: false,
      canvasHistory: {
        past: [],
        future: [],
        current: null
      },
      canUndo: false,
      canRedo: false,

      // Actions
      createNotebook: (data) => {
        const newNotebook: Notebook = {
          id: uuidv4(),
          name: data.name,
          type: data.type,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set((state) => ({
          notebooks: [...state.notebooks, newNotebook],
          selectedNotebook: newNotebook,
          canvasHistory: {
            past: [],
            future: [],
            current: null
          },
          canUndo: false,
          canRedo: false
        }));
      },

      selectNotebook: (id) => {
        const notebook = get().notebooks.find((nb) => nb.id === id) || null;
        
        set((state) => ({
          selectedNotebook: notebook,
          canvasHistory: {
            past: [],
            future: [],
            current: notebook?.canvasData || null
          },
          canUndo: false,
          canRedo: false
        }));
      },

      openNewNotebookModal: () => {
        set({ isNewNotebookModalOpen: true });
      },

      closeNewNotebookModal: () => {
        set({ isNewNotebookModalOpen: false });
      },

      saveNotebook: () => {
        const { selectedNotebook, canvasHistory } = get();
        
        if (!selectedNotebook || !canvasHistory.current) return;
        
        const updatedNotebook = {
          ...selectedNotebook,
          canvasData: canvasHistory.current,
          updatedAt: new Date()
        };
        
        set((state) => ({
          notebooks: state.notebooks.map((nb) => 
            nb.id === selectedNotebook.id ? updatedNotebook : nb
          ),
          selectedNotebook: updatedNotebook
        }));
      },

      setTool: (tool) => {
        set({ currentTool: tool });
      },

      setColor: (color) => {
        set({ currentColor: color });
      },

      setThickness: (thickness) => {
        set({ currentThickness: thickness });
      },

      toggleSidebar: () => {
        set((state) => ({ collapsed: !state.collapsed }));
      },

      saveCanvasState: (dataUrl) => {
        set((state) => {
          const { canvasHistory } = state;
          
          return {
            canvasHistory: {
              past: canvasHistory.current 
                ? [...canvasHistory.past, canvasHistory.current]
                : canvasHistory.past,
              current: dataUrl,
              future: []
            },
            canUndo: canvasHistory.current ? true : canvasHistory.past.length > 0,
            canRedo: false
          };
        });
      },

      undoCanvasState: () => {
        set((state) => {
          const { canvasHistory } = state;
          
          if (canvasHistory.past.length === 0) return state;
          
          const previous = canvasHistory.past[canvasHistory.past.length - 1];
          const newPast = canvasHistory.past.slice(0, canvasHistory.past.length - 1);
          
          return {
            canvasHistory: {
              past: newPast,
              current: previous,
              future: canvasHistory.current 
                ? [canvasHistory.current, ...canvasHistory.future]
                : canvasHistory.future
            },
            canUndo: newPast.length > 0,
            canRedo: true
          };
        });
      },

      redoCanvasState: () => {
        set((state) => {
          const { canvasHistory } = state;
          
          if (canvasHistory.future.length === 0) return state;
          
          const next = canvasHistory.future[0];
          const newFuture = canvasHistory.future.slice(1);
          
          return {
            canvasHistory: {
              past: canvasHistory.current 
                ? [...canvasHistory.past, canvasHistory.current]
                : canvasHistory.past,
              current: next,
              future: newFuture
            },
            canUndo: true,
            canRedo: newFuture.length > 0
          };
        });
      },

      clearCanvas: () => {
        // Create a blank canvas data
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 1100;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          set((state) => {
            const { canvasHistory, selectedNotebook } = state;
            
            return {
              canvasHistory: {
                past: canvasHistory.current 
                  ? [...canvasHistory.past, canvasHistory.current]
                  : canvasHistory.past,
                current: canvas.toDataURL(),
                future: []
              },
              canUndo: true,
              canRedo: false
            };
          });
        }
      },
    }),
    {
      name: 'notecanvas-storage',
      partialize: (state) => ({
        notebooks: state.notebooks,
      })
    }
  )
);
