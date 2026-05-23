export interface UserInput {
  username: string;
  niche: string;
  format: "Reels" | "Photos" | "Carousels" | "Mixed";
  language: string;
}

export interface NicheAnalysis {
  primary: string;
  secondary: string | null;
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

export interface ContentStyleAnalysis {
  formats: string[];
  dominantFormat: string;
  tone: string;
  postingPattern: string;
  visualStyle: string;
}

export interface LanguageAnalysis {
  primary: string;
  secondary: string | null;
  region: string;
  audienceNote: string;
}

export interface TrendingTopic {
  title: string;
  format: "Reel" | "Carousel" | "Static";
  hook: string;
  rationale: string;
}

export interface AnalysisResult {
  niche: NicheAnalysis;
  contentStyle: ContentStyleAnalysis;
  language: LanguageAnalysis;
  trendingTopics: TrendingTopic[];
}

export interface APISuccessResponse {
  username: string;
  analysis: AnalysisResult;
}

export interface APIErrorResponse {
  error: { code: string; message: string };
}
