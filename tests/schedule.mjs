import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const ids=['course-ledger-body','daily-agenda','daily-title','today-badge','date-title','date-subtitle','top-date','today-focus','today-meal','phase-line','live-clock','current-task-title','current-task-time','next-task-title','next-task-time'];
const document={hidden:false,querySelector:id=>new Map(ids.map(x=>['#'+x,{innerHTML:'',textContent:'',append(){}}])).get(id)||null,createElement(){return {className:'',innerHTML:'',append(){}}},addEventListener(){}};
const context={document,console,Date,setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){}};
vm.runInNewContext(`${source}\n;globalThis.__test={composeDailyAgenda,intensiveSprintActive,intensiveSprintStart,intensiveSprintEnd,majorFirstDayCompletedUnits,majorSecondDayCompletedUnits,reportedBrushCompleted,reportedBrushRemaining,brushPlanLagDays,brushFocusFor};`,context,{filename:'app.js'});
const {composeDailyAgenda,intensiveSprintActive,intensiveSprintStart,intensiveSprintEnd,majorFirstDayCompletedUnits,majorSecondDayCompletedUnits,reportedBrushCompleted,reportedBrushRemaining,brushPlanLagDays,brushFocusFor}=context.__test;
const mins=t=>{const [h,m]=t.split(':').map(Number);return h*60+m};
if(intensiveSprintStart!=='2026-09-12'||intensiveSprintEnd!=='2026-09-24')throw new Error('sprint must cover exactly 9/12-9/24');
if(majorFirstDayCompletedUnits!==3||majorSecondDayCompletedUnits!==0)throw new Error('only 436 units 1-3 are confirmed; 9/11 must not add unit 4');
if(reportedBrushCompleted!==17||reportedBrushRemaining!==15||brushPlanLagDays!==3)throw new Error('9/10 880 result and 9/11 deferment must remain exact');
for(let d=new Date('2026-09-12T12:00:00');d<=new Date('2026-09-24T12:00:00');d.setDate(d.getDate()+1)){
 const key=d.toISOString().slice(0,10),{data,overflow}=composeDailyAgenda(new Date(d),0);
 if(!intensiveSprintActive(key)||overflow.length)throw new Error(`${key} must use a self-contained intensive plan`);
 if(data[0].start!=='06:00'||data.at(-1).end!=='24:00')throw new Error(`${key} must preserve the 06:00-24:00 boundary`);
 for(let i=1;i<data.length;i++)if(data[i-1].end!==data[i].start)throw new Error(`${key} has a gap or overlap at ${data[i-1].end}`);
 if(data.some(x=>x.type==='course'||x.type==='fhsu'||x.type==='homework'))throw new Error(`${key} must be an all-day study plan without class/BB blocks`);
 if(!data.some(x=>x.type==='major'&&x.note.includes('候选')))throw new Error(`${key} must keep 436 as candidate work`);
 if(!data.some(x=>x.title.includes('880')&&x.note.includes('P=前置未学')))throw new Error(`${key} must retain P/W/A triage`);
 if(!data.some(x=>x.type==='sleep'&&x.end==='24:00'&&x.title.includes('00:00关灯')))throw new Error(`${key} must retain midnight lights-out`);
}
const day1=composeDailyAgenda(new Date('2026-09-12T12:00:00'),0).data;
['第4–6个欠账优先','矩阵的分块','矩阵相似 01','2010年 Text 1','先补9月10日剩余15题'].forEach(text=>{if(!day1.some(x=>`${x.title} ${x.note}`.includes(text)))throw new Error(`9/12 missing carried task: ${text}`)});
const focus=brushFocusFor(new Date('2026-09-12T12:00:00'),day1);
if(!focus||focus.carryoverCount!==0||focus.actualCompleted!==null)throw new Error('9/12 must schedule the queue without falsely claiming it was completed');
console.log('SCHEDULE_OK sprint_days=13 confirmed_436=3 880_carryover=15');