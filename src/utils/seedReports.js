/**
 * Static seed data for the Community Reports page.
 *
 * Shaped to match the response the real GET /api/reports endpoint will
 * eventually return: { reports: [{ category, count, lastSeen, trend }] }
 * Swapping this for a real `getReports()` call later is a one-line change
 * in the page component — no shape changes needed.
 */

export const SEED_REPORTS = [
  {
    category: "Phishing",
    count: 4821,
    lastSeen: "2026-06-19",
    trend: "up",
    description:
      "Fake emails or messages impersonating banks, brands, or authorities to steal credentials.",
  },
  {
    category: "OTP Fraud",
    count: 3294,
    lastSeen: "2026-06-20",
    trend: "up",
    description:
      "Messages tricking victims into sharing one-time passwords or PINs.",
  },
  {
    category: "Delivery Scam",
    count: 2157,
    lastSeen: "2026-06-20",
    trend: "up",
    description:
      "Fake courier or customs notices demanding a small fee to release a 'held' package.",
  },
  {
    category: "Job Scam",
    count: 1873,
    lastSeen: "2026-06-18",
    trend: "steady",
    description:
      "Unrealistic work-from-home offers requiring an upfront registration or training fee.",
  },
  {
    category: "Lottery Scam",
    count: 1502,
    lastSeen: "2026-06-17",
    trend: "down",
    description:
      "Claims of winning a prize or lottery, asking for a processing fee to release winnings.",
  },
  {
    category: "Investment Scam",
    count: 1284,
    lastSeen: "2026-06-19",
    trend: "up",
    description:
      "Promises of guaranteed high returns on crypto or stock investments with no real product behind them.",
  },
  {
    category: "Other",
    count: 612,
    lastSeen: "2026-06-15",
    trend: "steady",
    description: "Scam patterns that don't cleanly fit another category.",
  },
];

export const TOTAL_REPORTS = SEED_REPORTS.reduce((sum, r) => sum + r.count, 0);
