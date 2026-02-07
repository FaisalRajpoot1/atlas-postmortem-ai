import React, { useState, useEffect } from 'react';
import { decompressFromEncodedURIComponent } from 'lz-string';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ComparisonView from './components/ComparisonView';
import IncidentForm from './components/IncidentForm';
import PostMortemDisplay from './components/PostMortemDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import SampleIncidents from './components/SampleIncidents';
import HistoryPanel from './components/HistoryPanel';
import { analyzeIncident } from './utils/api';
import { addToHistory } from './utils/storage';
import { useToast } from './utils/ToastContext';
import { getLLMInfo } from './utils/api';

function App() {
  const [postMortem, setPostMortem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [incidentData, setIncidentData] = useState(null);
  const [lastSubmittedIncident, setLastSubmittedIncident] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [llmProvider, setLlmProvider] = useState('AI');
  const toast = useToast();

  useState(() => {
    getLLMInfo()
      .then((info) => setLlmProvider(info.label))
      .catch(() => setLlmProvider('AI'));
  });

  // Check for shared report in URL hash
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#share=')) {
        const compressed = hash.slice('#share='.length);
        const json = decompressFromEncodedURIComponent(compressed);
        if (json) {
          const shareData = JSON.parse(json);
          if (shareData.postMortem) {
            setPostMortem(shareData.postMortem);
            setIncidentData({ title: shareData.title });
            // Clean the URL hash without reloading
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
            toast.info('Shared report loaded');
          }
        }
      }
    } catch (err) {
      console.error('Failed to load shared report:', err);
    }
  }, []);

  const handleSubmit = async (incident) => {
    setLoading(true);
    setError(null);
    setIncidentData(incident);
    setLastSubmittedIncident(incident);

    try {
      const result = await analyzeIncident(incident);
      setPostMortem(result.postMortem);
      addToHistory(incident.title, incident.severity, result.postMortem);
      toast.success('Post-mortem generated successfully');
    } catch (err) {
      setError(err.message || 'Failed to generate post-mortem. Please try again.');
      setPostMortem(null);
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sample) => {
    setIncidentData(sample);
    setPostMortem(null);
    setError(null);
    setShowComparison(false);
    toast.info('Sample incident loaded');
  };

  const handleLoadFromHistory = (entry) => {
    setPostMortem(entry.postMortem);
    setIncidentData({ title: entry.title });
    setError(null);
    setShowComparison(false);
    toast.info('Report loaded from history');
  };

  const handleReset = () => {
    setPostMortem(null);
    setIncidentData(null);
    setError(null);
    setShowComparison(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner />
        ) : postMortem ? (
          <PostMortemDisplay
            postMortem={postMortem}
            incidentTitle={incidentData?.title}
            onReset={handleReset}
          />
        ) : showComparison ? (
          <ComparisonView onClose={() => setShowComparison(false)} />
        ) : (
          <div className="space-y-8">
            <HeroSection onShowComparison={() => setShowComparison(true)} />

            <SampleIncidents onLoadSample={handleLoadSample} />

            <HistoryPanel onLoadReport={handleLoadFromHistory} />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                  {lastSubmittedIncident && (
                    <button
                      onClick={() => handleSubmit(lastSubmittedIncident)}
                      className="ml-4 px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-md transition-colors flex-shrink-0"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}

            <IncidentForm
              onSubmit={handleSubmit}
              initialData={incidentData}
            />
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto no-print transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Built for Deriv AI Talent Sprint 2026 | Powered by {llmProvider}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
