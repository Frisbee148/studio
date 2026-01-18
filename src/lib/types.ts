import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon | React.ComponentType<any>;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: string; // ISO string for serialization
}
