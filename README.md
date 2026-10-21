# CronPilot

An open-source developer tool for understanding cron schedules across time zones. Project by [Ahmad Yar](https://www.ahmadyar.co/).

**Status:** Initial planning, not yet a working calculator. Do not submit to launch directories as a finished product.

## Proposed MVP

- Parse and explain standard 5-field cron expressions.
- Preview upcoming execution times in a selected IANA timezone.
- Highlight DST transitions, nonexistent local times, and repeated local times.
- Explicitly distinguish system-cron semantics from schedulers that use other dialects.
- Share examples and test results for edge cases.

## Open-source foundation

We will evaluate maintained parsers including [croniter](https://github.com/pallets-eco/croniter) before selecting a dependency. Licenses, dialect coverage, and DST behavior must be checked before reuse; no code from another project is currently included.
