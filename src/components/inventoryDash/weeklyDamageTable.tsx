import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '../ui/badge';
import type { WeeklyDamage } from '@/types/inventory.types';
import { format, parseISO } from 'date-fns';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(n);

interface WeekGroup {
  weekStart: string;
  weekEnd: string;
  rows: WeeklyDamage[];
  weekTotal: number;
}

const groupByWeek = (rows: WeeklyDamage[]): WeekGroup[] => {
  const map = new Map<string, WeekGroup>();

  for (const row of rows) {
    if (!map.has(row.week_start)) {
      map.set(row.week_start, { weekStart: row.week_start, weekEnd: row.week_end, rows: [], weekTotal: 0 });
    }
    const group = map.get(row.week_start)!;
    group.rows.push(row);
    group.weekTotal += Number(row.total_loss);
  }

  return Array.from(map.values()).sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
};

export const WeeklyDamageTable: React.FC<{ damages: WeeklyDamage[] }> = ({ damages }) => {
  const weeks = groupByWeek(damages);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Units Damaged</TableHead>
            <TableHead className="text-right">Total Loss</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weeks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                No damage data available
              </TableCell>
            </TableRow>
          ) : (
            weeks.map((week) => (
              <React.Fragment key={week.weekStart}>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-semibold">
                    Week of {format(parseISO(week.weekStart), 'MMM d')} – {format(parseISO(week.weekEnd), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-600">{fmt(week.weekTotal)}</TableCell>
                </TableRow>
                {week.rows.map((row, idx) => (
                  <TableRow key={`${week.weekStart}-${idx}`} className="hover:bg-muted/50">
                    <TableCell className="pl-8">{row.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{row.total_units_damaged}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">{fmt(row.total_loss)}</TableCell>
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