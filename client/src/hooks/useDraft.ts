import { useCallback } from 'react';

export interface Draft {
  title: string;
  content: string;
  coverImage?: string;
  categories?: string[];
  lastSaved: number;
}

const DRAFT_KEY = 'roboblogs_draft';
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useDraft() {
  const saveDraft = useCallback((data: Omit<Draft, 'lastSaved'>) => {
    try {
      const draft: Draft = {
        ...data,
        lastSaved: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('Failed to save draft to localStorage:', error);
    }
  }, []);

  const loadDraft = useCallback((): Draft | null => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (!saved) return null;

      const draft: Draft = JSON.parse(saved);
      
      // Check expiry
      if (Date.now() - draft.lastSaved > EXPIRY_MS) {
        localStorage.removeItem(DRAFT_KEY);
        return null;
      }

      return draft;
    } catch (error) {
      console.error('Failed to load draft from localStorage:', error);
      return null;
    }
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error('Failed to clear draft from localStorage:', error);
    }
  }, []);

  return { saveDraft, loadDraft, clearDraft };
}
