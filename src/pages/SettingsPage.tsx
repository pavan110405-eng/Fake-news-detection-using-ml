import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Shield,
  Save,
  CheckCircle2,
  Sliders,
  Trash2,
  Cpu,
  Layers,
  Percent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { globalPacClassifier } from '../ml/pacModel';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, showToast } = useApp();

  const [regularizationC, setRegularizationC] = useState('1.0');
  const [decisionThreshold, setDecisionThreshold] = useState('0.0');
  const [sublinearTf, setSublinearTf] = useState(true);
  const [ngramRange, setNgramRange] = useState('unigram_bigram');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cVal = parseFloat(regularizationC) || 1.0;
    globalPacClassifier.train(undefined, 50, cVal);
    showToast(`PAC Model configuration updated (PA-II C=${cVal})`, 'success');
  };

  const metrics = globalPacClassifier.getMetrics();

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
          Platform & Model Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure the Passive-Aggressive Classifier (PA-II) inference engine, regularization, and visual interface.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Model Hyperparameters */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>PA-II Model Parameters</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-500 font-semibold">
              Benchmark Accuracy: {(metrics.accuracy * 100).toFixed(1)}%
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Regularization Parameter (PA-II Slack C): <span className="font-mono text-blue-500">{regularizationC}</span>
                </label>
                <span className="text-[11px] text-slate-400">Controls aggressiveness of hinge loss weight updates</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={regularizationC}
                onChange={(e) => setRegularizationC(e.target.value)}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Decision Margin Bias (Threshold $\tau$): <span className="font-mono text-blue-500">{decisionThreshold}</span>
                </label>
                <span className="text-[11px] text-slate-400">0.0 = Standard Hinge Loss Zero Boundary</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.05"
                value={decisionThreshold}
                onChange={(e) => setDecisionThreshold(e.target.value)}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Sub-linear Term Frequency Scaling (1 + log(tf))
                </span>
                <span className="text-[11px] text-slate-400">
                  Prevents repetitive keywords from disproportionately skewing the L2 normalized vector
                </span>
              </div>
              <input
                type="checkbox"
                checked={sublinearTf}
                onChange={(e) => setSublinearTf(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Display & Visual Interface */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">
            Display & Visual Interface
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Color Palette Theme</div>
              <p className="text-slate-400 text-[11px]">
                Toggle between light workspace mode and dark intelligence mode.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
