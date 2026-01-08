import React from 'react';
import { Card, CardContent } from '@/components/ui/card';


interface StatsCardProps {
  title: string;
  value: string;
  icon:any
  iconColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, iconColor }) => {

  const colorMap: Record<string, { bg: string; text: string }> = {
  "orange-600": {
    bg: "bg-orange-600/20",
    text: "text-orange-600",
  },
  "green-600": {
    bg: "bg-green-600/20",
    text: "text-green-600",
  },
  "blue-600": {
    bg: "bg-blue-600/20",
    text: "text-blue-600",
  },
};
const colors = colorMap[iconColor];
  return (
    <Card className='relative'>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-2 ${colors.bg} rounded-full absolute top-5 right-5  `}>
            <Icon weight="fill" className={`${colors.text} `} size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};