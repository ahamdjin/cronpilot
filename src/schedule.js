import { CronExpressionParser } from 'cron-parser';

/** Return timezone-aware previews without depending on the browser's local timezone. */
export function previewSchedule(expression, options = {}) {
  const expr = String(expression ?? '').trim().replace(/\s+/g, ' ');
  if (expr.split(' ').length !== 5) throw new Error('Enter exactly five cron fields (minute hour day month weekday).');
  const timezone = options.timezone || 'UTC';
  const count = Number(options.count ?? 8);
  if (!Number.isInteger(count) || count < 1 || count > 25) throw new Error('Preview count must be between 1 and 25.');
  const from = options.from ? new Date(options.from) : new Date();
  if (options.from && !/^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/i.test(options.from)) throw new Error('Use a timestamp with an explicit timezone, e.g. 2026-10-22T12:00:00Z.');
  if (Number.isNaN(from.getTime())) throw new Error('Invalid start timestamp. Use ISO format with a timezone.');
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, year: 'numeric', month: 'short', day: '2-digit',
    weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZoneName: 'shortOffset'
  });
  // cron-parser strict mode requires six fields; validate our five-field dialect above.
  const iterator = CronExpressionParser.parse(expr, { currentDate: from, tz: timezone });
  const runs = [];
  for (let i = 0; i < count; i += 1) {
    const date = iterator.next().toDate();
    const parts = formatter.formatToParts(date);
    const offset = parts.find(part => part.type === 'timeZoneName')?.value || '';
    runs.push({ iso: date.toISOString(), local: formatter.format(date), offset });
  }
  return {
    expression: expr, timezone, runs,
    offsetChanges: runs.slice(1).filter((run, index) => run.offset !== runs[index].offset).length
  };
}
