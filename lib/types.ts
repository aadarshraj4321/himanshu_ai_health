export interface AnalysisResult {
  summary: string;
  keywords: string[];
  inputText: string;
  timestamp: number;
  id: string;
}

export interface ApiResponse {
  summary: string;
  keywords: string[];
}

export interface ApiError {
  error: string;
}
