"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryManagerDialogProps {
  categories: Category[];
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  trigger: React.ReactNode;
}

export default function CategoryManagerDialog({ categories, addCategory, deleteCategory, trigger }: CategoryManagerDialogProps) {
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      toast({ variant: 'destructive', title: 'Error', description: 'Category name cannot be empty.' });
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      toast({ variant: 'destructive', title: 'Error', description: 'Category with this name already exists.' });
      return;
    }
    addCategory(newCategoryName.trim());
    toast({ title: 'Category Added', description: `Successfully added "${newCategoryName.trim()}".` });
    setNewCategoryName('');
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.id.startsWith('cat-') && parseInt(category.id.split('-')[1]) <= 7) {
        toast({ variant: 'destructive', title: 'Error', description: 'Default categories cannot be deleted.' });
        return;
    }
    deleteCategory(category.id);
    toast({ title: 'Category Deleted', description: `Successfully deleted "${category.name}".` });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>Add or remove spending categories.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}><PlusCircle className="mr-2 h-4 w-4" />Add</Button>
          </div>

          <p className="text-sm text-muted-foreground">Your categories:</p>
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{category.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
