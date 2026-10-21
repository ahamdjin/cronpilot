# CronPilot

**Know when it actually runs.** An accessible, browser-based cron preview tool by [Ahmad Yar](https://www.ahmadyar.co/).

CronPilot translates standard **five-field cron** expressions into upcoming execution timestamps for a selected IANA timezone, detects timezone offset changes in the displayed results, and highlights daylight-saving pitfalls. It does not execute scheduled tasks.

## Run locally

Node.js 20+:

    npm install
    npm run dev

Open the local URL printed by Vite. For production: `npm run build` and deploy the `dist/` directory to a static host (including Vercel).

## Test

    npm test
    npm run build

## Why it exists

A cron expression that looks obvious can mean a different instant in New York, Karachi or London. Unlike naive UTC converters, CronPilot asks for the **scheduler's timezone** and renders both local execution timestamps and UTC instants.

- Five-field cron only; six-field / Quartz syntax is intentionally rejected.
- Upcoming scheduled instants are calculated using [cron-parser](https://github.com/harrisiirak/cron-parser) and its timezone-aware iterator.
- Displays timezone offset changes among the selected preview rows. This does not exhaustively detect every possible DST edge case.
- Uses the browser's local clock as the default starting instant, while explicit overrides must have an ISO timestamp with timezone.
- Your cron input is processed locally in the browser; no backend, login or telemetry in the app itself.

**Scheduler semantics vary.** Some cron implementations differ in day-of-month vs weekday matching, unsupported tokens, DST behavior and execution guarantees. Verify your production scheduler.

## Foundation and license

- [cron-parser](https://github.com/harrisiirak/cron-parser) (MIT): parser, calendar iteration, timezone support. Used as a dependency, not copied.
- Original UI and tests by Ahmad Yar. Project source licensed MIT; dependency licenses remain with their authors.

Status: functional MVP source. Build and test on your machine/CI before distribution; not yet announced as launched.
