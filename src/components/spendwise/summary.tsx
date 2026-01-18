"use client";

import { useState, useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { subDays, isAfter, startOfToday } from 'date-fns';
import type { Expense, Category } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface SummaryProps {
  expenses: Expense[];
  categories: Category[];
}

type Period = 'today' | '7days' | '30days';

export default function Summary({ expenses, categories }: SummaryProps) {
  const [period, setPeriod] = useState<Period>('7days');

  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

  const filteredExpenses = useMemo(() => {
    const now = startOfToday();
    let startDate: Date;
    switch (period) {
      case 'today':
        startDate = now;
        break;
      case '7days':
        startDate = subDays(now, 6);
        break;
      case '30days':
        startDate = subDays(now, 29);
        break;
    }
    return expenses.filter(expense => isAfter(new Date(expense.date), startDate));
  }, [expenses, period]);

  const totalSpend = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const averageDailySpend = useMemo(() => {
    const days = period === 'today' ? 1 : period === '7days' ? 7 : 30;
    return totalSpend / days;
  }, [totalSpend, period]);

  const chartData = useMemo(() => {
    const spendByCategory: { [key: string]: number } = {};
    for (const expense of filteredExpenses) {
      spendByCategory[expense.categoryId] = (spendByCategory[expense.categoryId] || 0) + expense.amount;
    }
    return Object.entries(spendByCategory)
      .map(([categoryId, amount]) => ({
        name: categoryMap.get(categoryId)?.name || 'Other',
        total: amount,
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredExpenses, categoryMap]);
  
  const topCategory = useMemo(() => {
    if (chartData.length === 0) return { name: 'N/A', amount: 0 };
    return { name: chartData[0].name, amount: chartData[0].total };
  }, [chartData]);
  
  const mostFrequentCategory = useMemo(() => {
    if (filteredExpenses.length === 0) return 'N/A';
    const counts: { [key: string]: number } = {};
    for (const expense of filteredExpenses) {
      counts[expense.categoryId] = (counts[expense.categoryId] || 0) + 1;
    }
    const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return categoryMap.get(topId)?.name || 'N/A';
  }, [filteredExpenses, categoryMap]);

  return (
    <div>
      <Tabs defaultValue="7days" onValueChange={(value) => setPeriod(value as Period)}>
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="7days">7 Days</TabsTrigger>
          <TabsTrigger value="30days">30 Days</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpend)}</div>
            <p className="text-xs text-muted-foreground">{`in the last ${period === 'today' ? 'day' : period === '7days' ? '7 days' : '30 days'}`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageDailySpend)}</div>
             <p className="text-xs text-muted-foreground">Based on selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCategory.name}</div>
            <p className="text-xs text-muted-foreground">{`Spent ${formatCurrency(topCategory.amount)}`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Frequent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostFrequentCategory}</div>
            <p className="text-xs text-muted-foreground">Category with most transactions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Spend by Category</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          {chartData.length > 0 ? (
            <ChartContainer config={{}} className="h-[250px] w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8}
                    tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `$${value}`} tickLine={false} axisLine={false} tickMargin={8} width={50} />
                  <Tooltip cursor={{ fill: 'hsl(var(--accent))', radius: 'var(--radius)' }} content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />} />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <p>No expense data for this period.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
