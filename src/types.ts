export interface Issue {
  type: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface AuditAnalysis {
  issues: Issue[];
  overallSeverity: 'Low' | 'Medium' | 'High' | 'Critical';
  overallSeverityScore: number;
}

export interface HealData {
  healedCode: string;
  testSuite: string;
}

export interface SentinelResponse {
  analysis: AuditAnalysis;
  healData: HealData;
}
