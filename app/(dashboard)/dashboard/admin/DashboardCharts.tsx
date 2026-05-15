"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrencyCLP } from '@/lib/utils'

export default function DashboardCharts({ data }: { data: any[] }) {
  return (
    <div className="w-full h-[450px] bg-white dark:bg-[#242729] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Comparativa de Ventas B2B vs B2C</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorB2B" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#20B2AA" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#20B2AA" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorB2C" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `$${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
                }
                if (value >= 1000) {
                  return `$${(value / 1000).toFixed(0)}k`;
                }
                return `$${value}`;
              }}
              dx={-10}
            />
            <Tooltip 
              formatter={(value: any) => formatCurrencyCLP(Number(value) || 0)}
              contentStyle={{ backgroundColor: '#1A1C1E', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area 
              type="monotone" 
              dataKey="b2b" 
              name="Ventas Institucionales (B2B)"
              stroke="#20B2AA" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorB2B)" 
            />
            <Area 
              type="monotone" 
              dataKey="b2c" 
              name="Ventas Minoristas (B2C)"
              stroke="#8B5CF6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorB2C)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
