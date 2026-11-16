import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BookingTrendChart = ({ data = [] }) => (
  <div className="h-full w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C26D53" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#C26D53" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" vertical={false} />
        <XAxis dataKey="date" stroke="#78716C" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#78716C" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1C1917',
            borderColor: '#292524',
            borderRadius: 12,
            color: '#FAF7F2',
            fontSize: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          itemStyle={{ color: '#FAF7F2' }}
        />
        <Area type="monotone" dataKey="count" stroke="#C26D53" fill="url(#trendFill)" strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export { BookingTrendChart };
