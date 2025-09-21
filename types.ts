import type { LucideIcon } from 'lucide-react';

export interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'url' | 'text';
  content: string;
  summary: string;
  keyTopics: string[];
}

export interface Citation {
  sourceId: string;
  citationNumber: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: Citation[];
  isLoading?: boolean;
}

export interface Note {
  id: string;
  type: 'note';
  content: string;
}

export interface GeneratedContent {
  id:string;
  type: 'audio' | 'video' | 'mindmap' | 'report' | 'flashcards' | 'test';
  title: string;
  status: 'pending' | 'completed';
  url?: string;
  details?: any; // Para armazenar o conteúdo gerado (texto do relatório, JSON dos flashcards, etc.)
}

export type StudioItem = Note | GeneratedContent;

export interface Notebook {
  id: string;
  title: string;
  lastModified: string;
  sourceCount: number;
  sources: Source[];
  messages: Message[];
  studioItems: StudioItem[];
  isFeatured?: boolean;
  category?: string;
  image?: string;
  icon?: LucideIcon;
}

export type View = 'dashboard' | 'notebook';

export enum ModalType {
  ADD_SOURCES = 'ADD_SOURCES',
  DISCOVER_SOURCES = 'DISCOVER_SOURCES',
  GENERATE_AUDIO_SUMMARY = 'GENERATE_AUDIO_SUMMARY',
  GENERATE_REPORT = 'GENERATE_REPORT',
  GENERATE_FLASHCARDS = 'GENERATE_FLASHCARDS',
  GENERATE_TEST = 'GENERATE_TEST',
}