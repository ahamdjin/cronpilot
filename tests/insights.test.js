import test from 'node:test';
import assert from 'node:assert/strict';
import {explainCron,formatInZone,parseSharedSettings,scheduleCsv} from '../src/insights.js';
import {previewSchedule} from '../src/schedule.js';

test('explains everyday cron without claiming full scheduler semantics',()=>{
 assert.match(explainCron('0 9 * * 1-5').summary,/Monday/);
 assert.match(explainCron('*/15 * * * *').summary,/15 minutes/);
 assert.ok(explainCron('0 2 * * *').warnings.some(x=>x.includes('DST')));
});
test('identifies important cron dialect edge cases',()=>{
 assert.ok(explainCron('0 8 1 * 5').warnings.some(x=>x.includes('day-of-month')));
 assert.ok(explainCron('0 8 31 * *').warnings.some(x=>x.includes('months')));
});
test('share settings ignore untrusted URLs and reject timezone-less dates',()=>{
 const r=parseSharedSettings('?cron=0+9+*+*+1-5&tz=Asia%2FKarachi&n=12&from=2026-10-22T00%3A00%3A00Z&compare=UTC');
 assert.deepEqual(r,{expression:'0 9 * * 1-5',timezone:'Asia/Karachi',count:12,from:'2026-10-22T00:00:00Z',compare:'UTC'});
 assert.equal(parseSharedSettings('?cron=x&tz=Garbage%2FPlace&from=2026-10-22T01%3A00%3A00').from,undefined);
});
test('CSV preserves same UTC instants in compared timezones',()=>{
 const r=previewSchedule('0 9 * * *',{timezone:'Asia/Karachi',count:2,from:'2026-10-22T00:00:00Z'});
 assert.match(formatInZone(r.runs[0].iso,'America/New_York'),/Oct/);
 const csv=scheduleCsv(r,'America/New_York');
 assert.match(csv,/America\/New_York/);
 assert.ok(csv.includes(r.runs[0].iso));
 assert.equal(csv.trim().split('\n').length,3);
});
test('requires explicit timezone in provided start time',()=>{
 assert.throws(()=>previewSchedule('* * * * *',{from:'2026-10-22T09:00:00'}),/explicit timezone/);
 assert.throws(()=>previewSchedule('* * * * *',{count:0}),/Preview count/);
});
