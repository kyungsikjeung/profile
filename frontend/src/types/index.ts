/** 공유 도메인 타입 (백엔드 스키마와 1:1 대응). */

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  provider: string;
  is_verified: boolean;
  created_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type ProjectStatus = 'draft' | 'published' | 'archived';
export type TemplateId = 'minimal' | 'gallery' | 'studio' | 'dark-premium' | 'korean-minimal';

export interface Project {
  id: string;
  title: string;
  description: string;
  template: string;
  status: ProjectStatus;
  share_slug: string | null;
  scene_config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type ConversionState = 'queued' | 'processing' | 'done' | 'failed';

export interface ConversionJob {
  job_id: string;
  status: ConversionState;
  progress: number;
  stage: string;
  result_url: string;
  error: string;
  created_at: string;
  updated_at: string;
}

export interface UploadedFile {
  filename: string;
  url: string;
  size: number;
  content_type: string;
  width: number;
  height: number;
}

export interface Subscription {
  id: string;
  plan: string;
  status: string;
  credits_total: number;
  credits_used: number;
  credits_remaining: number;
  created_at: string;
  updated_at: string;
}
