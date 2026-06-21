/**
 * Static educational content for the Learn page (Scam Education Hub).
 * Pure content data — no API needed, this is reference material.
 */

export const SCAM_TYPES = [
  {
    title: "Phishing",
    summary:
      "Fake emails, texts, or websites designed to look like a trusted brand or institution, aiming to steal your login credentials or personal information.",
    redFlags: [
      "Urgent language demanding immediate action",
      "Links that don't match the real company's domain",
      "Generic greetings like 'Dear Customer' instead of your name",
      "Requests to 'verify' or 'confirm' your account",
    ],
  },
  {
    title: "OTP Fraud",
    summary:
      "Scammers trick you into sharing a one-time password (OTP) or PIN sent to your phone, then use it to access your account or complete a transaction in your name.",
    redFlags: [
      "Anyone asking you to share an OTP over call, SMS, or chat",
      "Claims that an OTP is needed to 'cancel' a transaction you didn't make",
      "Pressure to act within minutes 'or your account will be locked'",
    ],
  },
  {
    title: "Job Scam",
    summary:
      "Fake job offers — often work-from-home — that promise unrealistic pay for minimal effort, then ask for an upfront 'registration' or 'training' fee.",
    redFlags: [
      "Job offers you didn't apply for, with no interview",
      "Any request for payment before you've started working",
      "Requests for your bank details very early in the process",
      "Pay that sounds too good for the described work",
    ],
  },
  {
    title: "Investment Scam",
    summary:
      "Promises of guaranteed, high returns on crypto, stocks, or forex — usually with fabricated screenshots of 'profits' and pressure to invest more.",
    redFlags: [
      "Guaranteed returns — real investments always carry risk",
      "Pressure to recruit friends or family into the scheme",
      "Unregistered or unlicensed 'advisors' or platforms",
    ],
  },
  {
    title: "Lottery Scam",
    summary:
      "Notification that you've won a prize or lottery you never entered, requiring a 'processing fee' or 'tax payment' before the winnings can be released.",
    redFlags: [
      "Winning a lottery you never entered",
      "Any fee required to 'release' a prize",
      "Pressure to keep the win confidential",
    ],
  },
  {
    title: "Delivery Scam",
    summary:
      "Fake courier or customs notices claiming a package delivery failed, asking for a small redelivery or customs fee via a suspicious link.",
    redFlags: [
      "Unexpected delivery notices for packages you didn't order",
      "Small payment requests via an unfamiliar link",
      "Threats that the package will be 'returned' or 'destroyed'",
    ],
  },
];

export const OTP_SAFETY_TIPS = [
  "Never share an OTP with anyone, even if they claim to be from your bank or a government agency.",
  "Legitimate companies never call or message asking you to read out an OTP.",
  "An OTP you didn't request means someone else is trying to access your account — change your password immediately.",
  "Enable two-factor authentication using an authenticator app where possible, instead of relying solely on SMS.",
];

export const GENERAL_PREVENTION_TIPS = [
  {
    title: "Pause before you act",
    detail:
      "Scams rely on urgency. If a message pressures you to act 'immediately' or 'within minutes,' that pressure itself is a red flag.",
  },
  {
    title: "Verify through a separate channel",
    detail:
      "If you get a suspicious message from your bank, call the number on the back of your card — not a number provided in the message.",
  },
  {
    title: "Check the actual link, not the link text",
    detail:
      "Hover over (or long-press) a link before clicking to see where it really goes. A link that says 'paypal.com' can point anywhere.",
  },
  {
    title: "No legitimate request needs your password or OTP",
    detail:
      "No real company, bank, or government office will ever ask you to share a password, PIN, or OTP over call, SMS, or chat.",
  },
  {
    title: "If it sounds too good to be true, it is",
    detail:
      "Unexpected prizes, guaranteed investment returns, and unrealistic job pay are the oldest tricks for a reason — they work.",
  },
];
