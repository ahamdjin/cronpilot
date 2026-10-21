# CronPilot — DevHunt submission pack

**Submission has not been made.** Confirm that the latest version is deployed at https://cronpilot-three.vercel.app/ before submitting.

**Product name:** CronPilot

**Tagline:** Preview cron jobs across timezones and DST changes

**Short summary:** Open-source cron expression previewer with timezone-aware execution times, DST pitfall warnings, clear schedule explanations, a second-timezone comparison, reproducible share links, and CSV exports.

**Live tool:** https://cronpilot-three.vercel.app/

**Source:** https://github.com/ahamdjin/cronpilot

**Category:** Developer Tools / Productivity / Open Source (choose available matches).

**Pricing:** Free and open source.

**Maker:** Ahmad Yar

## Why this exists

Cron is deceptively simple until daylight-saving time or a scheduler's timezone changes. CronPilot helps a developer preview the *actual UTC instants* corresponding to the expression in their scheduler timezone, examine those instants in a second timezone, and share a repeatable schedule preview for incident or release discussions. Unlike tools that only parse the five fields, it includes explicit DST and dialect caveats.

## Graphics

Download `cronpilot-launch-gallery` from the **Browser tests** workflow artifacts for the square product icon and genuine UI screenshots. `public/logo.svg` is the original icon source.

## Boundaries

This tool previews standard five-field cron expressions; it does not run jobs or emulate every platform's cron dialect. Scheduler-specific DST behavior and concurrency should be verified against the actual deployed scheduler.
