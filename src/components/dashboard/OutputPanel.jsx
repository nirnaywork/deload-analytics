import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

const SUGGESTIONS = [
  "Show me revenue trends by month",
  "What are my top 5 products?",
  "Any unusual spikes this quarter?",
];

const MOCK_LINE_DATA = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
];

const MOCK_BAR_DATA = [
  { name: 'Product A', sales: 400 },
  { name: 'Product B', sales: 300 },
  { name: 'Product C', sales: 300 },
  { name: 'Product D', sales: 200 },
  { name: 'Product E', sales: 100 },
];

const MOCK_TABLE_DATA = [
  { id: 1, region: 'North America', users: '12,450', conversion: '4.2%' },
  { id: 2, region: 'Europe', users: '8,230', conversion: '3.8%' },
  { id: 3, region: 'Asia Pacific', users: '5,100', conversion: '5.1%' },
  { id: 4, region: 'Latin America', users: '2,800', conversion: '2.9%' },
];

function ChartResult({ type }) {
  if (type === 'line') {
    return (
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_LINE_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECEC" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#73705F', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#73705F', fontSize: 12 }} dx={-10} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="profit" stroke="#DDC9BD" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MOCK_BAR_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECEC" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#73705F', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#73705F', fontSize: 12 }} dx={-10} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f9fafb' }} />
          <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TableResult() {
  return (
    <div className="mt-4 overflow-x-auto border border-grey-light rounded-lg">
      <table className="w-full text-sm text-left text-black">
        <thead className="text-xs uppercase bg-grey-light border-b border-grey-light text-taupe font-semibold">
          <tr>
            <th className="px-6 py-3">Region</th>
            <th className="px-6 py-3">Active Users</th>
            <th className="px-6 py-3">Conversion Rate</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_TABLE_DATA.map((row, i) => (
            <tr key={row.id} className={i !== MOCK_TABLE_DATA.length - 1 ? 'border-b border-grey-light' : ''}>
              <td className="px-6 py-4 font-medium">{row.region}</td>
              <td className="px-6 py-4">{row.users}</td>
              <td className="px-6 py-4">{row.conversion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OutputPanel({ outputs, isThinking, onSuggestionClick }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputs, isThinking]);

  return (
    <div className="w-full md:w-[70%] h-full bg-white flex flex-col relative overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth"
      >
        {outputs.length === 0 && !isThinking ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="font-serif text-4xl lg:text-5xl font-semibold mb-4 text-black">Ask anything about your data</h1>
              <p className="text-taupe text-lg">Select a suggestion below or type your own question.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 w-full">
              {SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="flex items-center space-x-2 bg-grey-light border border-grey-light hover:border-black hover:bg-white text-black px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-sm"
                >
                  <span>{suggestion}</span>
                  <ArrowRight className="w-4 h-4 text-taupe" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {outputs.map((output) => (
              <div key={output.id} className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="mb-4">
                  <h3 className="font-serif text-2xl font-semibold text-black">{output.question}</h3>
                </div>
                
                <div className="bg-white border border-grey-light rounded-xl p-6 shadow-sm">
                  {output.type === 'text' && (
                    <div className="prose prose-sm max-w-none text-black leading-relaxed">
                      <p>{output.data}</p>
                    </div>
                  )}
                  {output.type === 'chart-line' && (
                    <div>
                      <p className="text-sm text-black mb-2">{output.insight}</p>
                      <ChartResult type="line" />
                    </div>
                  )}
                  {output.type === 'chart-bar' && (
                    <div>
                      <p className="text-sm text-black mb-2">{output.insight}</p>
                      <ChartResult type="bar" />
                    </div>
                  )}
                  {output.type === 'table' && (
                    <div>
                      <p className="text-sm text-black mb-2">{output.insight}</p>
                      <TableResult />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex items-center space-x-3 text-taupe py-4 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Analyzing data...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
