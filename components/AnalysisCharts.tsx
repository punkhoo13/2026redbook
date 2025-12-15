import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  LabelList
} from 'recharts';
import { HotKeyword, ConsumerAttribute, PurchasePreference } from '../types';

const PIE_COLORS = ['#fff', '#444', '#888', '#222', '#666'];

interface HotWordsChartProps {
  data: HotKeyword[];
}

export const HotWordsChart: React.FC<HotWordsChartProps> = ({ data }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
          <XAxis 
            dataKey="word" 
            angle={-90} 
            textAnchor="end" 
            interval={0}
            tick={{ fontSize: 10, fill: '#888', fontFamily: 'Space Mono' }} 
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: '#222' }}
            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }}
          />
          <Bar 
            dataKey="volume" 
            fill="#fff" 
            barSize={20}
          >
             {/* <LabelList dataKey="volume" position="top" style={{ fill: '#fff', fontSize: 10, fontFamily: 'Space Mono' }} /> */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface ConsumerRadarChartProps {
  data: ConsumerAttribute[];
}

export const ConsumerRadarChart: React.FC<ConsumerRadarChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis 
            dataKey="attribute" 
            tick={{ fill: '#fff', fontSize: 10, fontFamily: 'Space Mono' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Index"
            dataKey="value"
            stroke="#fff"
            strokeWidth={2}
            fill="#fff"
            fillOpacity={0.1}
          />
          <Tooltip 
             contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PreferencePieChartProps {
  data: PurchasePreference[];
}

export const PreferencePieChart: React.FC<PreferencePieChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="percentage"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }}
            formatter={(value: number) => [`${value}%`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
              <div className="text-2xl font-mono font-bold">{data[0]?.percentage}%</div>
              <div className="text-[10px] uppercase text-gray-500">Top Driver</div>
          </div>
      </div>
    </div>
  );
};