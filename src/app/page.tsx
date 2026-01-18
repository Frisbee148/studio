"use client";

import { useState, useEffect, useMemo } from 'react';
import { MoreHorizontal, PlusCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Expense, Category } from '@/lib/types';
import { DEFAULT_CATEGORIES } from '@/lib/data';
import Summary from '@/components/spendwise/summary';
import ExpenseList from '@/components/spendwise/expense-list';
import AddExpenseDialog from '@/components/spendwise/add-expense-dialog';
import CategoryManagerDialog from '@/components/spendwise/category-manager-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function SpendWisePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedExpenses = localStorage.getItem('spendwise_expenses');
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }

      const storedCategories = localStorage.getItem('spendwise_categories');
      if (storedCategories) {
        const parsedCategories: { id: string; name: string }[] = JSON.parse(storedCategories);
        const mergedCategories = DEFAULT_CATEGORIES.map(dc => {
          const found = parsedCategories.find(sc => sc.id === dc.id);
          return found ? { ...dc, name: found.name } : dc;
        });

        const newCategories = parsedCategories
          .filter(sc => !DEFAULT_CATEGORIES.some(dc => dc.id === sc.id))
          .map(nc => ({ ...nc, icon: MoreHorizontal }));

        setCategories([...mergedCategories, ...newCategories]);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setCategories(DEFAULT_CATEGORIES);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('spendwise_expenses', JSON.stringify(expenses));
      localStorage.setItem('spendwise_categories', JSON.stringify(categories.map(c => ({ id: c.id, name: c.name }))));
    }
  }, [expenses, categories, isClient]);

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense = { ...expense, id: `exp-${Date.now()}`, date: new Date().toISOString() };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };
  
  const addCategory = (name: string) => {
    const newCategory = { id: `cat-${Date.now()}`, name, icon: MoreHorizontal };
    setCategories(prev => [...prev, newCategory]);
  };
  
  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setExpenses(prev => prev.map(e => e.categoryId === id ? {...e, categoryId: 'cat-7'} : e)); // Re-assign expenses to 'Other'
  };

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);
  
  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <h1 className="text-2xl font-bold text-primary mr-auto">SpendWise</h1>
          </div>
        </header>
        <main className="container flex-1 py-8">
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <h1 className="text-2xl font-bold text-primary mr-auto">SpendWise</h1>
          <div className="flex items-center gap-2">
             <CategoryManagerDialog 
                categories={categories}
                addCategory={addCategory}
                deleteCategory={deleteCategory} 
                trigger={<Button variant="ghost" size="icon"><Settings /><span className="sr-only">Manage Categories</span></Button>}
             />
            <AddExpenseDialog 
                categories={categories} 
                onAddExpense={addExpense} 
                trigger={<Button><PlusCircle className="mr-2" />Add Expense</Button>}
            />
          </div>
        </div>
      </header>
      <main className="container flex-1 py-8">
        <div className="space-y-8">
          <Summary expenses={expenses} categories={categories} />
          <ExpenseList expenses={sortedExpenses} categories={categories} deleteExpense={deleteExpense} />
        </div>
      </main>
    </div>
  );
}
