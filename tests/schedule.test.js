import test from 'node:test';
import assert from 'node:assert/strict';
import { previewSchedule } from '../src/schedule.js';

test('returns upcoming weekday runs in selected timezone', () => {
  const result = previewSchedule('0 9 * * 1-5', { timezone: 'Asia/Karachi', from: '2026-10-22T00:00:00Z', count: 3 });
  assert.equal(result.runs.length, 3);
  assert.match(result.runs[0].local, /09:00/);
  assert.ok(result.runs[0].iso < result.runs[1].iso);
});
test('rejects six-field cron rather than silently interpreting a different dialect', () => {
  assert.throws(() => previewSchedule('0 0 9 * * *'), /five cron fields/);
});
test('rejects invalid timestamps and counts', () => {
  assert.throws(() => previewSchedule('* * * * *', { from: 'not-a-date' }), /Invalid start/);
  assert.throws(() => previewSchedule('* * * * *', { count: 500 }), /Preview count/);
});
test('detects a New York DST offset change in spring preview', () => {
  const r = previewSchedule('0 9 * * *', { timezone: 'America/New_York', from: '2027-03-12T00:00:00Z', count: 6 });
  assert.ok(r.offsetChanges >= 1);
});
