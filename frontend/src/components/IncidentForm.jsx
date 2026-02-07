import React, { useState, useEffect } from 'react';

const SEVERITY_OPTIONS = [
  { value: 'P0', label: 'P0 - Critical', color: 'text-red-600' },
  { value: 'P1', label: 'P1 - High', color: 'text-orange-600' },
  { value: 'P2', label: 'P2 - Medium', color: 'text-yellow-600' },
  { value: 'P3', label: 'P3 - Low', color: 'text-green-600' },
];

function IncidentForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    severity: 'P2',
    affectedSystems: '',
    description: '',
    timeline: [{ time: '', event: '' }],
    resolution: '',
    additionalContext: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        duration: initialData.duration || '',
        severity: initialData.severity || 'P2',
        affectedSystems: Array.isArray(initialData.affectedSystems)
          ? initialData.affectedSystems.join(', ')
          : initialData.affectedSystems || '',
        description: initialData.description || '',
        timeline: initialData.timeline?.length > 0
          ? initialData.timeline
          : [{ time: '', event: '' }],
        resolution: initialData.resolution || '',
        additionalContext: initialData.additionalContext || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimelineChange = (index, field, value) => {
    setFormData((prev) => {
      const newTimeline = [...prev.timeline];
      newTimeline[index] = { ...newTimeline[index], [field]: value };
      return { ...prev, timeline: newTimeline };
    });
  };

  const addTimelineEntry = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { time: '', event: '' }],
    }));
  };

  const removeTimelineEntry = (index) => {
    if (formData.timeline.length > 1) {
      setFormData((prev) => ({
        ...prev,
        timeline: prev.timeline.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const incident = {
      ...formData,
      affectedSystems: formData.affectedSystems
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      timeline: formData.timeline.filter((t) => t.time && t.event),
    };

    onSubmit(incident);
  };

  const isValid = formData.title.trim() && formData.description.trim();

  // Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && isValid) {
        e.preventDefault();
        const incident = {
          ...formData,
          affectedSystems: formData.affectedSystems
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          timeline: formData.timeline.filter((t) => t.time && t.event),
        };
        onSubmit(incident);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, isValid, onSubmit]);

  return (
    <form onSubmit={handleSubmit} id="incident-form" className="card p-6 space-y-6 animate-fade-in">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Incident Details</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Provide information about the incident for AI analysis
        </p>
      </div>

      {/* Title and Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Incident Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Trading Platform Latency Spike"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Incident Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      {/* Duration and Severity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., 2 hours 30 minutes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Severity
          </label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="input-field"
          >
            {SEVERITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Affected Systems */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Affected Systems
        </label>
        <input
          type="text"
          name="affectedSystems"
          value={formData.affectedSystems}
          onChange={handleChange}
          className="input-field"
          placeholder="e.g., Trading API, User Dashboard, Database (comma-separated)"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Incident Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="input-field resize-none"
          placeholder="Describe what happened, how it was detected, and any relevant context..."
          maxLength={10000}
          required
        />
        <div className="flex justify-between mt-1">
          <p className={`text-xs ${formData.description.length < 50 ? 'text-amber-500' : 'text-green-500'}`}>
            {formData.description.length < 50 ? 'More detail leads to better analysis' : 'Good level of detail'}
          </p>
          <p className={`text-xs ${formData.description.length > 9000 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
            {formData.description.length.toLocaleString()} / 10,000
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Timeline of Events
        </label>
        <div className="space-y-3">
          {formData.timeline.map((entry, index) => (
            <div key={index} className="flex gap-3 items-start">
              <input
                type="text"
                value={entry.time}
                onChange={(e) => handleTimelineChange(index, 'time', e.target.value)}
                className="input-field w-32"
                placeholder="14:30 UTC"
              />
              <input
                type="text"
                value={entry.event}
                onChange={(e) => handleTimelineChange(index, 'event', e.target.value)}
                className="input-field flex-1"
                placeholder="Event description"
              />
              <button
                type="button"
                onClick={() => removeTimelineEntry(index)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                disabled={formData.timeline.length === 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTimelineEntry}
          className="mt-3 text-sm text-atlas-600 hover:text-atlas-700 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Timeline Entry
        </button>
      </div>

      {/* Resolution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Resolution Steps
        </label>
        <textarea
          name="resolution"
          value={formData.resolution}
          onChange={handleChange}
          rows={3}
          className="input-field resize-none"
          placeholder="How was the incident resolved? What actions were taken?"
        />
      </div>

      {/* Additional Context */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Additional Context
        </label>
        <textarea
          name="additionalContext"
          value={formData.additionalContext}
          onChange={handleChange}
          rows={2}
          className="input-field resize-none"
          placeholder="Any other relevant information, links, or notes..."
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={!isValid}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate Post-Mortem
        </button>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 sm:ml-2 sm:mt-0 sm:inline">
          Press Ctrl+Enter to submit
        </p>
      </div>
    </form>
  );
}

export default IncidentForm;
