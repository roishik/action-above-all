
export type Provider = 'openai' | 'anthropic' | 'mobileye';
export type Model = string;

export type ModelOption = {
  provider: Provider;
  models: Model[];
};

export interface Tag {
  id: string;
  name: string;
}

export interface Meeting {
  id: string;
  name: string;
  date: Date;
  time: string;
  context?: string;
  notes?: string;
  transcript?: string;
  summary?: string;
  tags: Tag[];
  provider?: Provider;
  model?: Model;
}

export interface EnvironmentConfig {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  mobileyeApiKey?: string;
}
