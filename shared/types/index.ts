// ScamShield AI v2 — Shared TypeScript Types
// Used across scamshield-frontend and scamshield-backend

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────
export type ScanType =
  | 'TEXT'
  | 'URL'
  | 'CHAT'
  | 'SCREENSHOT'
  | 'DOCUMENT'
  | 'EMAIL'
  | 'FILE';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type RiskLevelUpper = 'LOW' | 'MEDIUM' | 'HIGH';

export type ReportStatus = 'PENDING' | 'VERIFIED' | 'RESOLVED';

export type AIProvider = 'mock' | 'gemini';

// ─────────────────────────────────────────────────────────────────────────────
// Scan Result — the normalized response from FastAPI / Express
// ─────────────────────────────────────────────────────────────────────────────
export interface ScanResult {
  risk_score: number;         // 0–100
  risk_level: RiskLevel;      // Low | Medium | High
  category: string;           // e.g. "Phishing", "OTP Fraud"
  confidence: number;         // 0.0–1.0
  reasons: string[];          // Array of human-readable trigger reasons
  recommendation: string;     // One-line action recommendation
  explanation: string;        // Detailed explanation paragraph
  source: string;             // "mock" | "gemini" | "rule_based_only" | "url_heuristics"
}

// ─────────────────────────────────────────────────────────────────────────────
// Database Row Types (matching Supabase tables)
// ─────────────────────────────────────────────────────────────────────────────
export interface DbUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface DbScan {
  id: string;
  user_id: string;
  scan_type: ScanType;
  input_text: string | null;
  risk_score: number;
  risk_level: RiskLevel;
  category: string;
  confidence: number;
  explanation: string | null;
  reasons: string[];
  source: string;
  created_at: string;
}

export interface DbUploadedFile {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  extracted_text: string | null;
  scan_id: string | null;
  created_at: string;
}

export interface DbAnalytics {
  id: string;
  user_id: string;
  total_scans: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  updated_at: string;
}

export interface DbCommunityReport {
  id: string;
  user_id: string | null;
  report_text: string;
  category: string;
  status: ReportStatus;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API Request/Response Types
// ─────────────────────────────────────────────────────────────────────────────
export interface ScanRequest {
  scan_type: ScanType;
  text?: string;
  url?: string;
}

export interface ScanResponse extends DbScan {
  scan_result: ScanResult;
}

export interface DashboardStats {
  total_scans: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  security_score: number;       // 0–100: % of scans that were safe
  recent_scans: DbScan[];
  weekly_activity: WeeklyActivity[];
  category_distribution: CategoryCount[];
}

export interface WeeklyActivity {
  date: string;                 // ISO date string e.g. "2024-06-17"
  count: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface HistoryFilters {
  scan_type?: ScanType;
  risk_level?: RiskLevel;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedScans {
  data: DbScan[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AnalyticsData {
  security_score: number;
  total_scans: number;
  weekly_trends: WeeklyActivity[];
  category_distribution: CategoryCount[];
  risk_distribution: {
    high: number;
    medium: number;
    low: number;
  };
}
