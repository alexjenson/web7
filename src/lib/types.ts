export interface InstagramProfile {
  username: string;
  full_name: string;
  biography: string;
  profile_pic_url: string;
  follower_count: number;
  following_count: number;
  media_count: number;
  is_private: boolean;
  is_verified: boolean;
  category_name: string | null;
  external_url: string | null;
}

export interface InstagramPost {
  type: "IMAGE" | "VIDEO" | "SIDECAR";
  caption: string;
  likes: number;
  comments: number;
  views: number | null;
  visual_description: string | null;
  timestamp: number;
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
  profile: InstagramProfile;
  analysis: AnalysisResult;
}

export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export type APIResponse = APISuccessResponse | APIErrorResponse;
