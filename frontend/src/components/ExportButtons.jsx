import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { compressToEncodedURIComponent } from 'lz-string';
import { useToast } from '../utils/ToastContext';

function ExportButtons({ postMortem, title }) {
  const [exporting, setExporting] = useState(null);
  const toast = useToast();

  const copyToClipboard = async () => {
    const md = generateMarkdown(postMortem, title);
    try {
      await navigator.clipboard.writeText(md);
      toast.success('Report copied to clipboard');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = md;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.success('Report copied to clipboard');
    }
  };

  const exportToMarkdown = () => {
    setExporting('md');
    try {
      const md = generateMarkdown(postMortem, title);
      downloadFile(md, `${sanitizeFilename(title)}-postmortem.md`, 'text/markdown');
      toast.success('Markdown exported');
    } finally {
      setExporting(null);
    }
  };

  const exportToJSON = () => {
    setExporting('json');
    try {
      const json = JSON.stringify(postMortem, null, 2);
      downloadFile(json, `${sanitizeFilename(title)}-postmortem.json`, 'application/json');
      toast.success('JSON exported');
    } finally {
      setExporting(null);
    }
  };

  const shareReport = async () => {
    try {
      const shareData = {
        title: title || 'Post-Mortem Report',
        postMortem,
      };
      const compressed = compressToEncodedURIComponent(JSON.stringify(shareData));
      const url = `${window.location.origin}${window.location.pathname}#share=${compressed}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Failed to generate share link');
    }
  };

  const exportToPDF = () => {
    setExporting('pdf');
    try {
      const doc = new jsPDF();
      let y = 20;

      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title || 'Post-Mortem Report', 20, y);
      y += 10;

      // Severity badge
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Severity: ${postMortem.impact?.severity || 'P2'}`, 20, y);
      y += 15;

      // Executive Summary
      y = addSection(doc, 'Executive Summary', postMortem.executive_summary, y);

      // Root Cause
      y = addSection(doc, 'Root Cause', postMortem.root_cause, y);

      // Contributing Factors
      if (postMortem.contributing_factors?.length > 0) {
        y = addListSection(doc, 'Contributing Factors', postMortem.contributing_factors, y);
      }

      // Timeline
      if (postMortem.timeline?.length > 0) {
        y = addTimelineSection(doc, postMortem.timeline, y);
      }

      // What Went Well
      if (postMortem.what_went_well?.length > 0) {
        y = addListSection(doc, 'What Went Well', postMortem.what_went_well, y);
      }

      // Action Items
      if (postMortem.action_items?.length > 0) {
        y = addActionItemsSection(doc, postMortem.action_items, y);
      }

      doc.save(`${sanitizeFilename(title)}-postmortem.pdf`);
      toast.success('PDF exported');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="flex gap-2">
        <button
          onClick={copyToClipboard}
          className="btn-secondary text-sm flex items-center gap-1"
          title="Copy full report to clipboard"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy
        </button>
        <button
          onClick={exportToMarkdown}
          disabled={exporting}
          className="btn-secondary text-sm flex items-center gap-1"
          title="Export as Markdown"
        >
          {exporting === 'md' ? <Spinner /> : <MarkdownIcon />}
          MD
        </button>
        <button
          onClick={exportToPDF}
          disabled={exporting}
          className="btn-secondary text-sm flex items-center gap-1"
          title="Export as PDF"
        >
          {exporting === 'pdf' ? <Spinner /> : <PDFIcon />}
          PDF
        </button>
        <button
          onClick={exportToJSON}
          disabled={exporting}
          className="btn-secondary text-sm flex items-center gap-1"
          title="Export as JSON"
        >
          {exporting === 'json' ? <Spinner /> : <JSONIcon />}
          JSON
        </button>
        <button
          onClick={() => window.print()}
          className="btn-secondary text-sm flex items-center gap-1"
          title="Print report"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
        <button
          onClick={shareReport}
          className="btn-primary text-sm flex items-center gap-1"
          title="Generate shareable link"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}

function generateMarkdown(postMortem, title) {
  let md = `# ${title || 'Post-Mortem Report'}\n\n`;
  md += `**Severity:** ${postMortem.impact?.severity || 'P2'}\n`;
  md += `**Generated:** ${new Date(postMortem.generated_at).toLocaleString()}\n\n`;

  md += `## Executive Summary\n\n${postMortem.executive_summary}\n\n`;
  md += `## Root Cause\n\n${postMortem.root_cause}\n\n`;

  if (postMortem.contributing_factors?.length > 0) {
    md += `## Contributing Factors\n\n`;
    postMortem.contributing_factors.forEach((f) => {
      md += `- ${f}\n`;
    });
    md += '\n';
  }

  if (postMortem.timeline?.length > 0) {
    md += `## Timeline\n\n`;
    postMortem.timeline.forEach((t) => {
      md += `- **${t.time}**: ${t.event}\n`;
    });
    md += '\n';
  }

  md += `## Impact Assessment\n\n`;
  md += `- **Severity:** ${postMortem.impact?.severity}\n`;
  md += `- **Affected Systems:** ${postMortem.impact?.affected_systems?.join(', ')}\n`;
  md += `- **User Impact:** ${postMortem.impact?.user_impact}\n`;
  md += `- **Business Impact:** ${postMortem.impact?.business_impact}\n\n`;

  if (postMortem.what_went_well?.length > 0) {
    md += `## What Went Well\n\n`;
    postMortem.what_went_well.forEach((w) => {
      md += `- ${w}\n`;
    });
    md += '\n';
  }

  if (postMortem.action_items?.length > 0) {
    md += `## Action Items\n\n`;
    md += `| Priority | Description | Owner | Effort |\n`;
    md += `|----------|-------------|-------|--------|\n`;
    postMortem.action_items.forEach((a) => {
      md += `| ${a.priority} | ${a.description} | ${a.owner} | ${a.effort} |\n`;
    });
    md += '\n';
  }

  return md;
}

function addSection(doc, title, content, y) {
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(content || '', 170);
  doc.text(lines, 20, y);
  y += lines.length * 5 + 10;
  return y;
}

function addListSection(doc, title, items, y) {
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  items.forEach((item) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const lines = doc.splitTextToSize(`• ${item}`, 170);
    doc.text(lines, 20, y);
    y += lines.length * 5 + 2;
  });
  y += 8;
  return y;
}

