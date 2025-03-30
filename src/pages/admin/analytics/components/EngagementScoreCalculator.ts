
interface EngagementScoreParams {
  bounceRate: string;
  averageTimeOnSite: number;
  pagesPerSession: number;
}

export class EngagementScoreCalculator {
  static calculateScore({ bounceRate, averageTimeOnSite, pagesPerSession }: EngagementScoreParams): number {
    // Parse numeric values from string representations
    const bounceRateValue = Number(bounceRate.replace('%', ''));
    const avgTimeOnSite = averageTimeOnSite;
    
    // Calculate engagement score with realistic thresholds and curve
    // Time on site (seconds): Apply diminishing returns curve
    // 0-30s: poor (0-5 points), 30-120s: okay (5-15 points), 120s+: good (15-25 points)
    let timeScore = 0;
    if (avgTimeOnSite < 30) {
      timeScore = Math.floor((avgTimeOnSite / 30) * 5);
    } else if (avgTimeOnSite < 120) {
      timeScore = 5 + Math.floor(((avgTimeOnSite - 30) / 90) * 10);
    } else {
      timeScore = 15 + Math.floor(Math.min(10, (avgTimeOnSite - 120) / 30));
    }
    
    // Bounce rate: 0-100% → 0-40 points (inverted, lower is better)
    // Industry average is around 40-60%, so calibrate accordingly
    const bounceScore = Math.max(0, Math.min(40, Math.round((100 - bounceRateValue) * 0.6)));
    
    // Pages per session: Most sessions are 1-3 pages
    // 1 page: 0-10 points, 2 pages: 10-20 points, 3+ pages: 20-35 points
    let pagesScore = 0;
    if (pagesPerSession <= 1) {
      pagesScore = Math.round(pagesPerSession * 10);
    } else if (pagesPerSession <= 2) {
      pagesScore = 10 + Math.round((pagesPerSession - 1) * 10);
    } else {
      pagesScore = 20 + Math.min(15, Math.round((pagesPerSession - 2) * 7.5));
    }
    
    // Calculate final score and ensure it's between 0-100
    return Math.min(100, Math.max(0, Math.round(timeScore + bounceScore + pagesScore)));
  }
}
