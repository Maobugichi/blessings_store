import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HiEye, HiEyeOff } from "react-icons/hi";

interface StatsCardProps {
  title: string;
  value: string;
  icon:any
  iconColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, iconColor }) => {
  const [showBalance, setShowBalance] = useState<boolean>(false);
  
  const colorMap: Record<string, { bg: string; text: string }> = {
    "orange-600": { bg: "bg-orange-600/20", text: "text-orange-600" },
    "green-600": { bg: "bg-green-600/20", text: "text-green-600" },
    "blue-600": { bg: "bg-blue-600/20", text: "text-blue-600" },
  };

  const colors = colorMap[iconColor];

  return (
    <Card className='relative'>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-muted-foreground  tracking-normal leading-tight">{title}</p>
            <p
              onClick={() => setShowBalance(!showBalance)}
              className="text-3xl w-full font-mono tabular-nums font-semibold tracking-normal  leading-tight text-left transition flex items-center gap-2 group -ml-1 pl-1 pr-2 py-1 rounded hover:bg-gray-50 active:bg-gray-100 relative "
              
            >
              {showBalance ? (
                value
              ) : (
                <>₦ <span className="relative top-1 text-gray-400 tracking-wider">*****</span></>
              )}
             
             <span className="absolute right-2 top-1/2 -translate-y-1/2">
              {showBalance ? (
                <HiEye className="text-gray-400 md:opacity-0 md:group-hover:opacity-100 transition" size={18} />
              ) : (
                <HiEyeOff className="text-gray-400 md:opacity-0 md:group-hover:opacity-100 transition" size={18} />
              )}
            </span>
            </p>
          </div>
          
          <div className={`p-1.5 absolute top-5 right-5 ${colors.bg} rounded-full`}>
            <Icon weight="fill" className={`${colors.text}`} size={22} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};