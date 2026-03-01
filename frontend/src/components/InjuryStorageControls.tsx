import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trash2, Save, Loader2 } from 'lucide-react';

interface InjuryStorageControlsProps {
  onStore: () => void;
  onDispose: () => void;
  isStoring: boolean;
  isStored: boolean;
}

export default function InjuryStorageControls({
  onStore,
  onDispose,
  isStoring,
  isStored,
}: InjuryStorageControlsProps) {
  if (isStored) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">
            Injury record stored successfully
          </p>
          <p className="text-xs text-green-600/80 dark:text-green-500 mt-0.5">
            Your injury photos and analysis have been saved. Use the Export button below to generate an insurance report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
          Store or dispose of this injury record?
        </p>
        <p className="text-xs text-amber-600/80 dark:text-amber-500 mt-1 leading-relaxed">
          <strong>Store</strong> saves the photos and analysis to your report for insurance purposes.{' '}
          <strong>Dispose</strong> clears all data without saving — photos will not be retained.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onStore}
          disabled={isStoring}
          className="flex-1 gap-2"
          size="sm"
        >
          {isStoring ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isStoring ? 'Storing…' : 'Store for Insurance'}
        </Button>

        <Button
          variant="outline"
          onClick={onDispose}
          disabled={isStoring}
          className="flex-1 gap-2 border-destructive/40 text-destructive hover:bg-destructive/5"
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
          Dispose
        </Button>
      </div>
    </div>
  );
}
