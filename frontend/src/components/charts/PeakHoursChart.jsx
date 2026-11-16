import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const PeakHoursChart = ({ data = [] }) => (
  <div className="h-full w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" vertical={false} />
        <XAxis dataKey="hour" stroke="#78716C" fontSize={11} tickLine={false} axisLine={false} />
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
        <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#C26D53" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export { PeakHoursChart };
