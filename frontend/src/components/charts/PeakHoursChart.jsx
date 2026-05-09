import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../ui/Card.jsx';

const PeakHoursChart = ({ data = [] }) => (
  <Card className="p-5">
    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Peak hours</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="hour" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
          <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="url(#peakGradient)" />
          <defs>
            <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export { PeakHoursChart };