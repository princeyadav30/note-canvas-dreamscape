
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNoteStore } from '@/stores/noteStore';
import { useForm } from 'react-hook-form';

interface NewNotebookForm {
  notebookName: string;
  notebookType: string;
}

const NewNotebookModal: React.FC = () => {
  const { isNewNotebookModalOpen, closeNewNotebookModal, createNotebook } = useNoteStore();
  
  const { register, handleSubmit, reset, setValue, watch } = useForm<NewNotebookForm>({
    defaultValues: {
      notebookName: '',
      notebookType: 'blank'
    }
  });

  const notebookType = watch('notebookType');

  const onSubmit = (data: NewNotebookForm) => {
    createNotebook({
      name: data.notebookName,
      type: data.notebookType
    });
    reset();
    closeNewNotebookModal();
  };

  return (
    <Dialog open={isNewNotebookModalOpen} onOpenChange={closeNewNotebookModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Notebook</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="notebookName">Notebook Name</Label>
            <Input 
              id="notebookName" 
              placeholder="Enter notebook name" 
              {...register("notebookName", { required: true })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notebookType">Notebook Type</Label>
            <Select 
              defaultValue="blank"
              onValueChange={(value) => setValue('notebookType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select notebook type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">Blank</SelectItem>
                <SelectItem value="lined">Lined Paper</SelectItem>
                <SelectItem value="grid">Grid Paper</SelectItem>
                <SelectItem value="dotted">Dotted Paper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                closeNewNotebookModal();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewNotebookModal;