function addTimelineSection(doc, timeline, y) {
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Timeline', 20, y);
  y += 8;

  doc.setFontSize(10);
  timeline.forEach((t) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(t.time, 20, y);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(t.event, 140);
    doc.text(lines, 50, y);
    y += Math.max(lines.length * 5, 5) + 3;
  });
  y += 8;
  return y;
}

function addActionItemsSection(doc, items, y) {
  if (y > 220) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Action Items', 20, y);
  y += 10;

  items.forEach((item, i) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`[${item.priority}]`, 20, y);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(item.description, 140);
    doc.text(lines, 45, y);
    y += lines.length * 5;
    doc.setFontSize(9);
    doc.text(`Owner: ${item.owner} | Effort: ${item.effort}`, 45, y);
    y += 8;
  });
  return y;
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name) {
  return (name || 'postmortem')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function MarkdownIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.27 19.385H1.73A1.73 1.73 0 010 17.655V6.345a1.73 1.73 0 011.73-1.73h20.54A1.73 1.73 0 0124 6.345v11.31a1.73 1.73 0 01-1.73 1.73zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.077h-2.308l-2.307 2.885-2.308-2.885H3.461v7.846zM21.231 12h-2.308V8.077h-2.307V12h-2.308l3.461 4.039z" />
    </svg>
  );
}

function PDFIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
      <path d="M8 12h1.5v4H8v-4zm2.5 0h1.5c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1h-1v1h-1v-4h.5zm1 2v-1h.5v1h-.5zm2.5-2h1.5c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1h-1.5v-4zm1 3v-2h.5v2h-.5z" />
    </svg>
  );
}

function JSONIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 3h2v2H5v5a2 2 0 01-2 2 2 2 0 012 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 00-2-2H0v-2h1a2 2 0 002-2V5a2 2 0 012-2m14 0a2 2 0 012 2v4a2 2 0 002 2h1v2h-1a2 2 0 00-2 2v4a2 2 0 01-2 2h-2v-2h2v-5a2 2 0 012-2 2 2 0 01-2-2V5h-2V3h2m-7 12a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m-4 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m8 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1z" />
    </svg>
  );
}

export default ExportButtons;
