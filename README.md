# CronPilot

**Know when it actually runs.** An open-source cron preview and timezone comparison workbench by [Ahmad Yar](https://www.ahmadyar.co/).

**Live:** https://cronpilot-three.vercel.app/ · **Source:** https://github.com/ahamdjin/cronpilot

## Why developers use it

A cron expression can mean something different in UTC, New York, and Karachi. CronPilot gives you an explicit scheduler time zone, upcoming UTC instants, optional secondary timezone comparisons, clear explanations for common expressions, warning notes about DST pitfalls, reproducible share links and a CSV suitable for release/incident reviews.

- Five-field Linux-style cron previews using [cron-parser](https://github.com/harrisiirak/cron-parser) (MIT).
- Select the scheduler's IANA timezone; supported IANA zones are populated where the browser supports `Intl.supportedValuesOf`.
- Preview 8, 12 or 20 occurrences, inspect local wall-clock and exact UTC timestamps.
- Compare **the same UTC instants** in a second timezone, not a second independent schedule.
- Highlight offset changes in the displayed run horizon and call out common ambiguity cases (2 AM, day/month overlap, limited months).
- Share the selected expression, timezones and **fixed ISO start instant** as a link, or export a CSV for handoff.
- Browser-only calculations; no account, backend, scheduling execution or telemetry in this app.

## Get started

Node 20+:

```sh
npm install
npm test
npm run build
npm run dev
```

The static `dist/` output can be hosted with Vercel or another static host. Install and build from the repository to verify third-party dependencies.

## Limitations

CronPilot predicts calendar occurrences and **does not execute jobs**. It is not a guaranteed representation of Vixie cron, Kubernetes CronJobs, Quartz, GitHub Actions, EventBridge or arbitrary workflow runners. Those systems can differ on day-of-month/day-of-week matching, DST, unsupported tokens, retries, skipped executions and concurrency.

The app intentionally requires **five fields** (minute, hour, day, month, weekday); six-field expressions are rejected. Start timestamps require explicit timezone offsets. DST warnings are advisory and limited to the displayed execution horizon. Natural-language explanations target common patterns; other expressions are shown field-by-field rather than claiming a complete semantic translation.

## Attribution

Parsing and timezone calendar iteration use **cron-parser** (MIT), credited to its maintainers. The application UI, sharing workflow, CSV export and tests are original MIT-licensed work by Ahmad Yar.

## Quality

`npm run build` runs unit tests first. GitHub Actions runs test/build for pushes and pull requests. Review production scheduler semantics before changing a real job.
