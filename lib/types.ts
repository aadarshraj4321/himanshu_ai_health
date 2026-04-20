export interface AnalysisResult {
  summary: string;
  keywords: string[];
  possibleCauses: string[];
  careSuggestions: string[];
  redFlags: string[];
  inputText: string;
  timestamp: number;
  id: string;
}

export interface ApiResponse {
  summary: string;
  keywords: string[];
  possibleCauses: string[];
  careSuggestions: string[];
  redFlags: string[];
}

export interface ApiError {
  error: string;
}
