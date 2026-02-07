import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';

const PHASE_CONFIG = {
  detection: { color: '#EF4444', label: 'Detection', order: 1 },
  investigation: { color: '#F59E0B', label: 'Investigation', order: 2 },
  mitigation: { color: '#3B82F6', label: 'Mitigation', order: 3 },
  resolution: { color: '#10B981', label: 'Resolution', order: 4 },
  monitoring: { color: '#8B5CF6', label: 'Monitoring', order: 5 },
};

function parseTimeToMinutes(timeStr) {
  // Handle formats: "HH:MM UTC", "HH:MM", "HH:MM:SS UTC"
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

function formatMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const phaseConfig = PHASE_CONFIG[data.phase] || { label: 'Unknown', color: '#6B7280' };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 max-w-xs">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: phaseConfig.color }}
        />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
          {phaseConfig.label}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.time}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{data.event}</p>
    </div>
  );
}

function TimelineChart({ timeline, severity }) {
  if (!timeline || timeline.length < 2) return null;

  // Transform data for scatter chart
  const data = timeline.map((entry, index) => {
    const phase = entry.phase || 'investigation';
    const phaseConfig = PHASE_CONFIG[phase] || PHASE_CONFIG.investigation;
    return {
      x: index,
      y: phaseConfig.order,
      time: entry.time,
      event: entry.event,
      phase: phase,
      minutes: parseTimeToMinutes(entry.time),
    };
  });

  // Calculate duration
  const firstTime = data[0].minutes;
  const lastTime = data[data.length - 1].minutes;
  let durationMins = lastTime - firstTime;
  if (durationMins < 0) durationMins += 24 * 60; // Handle day wrap

  // Find phase transitions for reference lines
  const phaseTransitions = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i].phase !== data[i - 1].phase) {
      phaseTransitions.push(i);
    }
  }

  const severityColors = {
    P0: '#EF4444',
    P1: '#F97316',
    P2: '#F59E0B',
    P3: '#6B7280',
  };

  const phaseNames = ['', 'Detection', 'Investigation', 'Mitigation', 'Resolution', 'Monitoring'];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-atlas-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Incident Timeline</h3>
        </div>
        <div className="flex items-center gap-3">
          {/* Duration badge */}
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            Duration: {durationMins >= 60 ? `${Math.floor(durationMins / 60)}h ${durationMins % 60}m` : `${durationMins}m`}
          </span>
          {/* Severity indicator */}
          <span
            className="text-xs px-2 py-1 rounded-full font-medium text-white"
            style={{ backgroundColor: severityColors[severity] || severityColors.P2 }}
          >
            {severity || 'P2'}
          </span>
        </div>
      </div>

      {/* Phase Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(PHASE_CONFIG).map(([key, config]) => {
          const hasPhase = data.some(d => d.phase === key);
          if (!hasPhase) return null;
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{config.label}</span>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, data.length - 1]}
              tickCount={data.length}
              tickFormatter={(val) => data[val]?.time || ''}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              label={{ value: 'Timeline', position: 'bottom', offset: 15, style: { fontSize: 12, fill: '#9CA3AF' } }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0.5, 5.5]}
              tickCount={5}
              tickFormatter={(val) => phaseNames[val] || ''}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            {/* Phase transition lines */}
            {phaseTransitions.map((idx) => (
              <ReferenceLine
                key={idx}
                x={idx - 0.5}
                stroke="#D1D5DB"
                strokeDasharray="3 3"
              />
            ))}
            <Scatter data={data} fill="#8884d8">
              {data.map((entry, index) => {
                const phaseConfig = PHASE_CONFIG[entry.phase] || PHASE_CONFIG.investigation;
                return (
                  <Cell
                    key={index}
                    fill={phaseConfig.color}
                    stroke="white"
                    strokeWidth={2}
                    r={8}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Duration bar */}
      <div className="mt-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>{timeline[0]?.time}</span>
          <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            {(() => {
              // Calculate phase proportions for the duration bar
              const phases = [];
              for (let i = 0; i < data.length - 1; i++) {
                phases.push({
                  phase: data[i].phase,
                  proportion: 1 / (data.length - 1),
                });
              }
              // Merge consecutive same-phase segments
              const merged = [];
              phases.forEach((p) => {
                if (merged.length > 0 && merged[merged.length - 1].phase === p.phase) {
                  merged[merged.length - 1].proportion += p.proportion;
                } else {
                  merged.push({ ...p });
                }
              });
              return (
                <div className="flex h-full w-full">
                  {merged.map((seg, i) => (
                    <div
                      key={i}
                      className="h-full transition-all"
                      style={{
                        width: `${seg.proportion * 100}%`,
                        backgroundColor: (PHASE_CONFIG[seg.phase] || PHASE_CONFIG.investigation).color,
                      }}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
          <span>{timeline[timeline.length - 1]?.time}</span>
        </div>
      </div>
    </div>
  );
}

export default TimelineChart;
