# ScamShield AI — Frontend

Next.js (App Router) + Tailwind CSS frontend for ScamShield AI.

## Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Environment variables

Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## Structure

```
src/
├── app/
│   ├── page.js                  # Home page
│   ├── analyze-text/page.js     # Text scam detection
│   ├── analyze-url/page.js      # URL scam detection
│   ├── upload-screenshot/page.js # Screenshot scam detection
│   ├── reports/page.js          # Community reports
│   ├── learn/page.js            # Scam education hub
├── components/                  # Reusable UI components
├── services/                    # API client (api.js)
├── utils/                       # Validators, helpers
```

See the root `README.md` for full project architecture.
