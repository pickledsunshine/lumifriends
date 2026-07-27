# Lumifriends Partner Portal — prototype

Frontend prototype of the Lumifin partner referral portal, built to
`Lumifriends partner build vF.md` and matching the Google Stitch screens in
`../screens/`.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Lucide · Recharts.
No backend — all data comes from one mock layer.

## Running it

```bash
npm install     # already done
npm run dev     # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

**Log in with referral code `XINCHAO100` and any password.** Claim-account
accepts the same code with a password of 8+ characters.

## Routes

| Route | What it covers |
|---|---|
| `/login` | Split-screen sign-in, inline error state |
| `/claim-account` | First-time setup + success modal |
| `/dashboard` | KPI row, activation chart, referral card, recent activations |
| `/activations` | Filterable, sortable, paginated table + CSV export |
| `/payouts` | Current cycle, status tracker, history, details modal |
| `/referral-tools` | QR, sharing actions, venue materials |
| `/account` | Partnership details, security, support |
| `/logout` | Clears the session, returns to `/login` |

## Where things live

```
src/
├── app/
│   ├── (portal)/            authenticated routes, share AuthenticatedLayout
│   ├── login, claim-account, logout
│   ├── globals.css          design tokens (@theme) — spec §3
│   └── layout.tsx           Quicksand + ToastProvider
├── components/
│   ├── auth/                split layout, password field
│   ├── brand/               wordmark + glyph
│   ├── dashboard/           ActivationChart
│   ├── layout/              Sidebar, drawer, TopHeader, PageHeader
│   ├── payouts/             PayoutStatusTracker
│   ├── referral/            QrCode, ReferralCodeCard, MaterialDownloadCard
│   ├── tables/              ActivationsTable, PayoutHistoryTable
│   └── ui/                  Button, Card, Modal, StatusChip, Fields, …
└── lib/
    ├── mock-data.ts         single source of data — swap for an API client
    ├── format.ts            VND / date / cycle formatting (spec §13)
    ├── session.tsx          prototype session (web storage)
    └── download.ts          CSV, file and clipboard helpers
```

## Notes for whoever takes this further

**One number changed from the spec.** §7.4 defines the cycle as 34 activations
of which 33 are valid and 1 is under review, while §7.5 states 34 *valid*
activations totalling 3,400,000 VND. Both cannot hold. Because §12 requires
under-review activations to be excluded from payouts, the portal derives the
figure from the records: **33 valid × 100,000 VND = 3,300,000 VND (≈ €123)**.
Nothing is hard-coded, so confirming the rule the other way is a one-line change
in `mock-data.ts` (make the under-review record an extra row rather than one of
the 34).

**Dashboard edge states** (§12) are behind the "Active cycle" selector in the
dashboard header: no activations, above reference target, and cycle rollover.

**QR codes are real**, generated from `partner.referralLink`, and scan through
to `https://lumifin.io/join/XINCHAO100`.

**Venue materials** download real placeholder SVGs from `public/materials/`.
Replacing those four files swaps in the final artwork — no component changes.

**QR download formats**: PNG exports a 1024px image; PDF opens the A5 print
sheet so the browser can save it as PDF.
