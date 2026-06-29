import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, ArrowRight, AlertTriangle, Lightbulb, TrendingUp, Info } from 'lucide-react';
import { useEffect, useRef } from 'react';

const SUGGESTIONS = [
  "What is the overall trend?",
  "Are there any anomalies?",
  "Can you summarize the top categories?",
];

function InitialOverview({ aiData }) {
  if (!aiData) return null;
  const data = typeof aiData === 'string' ? JSON.parse(aiData) : aiData;

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blush/20 p-6 rounded-xl border border-taupe/20">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-serif text-2xl font-semibold">AI Summary</h4>
          <div className="flex space-x-2 text-sm font-medium">
            <span className="px-3 py-1 bg-white border border-grey-light rounded-full">
              Health: {data?.metrics?.overallHealthScore ?? 0}/100
            </span>
            <span className={\`px-3 py-1 rounded-full \${getPriorityColor(data?.metrics?.priority)}\`}>
              {data?.metrics?.priority} Priority
            </span>
          </div>
        </div>
        <p className="text-black leading-relaxed">{data.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-grey-light p-5 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="w-5 h-5 text-taupe" />
            <h5 className="font-semibold text-lg">Key Insights</h5>
          </div>
          <div className="space-y-3">
            {data.insights?.map((insight, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-grey-light/50 rounded-lg">
                <div className={\`w-2 h-2 mt-2 rounded-full \${getSeverityColor(insight.severity)}\`} />
                <div>
                  <h6 className="font-medium text-sm">{insight.title}</h6>
                  <p className="text-xs text-taupe mt-1">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-grey-light p-5 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-5 h-5 text-taupe" />
            <h5 className="font-semibold text-lg">Recommendations</h5>
          </div>
          <div className="space-y-3">
            {data.recommendations?.map((rec, idx) => (
              <div key={idx} className="p-3 bg-grey-light/50 rounded-lg">
                <h6 className="font-medium text-sm">{rec.title}</h6>
                <p className="text-xs text-taupe mt-1">{rec.description}</p>
                <div className="mt-2 text-xs font-medium text-black bg-white px-2 py-1 rounded inline-block">
                  Impact: {rec.expectedImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DynamicChart({ type, data }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  if (type === 'chart-line') {
    return (
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECEC" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#73705F', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#73705F', fontSize: 12 }} dx={-10} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="value" stroke="#000000" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'chart-bar') {
    return (
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECEC" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#73705F', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#73705F', fontSize: 12 }} dx={-10} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f9fafb' }} />
            <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="mt-4 overflow-x-auto border border-grey-light rounded-lg">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xs uppercase bg-grey-light border-b border-grey-light text-taupe font-semibold">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={i !== data.length - 1 ? 'border-b border-grey-light' : ''}>
                <td className="px-6 py-4 font-medium">{row.name}</td>
                <td className="px-6 py-4">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

export default function OutputPanel({ outputs, isThinking, onSuggestionClick, project }) {
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
            {outputs.map((output, idx) => {
              const isInitial = output.type === 'initial-overview';
              
              return (
                <div key={output.id || idx} className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                  {!isInitial && (
                    <div className="mb-4">
                      <h3 className="font-serif text-2xl font-semibold text-black">Analysis</h3>
                    </div>
                  )}
                  
                  {isInitial ? (
                    <InitialOverview aiData={output.insight} />
                  ) : (
                    <div className="bg-white border border-grey-light rounded-xl p-6 shadow-sm">
                      <div className="prose prose-sm max-w-none text-black leading-relaxed mb-4">
                        <p>{output.insight}</p>
                      </div>
                      <DynamicChart type={output.type} data={output.chart_data} />
                    </div>
                  )}
                </div>
              );
            })}
            
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
