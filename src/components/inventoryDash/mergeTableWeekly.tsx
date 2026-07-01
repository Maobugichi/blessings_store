import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '../ui/badge';
import type { MergedWeeklyRow } from '@/types/inventory.types';
import { format, parseISO } from 'date-fns';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(n);

interface WeekGroup {
  weekStart: string;
  weekEnd: string;
  rows: MergedWeeklyRow[];
  weekNet: number;
}

const groupByWeek = (rows: MergedWeeklyRow[]): WeekGroup[] => {
  const map = new Map<string, WeekGroup>();

  for (const row of rows) {
    if (!map.has(row.week_start)) {
      map.set(row.week_start, { weekStart: row.week_start, weekEnd: row.week_end, rows: [], weekNet: 0 });
    }
    const group = map.get(row.week_start)!;
    group.rows.push(row);
    group.weekNet += Number(row.net_profit);
  }

  return Array.from(map.values()).sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
};

export const MergedWeeklyTable: React.FC<{ rows: MergedWeeklyRow[] }> = ({ rows }) => {
  const weeks = groupByWeek(rows);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Units Sold</TableHead>
            <TableHead className="text-right">Sales Profit</TableHead>
            <TableHead className="text-right">Units Damaged</TableHead>
            <TableHead className="text-right">Damage Loss</TableHead>
            <TableHead className="text-right">Net</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weeks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            weeks.map((week) => (
              <React.Fragment key={week.weekStart}>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={5} className="font-semibold">
                    Week of {format(parseISO(week.weekStart), 'MMM d')} – {format(parseISO(week.weekEnd), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${week.weekNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {fmt(week.weekNet)}
                  </TableCell>
                </TableRow>
                {week.rows.map((row, idx) => (
                  <TableRow key={`${week.weekStart}-${idx}`} className="hover:bg-muted/50">
                    <TableCell className="pl-8">{row.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{row.total_units_sold}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-green-600">{fmt(row.total_profit)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{row.total_units_damaged}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-red-600">{fmt(row.total_loss)}</TableCell>
                    <TableCell className={`text-right font-medium ${row.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fmt(row.net_profit)}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};