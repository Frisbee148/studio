import { Car, Home, ShoppingBag, Utensils, Ticket, HeartPulse, MoreHorizontal } from 'lucide-react';
import type { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food', icon: Utensils },
  { id: 'cat-2', name: 'Transport', icon: Car },
  { id: 'cat-3', name: 'Housing', icon: Home },
  { id: 'cat-4', name: 'Shopping', icon: ShoppingBag },
  { id: 'cat-5', name: 'Entertainment', icon: Ticket },
  { id: 'cat-6', name: 'Health', icon: HeartPulse },
  { id: 'cat-7', name: 'Other', icon: MoreHorizontal },
];
