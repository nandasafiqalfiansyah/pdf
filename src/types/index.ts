export type ToolCategory = 'all' | 'edit-manage' | 'organize' | 'convert-from' | 'convert-to' | 'optimize';

export interface ToolDef {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  category: ToolCategory;
  accentColor: string;
  badge?: string;
  accept: string;
  multiple: boolean;
}

export interface ProcessedFileResult {
  fileName: string;
  blob: Blob;
  downloadUrl: string;
  originalSize: number;
  newSize: number;
  type: string;
  pagesCount?: number;
}
