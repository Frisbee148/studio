"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Category, Expense } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  deleteExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, categories, deleteExpense }: ExpenseListProps) {
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>No expenses recorded yet. Add your first one!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            <p>Your expenses will appear here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense History</CardTitle>
        <CardDescription>A list of your recent expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => {
              const category = categoryMap.get(expense.categoryId);
              return (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {category && <category.icon className="h-4 w-4 text-muted-foreground" />}
                      {category?.name || "Uncategorized"}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteExpense(expense.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
