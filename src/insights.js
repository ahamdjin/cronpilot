const TZ_FMT = { year:'numeric', month:'short', day:'2-digit', weekday:'short', hour:'2-digit', minute:'2-digit', hour12:false, timeZoneName:'shortOffset' };

export function explainCron(expression) {
  const fields=String(expression).trim().split(/\s+/);
  if(fields.length!==5) return {summary:'Use five fields: minute hour day month weekday.',warnings:[]};
  const [minute,hour,day,month,weekday]=fields;
  const summary= minute==='*'&&hour==='*'&&day==='*'&&month==='*'&&weekday==='*' ? 'Every minute' :
    minute.startsWith('*/')&&hour==='*'&&day==='*'&&month==='*'&&weekday==='*' ? 'Every '+minute.slice(2)+' minutes' :
    hour==='*'&&day==='*'&&month==='*'&&weekday==='*' ? 'At minute '+minute+' of each hour' :
    day==='*'&&month==='*'&&weekday==='*'&&/^\d+$/.test(minute)&&/^\d+$/.test(hour) ? 'Every day at '+hour.padStart(2,'0')+':'+minute.padStart(2,'0')+' (schedule timezone)' :
    day==='*'&&month==='*'&&weekday==='1-5'&&/^\d+$/.test(minute)&&/^\d+$/.test(hour) ? 'Monday–Friday at '+hour.padStart(2,'0')+':'+minute.padStart(2,'0') :
    'Cron fields: minute '+minute+', hour '+hour+', day '+day+', month '+month+', weekday '+weekday;
  const warnings=[];
  if(day!=='*'&&weekday!=='*') warnings.push('Both day-of-month and weekday are restricted. Cron dialects may combine these conditions differently.');
  if((hour==='2'||hour==='02')&&month==='*') warnings.push('02:xx schedules may be skipped or shifted at spring DST transitions in some timezones.');
  if(/(?:^|,)(?:29|30|31)(?:,|$)/.test(day)) warnings.push('Some calendar months do not contain day 29, 30 or 31; verify your actual upcoming dates.');
  if(/[LW#?]/.test(expression))warnings.push('Some special cron tokens belong to different scheduler dialects; validate your production scheduler.');
  return {summary,warnings};
}
export function formatInZone(iso,zone) {
  return new Intl.DateTimeFormat('en-US',{...TZ_FMT,timeZone:zone}).format(new Date(iso));
}
export function parseSharedSettings(search) {
  const params=new URLSearchParams(search);
  const expr=params.get('cron');
  const zone=params.get('tz');
  const count=params.get('n');
  const from=params.get('from');
  const compare=params.get('compare');
  const result={};
  if(expr && expr.length<=120 && expr.split(/\s+/).length===5) result.expression=expr;
  if(zone && zone.length<=100){try{new Intl.DateTimeFormat('en-US',{timeZone:zone});result.timezone=zone;}catch{}}
  if(compare && compare.length<=100){try{new Intl.DateTimeFormat('en-US',{timeZone:compare});result.compare=compare;}catch{}}
  if(count && [8,12,20].includes(Number(count)))result.count=Number(count);
  if(from && from.length<=40 && /^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/i.test(from) && !Number.isNaN(Date.parse(from)))result.from=from;
  return result;
}
export function scheduleCsv(result,compareZone) {
  const q=value=>'"'+String(value).replace(/"/g,'""')+'"';
  const rows=[['#','UTC instant','Schedule-local execution','UTC offset', 'Comparison timezone', 'Comparison local instant']];
  result.runs.forEach((run,i)=>rows.push([i+1,run.iso,run.local,run.offset,compareZone,compareZone?formatInZone(run.iso,compareZone):'']));
  return rows.map(row=>row.map(q).join(',')).join('\r\n')+'\r\n';
}
