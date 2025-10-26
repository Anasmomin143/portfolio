'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';
import { Upload, FileJson, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{ index: number; error: string; data?: unknown }>;
  duplicates: string[];
}

interface JsonImportPageProps {
  entityName: string;          // "project", "skill", etc.
  entityNamePlural: string;    // "projects", "skills", etc.
  apiEndpoint: string;         // "/api/admin/projects/import"
  redirectPath: string;        // "/admin/projects"
  backPath: string;            // "/admin/projects"
  exampleJson: object;         // Example JSON structure
}

export function JsonImportPage({
  entityName,
  entityNamePlural,
  apiEndpoint,
  redirectPath,
  backPath,
  exampleJson,
}: JsonImportPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importMode, setImportMode] = useState<'text' | 'file'>('text');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const [skipDuplicates, setSkipDuplicates] = useState(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      setError('Please upload a valid JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonInput(content);
        setError('');
      } catch {
        setError('Failed to read file');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Parse JSON
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch {
        throw new Error('Invalid JSON format. Please check your input.');
      }

      // Ensure data is in the correct format
      let importData;
      if (Array.isArray(parsedData)) {
        importData = { [entityNamePlural]: parsedData };
      } else if (parsedData[entityNamePlural] && Array.isArray(parsedData[entityNamePlural])) {
        importData = parsedData;
      } else {
        throw new Error(`Invalid format. Expected an array of ${entityNamePlural} or { ${entityNamePlural}: [...] }`);
      }

      // Add skip duplicates flag
      importData.skipDuplicates = skipDuplicates;

      // Send to API
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importData),
      });

      const data = await res.json();

      if (!res.ok && res.status !== 207) {
        throw new Error(data.error || `Failed to import ${entityNamePlural}`);
      }

      setResult(data);

      // If completely successful, redirect after 2 seconds
      if (data.success && data.imported > 0) {
        setTimeout(() => {
          router.push(redirectPath);
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Capitalize first letter
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div>
      <div className="max-w-5xl">
        {/* Import Mode Selection */}
        <div className="rounded-xl p-6 mb-6" style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={COMMON_INLINE_STYLES.text}>
            Import Method
          </h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setImportMode('text')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                importMode === 'text' ? 'scale-[1.02]' : ''
              }`}
              style={{
                background: importMode === 'text' ? THEME_GRADIENTS.secondary : 'var(--color-background)',
                borderColor: importMode === 'text' ? 'var(--color-primary)' : 'var(--card-border)',
              }}
            >
              <FileJson className="w-8 h-8 mb-2 mx-auto" style={{ color: 'var(--color-primary)' }} />
              <div className="font-medium" style={COMMON_INLINE_STYLES.text}>
                Paste JSON
              </div>
              <div className="text-xs mt-1" style={COMMON_INLINE_STYLES.textMuted}>
                Copy and paste JSON data
              </div>
            </button>

            <button
              onClick={() => setImportMode('file')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                importMode === 'file' ? 'scale-[1.02]' : ''
              }`}
              style={{
                background: importMode === 'file' ? THEME_GRADIENTS.secondary : 'var(--color-background)',
                borderColor: importMode === 'file' ? 'var(--color-primary)' : 'var(--card-border)',
              }}
            >
              <Upload className="w-8 h-8 mb-2 mx-auto" style={{ color: 'var(--color-primary)' }} />
              <div className="font-medium" style={COMMON_INLINE_STYLES.text}>
                Upload File
              </div>
              <div className="text-xs mt-1" style={COMMON_INLINE_STYLES.textMuted}>
                Upload a .json file
              </div>
            </button>
          </div>

          {/* Duplicate Handling */}
          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={skipDuplicates}
                onChange={(e) => setSkipDuplicates(e.target.checked)}
                className="w-5 h-5 rounded"
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <div>
                <span className="text-sm font-medium" style={COMMON_INLINE_STYLES.text}>
                  Skip duplicate {entityNamePlural}
                </span>
                <p className="text-xs mt-0.5" style={COMMON_INLINE_STYLES.textMuted}>
                  Don&apos;t import {entityNamePlural} with IDs that already exist
                </p>
              </div>
            </label>
          </div>

          {/* Text Input */}
          {importMode === 'text' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                JSON Data
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON data here..."
                rows={12}
                className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-300 resize-none font-mono text-sm"
                style={{
                  background: 'var(--color-background)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
          )}

          {/* File Upload */}
          {importMode === 'file' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={COMMON_INLINE_STYLES.text}>
                Upload JSON File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 rounded-lg border-2 border-dashed transition-all duration-300 hover:scale-[1.01]"
                style={{ borderColor: 'var(--card-border)' }}
              >
                <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
                <div className="font-medium mb-1" style={COMMON_INLINE_STYLES.text}>
                  Click to upload JSON file
                </div>
                <div className="text-sm" style={COMMON_INLINE_STYLES.textMuted}>
                  or drag and drop
                </div>
              </button>
              {jsonInput && (
                <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--color-background)' }}>
                  <div className="flex items-center gap-2 text-sm" style={COMMON_INLINE_STYLES.text}>
                    <CheckCircle className="w-4 h-4" style={{ color: '#10b981' }} />
                    File loaded successfully ({jsonInput.length} characters)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-lg flex items-start gap-3" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
              <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          {/* Import Button */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleImport}
              disabled={loading || !jsonInput}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: THEME_GRADIENTS.primary, color: 'white' }}
            >
              <Upload className="w-5 h-5" />
              {loading ? 'Importing...' : `Import ${capitalize(entityNamePlural)}`}
            </button>
            <Link
              href={backPath}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
              style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Import Result */}
        {result && (
          <div className="rounded-xl p-6 mb-6" style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={COMMON_INLINE_STYLES.text}>
              {result.success ? (
                <CheckCircle className="w-6 h-6" style={{ color: '#10b981' }} />
              ) : (
                <AlertCircle className="w-6 h-6" style={{ color: '#f59e0b' }} />
              )}
              Import Results
            </h2>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>
                  {result.imported}
                </div>
                <div className="text-sm" style={COMMON_INLINE_STYLES.textMuted}>
                  Successfully Imported
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#ef4444' }}>
                  {result.failed}
                </div>
                <div className="text-sm" style={COMMON_INLINE_STYLES.textMuted}>
                  Failed
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#f59e0b' }}>
                  {result.duplicates.length}
                </div>
                <div className="text-sm" style={COMMON_INLINE_STYLES.textMuted}>
                  Duplicates Skipped
                </div>
              </div>
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3" style={COMMON_INLINE_STYLES.text}>
                  Errors ({result.errors.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.errors.map((err, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg text-sm"
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                    >
                      <div className="font-medium mb-1" style={{ color: '#ef4444' }}>
                        Row {err.index + 1}: {err.error}
                      </div>
                      {err.data ? (
                        <pre className="text-xs mt-2 p-2 rounded overflow-x-auto" style={{ background: 'rgba(0,0,0,0.2)' }}>
                          {JSON.stringify(err.data as Record<string, unknown>, null, 2)}
                        </pre>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Message */}
            {result.success && result.imported > 0 && (
              <div className="mt-4 p-4 rounded-lg flex items-center gap-3" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                <p className="text-sm" style={{ color: '#10b981' }}>
                  All {entityNamePlural} imported successfully! Redirecting to {entityNamePlural} list...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Example JSON */}
        <div className="rounded-xl p-6" style={{ background: THEME_GRADIENTS.card, border: '1px solid var(--card-border)' }}>
          <h2 className="text-lg font-semibold mb-3" style={COMMON_INLINE_STYLES.text}>
            Example JSON Format
          </h2>
          <p className="text-sm mb-4" style={COMMON_INLINE_STYLES.textMuted}>
            Your JSON should follow this structure. You can import a single {entityName} or multiple {entityNamePlural} at once.
          </p>
          <pre className="p-4 rounded-lg overflow-x-auto text-xs font-mono" style={{ background: 'var(--color-background)' }}>
            {JSON.stringify(exampleJson, null, 2)}
          </pre>
          <button
            onClick={() => setJsonInput(JSON.stringify(exampleJson, null, 2))}
            className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{ background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }}
          >
            Use Example
          </button>
        </div>
      </div>
    </div>
  );
}
