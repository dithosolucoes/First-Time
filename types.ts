export type View = 'dashboard' | 'notebook';

export interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'url';
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
  text: string;
  sender: 'user' | 'ai';
  citations?: Citation[];
  isLoading?: boolean;
}

export interface Note {
  id: string;
  type: 'note';
  content: string;
  fromSourceId?: string;
}

export interface GeneratedContent {
  id: string;
  type: 'audio' | 'video' | 'mindmap' | 'report' | 'flashcards' | 'test';
  title: string;
  status: 'completed' | 'pending';
}

export type StudioItem = Note | GeneratedContent;

export interface Notebook {
  id: string;
  title: string;
  sources: Source[];
  messages: Message[];
  studioItems: StudioItem[];
  category?: string;
  image?: string; // URL for featured notebooks
  icon?: React.ElementType; // Icon for recent notebooks
  lastModified: string;
  sourceCount: number;
}

export enum ModalType {
  ADD_SOURCES = 'ADD_SOURCES',
  DISCOVER_SOURCES = 'DISCOVER_SOURCES',
  GENERATE_REPORT = 'GENERATE_REPORT',
  GENERATE_AUDIO_SUMMARY = 'GENERATE_AUDIO_SUMMARY',
}

export type AudioFormatOption = 'analysis' | 'summary' | 'critique' | 'debate';
export type AudioDurationOption = 'short' | 'medium' | 'long';
