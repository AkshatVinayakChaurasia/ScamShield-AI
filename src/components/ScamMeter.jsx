/**
 * Visual scam-score meter. Renders a semicircular gauge (0-100) plus the
 * raw numeric score in mono type. Color encodes risk: low risk reads green,
 * medium reads amber, high reads red — same mapping the backend uses for
 * the "risk" field, so the gauge and the label never contradict each other.
 *
 * @param {number} score - scam probability score, 0-100
 * @param {"Low"|"Medium"|"High"} risk - risk level label from the API
 */
export default function ScamMeter({ score = 0, risk = "Low" }) {
  const clampedScore = Math.max(0, Math.min(100, Number(score) || 0));

  const colorMap = {
    Low: { stroke: "#3ddc97", text: "text-signal" },
    Medium: { stroke: "#f5a623", text: "text-amber" },
    High: { stroke: "#ff5c5c", text: "text-alarm" },
  };
  const { stroke, text } = colorMap[risk] || colorMap.Low;

  // Semicircle gauge geometry: radius 80, drawn from 180deg to 0deg (left to right).
  const radius = 80;
  const circumference = Math.PI * radius; // half the circle's circumference
  const filledLength = (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="h-32 w-52">
        {/* Background track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#27344a"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Filled arc representing the score */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={stroke}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${filledLength} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.6s ease-out" }}
        />
        <text
          x="100"
          y="88"
          textAnchor="middle"
          className="font-mono"
          style={{ fontSize: "32px", fontWeight: 600, fill: "#f6f5f1" }}
        >
          {Math.round(clampedScore)}
        </text>
        <text
          x="100"
          y="104"
          textAnchor="middle"
          className="font-mono"
          style={{ fontSize: "11px", fill: "#93a1b8" }}
        >
          / 100
        </text>
      </svg>
      <p className={`mt-1 font-mono text-sm font-medium uppercase tracking-wide ${text}`}>
        {risk} risk
      </p>
    </div>
  );
}
