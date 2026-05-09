import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../ui/Card.jsx';

const BookingTrendChart = ({ data = [] }) => (
  <Card className="p-5">
    <h3 className="mb-4 text-lg font-semibold text-white">Booking trend</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
          <Area type="monotone" dataKey="count" stroke="#0ea5e9" fill="url(#trendFill)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export { BookingTrendChart };