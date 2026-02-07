import React from 'react';

function HeroSection({ onShowComparison }) {
  return (
    <div className="card p-8 text-center animate-fade-in">
      {/* Tagline */}
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-atlas-100 dark:bg-atlas-900/30 text-atlas-700 dark:text-atlas-400 mb-4">
        AI-Powered Incident Analysis
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
        Turn Chaos into <span className="text-atlas-600">Clarity</span>
      </h2>
      <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        ATLAS analyzes your incident data and generates comprehensive, SRE-grade post-mortem reports
        in seconds - not hours.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
        <StatCard
          value="~70%"
          label="Faster"
          detail="vs. manual writing"
          color="text-green-600 dark:text-green-400"
          bg="bg-green-50 dark:bg-green-900/20"
        />
        <StatCard
          value="100%"
          label="Consistent"
          detail="Standardized format"
          color="text-atlas-600 dark:text-atlas-400"
          bg="bg-atlas-50 dark:bg-atlas-900/20"
        />
        <StatCard
          value="7"
          label="Sections"
          detail="Actionable insights"
          color="text-purple-600 dark:text-purple-400"
          bg="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="#incident-form" className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Start Analysis
        </a>
        {onShowComparison && (
          <button
            onClick={onShowComparison}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            See the Difference
          </button>
        )}
      </div>
    </div>
  );
}

function StatCard({ value, label, detail, color, bg }) {
  return (
    <div className={`${bg} rounded-xl p-4`}>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{label}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{detail}</div>
    </div>
  );
}

export default HeroSection;
