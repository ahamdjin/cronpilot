import './style.css';
import { previewSchedule } from './schedule.js';
import { explainCron, formatInZone, parseSharedSettings, scheduleCsv } from './insights.js';

const $ = id => document.getElementById(id);
const form = $('schedule-form');
const expression = $('expression');
const timezone = $('timezone');
const count = $('count');
const from = $('from');
const compareZone = $('compare-zone');
const runs = $('runs');
const status = $('status');
let currentReport = null;

function timezoneChoices() {
  try {
    const supported = Intl.supportedValuesOf('timeZone');
    for(const zone of supported) {
      if([...timezone.options].some(opt=>opt.value===zone)) continue;
      const opt=document.createElement('option');opt.value=zone;opt.textContent=zone.replaceAll('_',' ');
      timezone.append(opt);
    }
    for(const zone of supported) {
      if([...compareZone.options].some(opt=>opt.value===zone)) continue;
      const opt=document.createElement('option');opt.value=zone;opt.textContent=zone.replaceAll('_',' ');
      compareZone.append(opt);
    }
  }catch{ /* Keep curated IANA choices on older browsers. */ }
}
function noteWarnings() {
  const insight=explainCron(expression.value);
  $('explain').textContent=insight.summary;
  const warnings=$('warnings');
  warnings.replaceChildren();
  for(const warning of insight.warnings){
    const p=document.createElement('p');p.textContent='⚠ '+warning;warnings.append(p);
  }
}
function render() {
  runs.replaceChildren();
  currentReport=null;
  $('export-csv').disabled=true;
  noteWarnings();
  try {
    const result = previewSchedule(expression.value, { timezone: timezone.value, count: Number(count.value), from: from.value.trim() });
    currentReport=result;
    status.className='status success';
    status.textContent=result.offsetChanges
      ? 'Timezone offset changes within this preview. Check execution times near DST transitions.'
      : 'Schedule validated · '+result.runs.length+' upcoming execution times';
    const secondary=compareZone.value;
    $('compare-note').textContent=secondary ? 'Comparison zone: '+secondary+'. Both clocks describe the same UTC instant, not separate schedules.' : 'Local clock and UTC instant shown for each occurrence.';
    for(const [index,run]of result.runs.entries()){
      const row=document.createElement('li');
      const number=document.createElement('span');number.className='run-number';number.textContent=String(index+1).padStart(2,'0');
      const content=document.createElement('div');content.className='run-content';
      const local=document.createElement('strong');local.textContent=run.local;
      const utc=document.createElement('small');utc.textContent='UTC: '+run.iso;
      content.append(local,utc);
      if(secondary){
        const compared=document.createElement('small');compared.textContent=secondary+': '+formatInZone(run.iso,secondary);compared.className='compare-time';
        content.append(compared);
      }
      row.append(number,content);
      if(index && run.offset!==result.runs[index-1].offset){
        const badge=document.createElement('span');badge.className='dst-badge';badge.textContent='Offset change';row.append(badge);
      }
      runs.append(row);
    }
    $('export-csv').disabled=false;
  }catch(error){
    $('compare-note').textContent='';
    status.className='status error';
    status.textContent=error instanceof Error?error.message:'Unable to preview this schedule.';
  }
}
function download(text,name,mime) {
  const url=URL.createObjectURL(new Blob([text],{type:mime}));
  const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function shareUrl(){
  const url=new URL(window.location.href);
  url.search='';
  url.searchParams.set('cron',expression.value.trim());
  url.searchParams.set('tz',timezone.value);
  url.searchParams.set('n',count.value);
  url.searchParams.set('from',from.value.trim()||new Date().toISOString());
  if(compareZone.value)url.searchParams.set('compare',compareZone.value);
  return url.toString();
}
form.addEventListener('submit',event=>{event.preventDefault();render();});
document.querySelectorAll('[data-cron]').forEach(button=>button.addEventListener('click',()=>{expression.value=button.dataset.cron;render();}));
$('export-csv').addEventListener('click',()=>{if(currentReport)download(scheduleCsv(currentReport,compareZone.value),'cronpilot-schedule.csv','text/csv;charset=utf-8');});
$('copy-link').addEventListener('click',async()=>{
  try{
    const url=shareUrl();
    await navigator.clipboard.writeText(url);
    status.textContent='Shareable link copied. It includes a fixed start timestamp for reproducible results.';
  }catch {status.textContent='Clipboard unavailable. Use the address bar after opening your schedule on HTTPS.';}
});
const shared=parseSharedSettings(window.location.search);
timezoneChoices();
if(shared.expression)expression.value=shared.expression;
if(shared.timezone)timezone.value=shared.timezone;
if(shared.compare)compareZone.value=shared.compare;
if(shared.count)count.value=String(shared.count);
if(shared.from)from.value=shared.from;
render();
