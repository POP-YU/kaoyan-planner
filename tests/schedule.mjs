import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const nodes = new Map(['course-ledger-body','daily-agenda','daily-title','today-badge','date-title','top-date','today-focus','today-meal','phase-line','live-clock'].map(id => [id, {innerHTML:'',textContent:'',append(){}}]));
const document = {
  hidden: false,
  querySelector(selector){ return nodes.get(selector.slice(1)) ?? null; },
  createElement(){ return {className:'',innerHTML:'',append(){}}; },
  addEventListener(){}
};
const context = {document,console,Date,setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){}};
vm.runInNewContext(`${source}\n;globalThis.__plannerTest={baseClasses,routines,study1,week2,phaseBlocks,schedules,highIntensityStartWeek,strictStartDate,strictDateSchedules,septemberContinuation,probabilityRawDurations,probabilityMathScope,probabilityModules,courseLedger,math880Required,selfCheckRules,taskCheck,routeData,datedBlocks,currentRouteIndex};`, context, {filename:'app.js'});
const {baseClasses,routines,study1,week2,schedules,highIntensityStartWeek,strictStartDate,strictDateSchedules,septemberContinuation,probabilityRawDurations,probabilityMathScope,probabilityModules,courseLedger,math880Required,selfCheckRules,taskCheck,routeData,datedBlocks,currentRouteIndex} = context.__plannerTest;
const minutes = value => { const [h,m] = value.split(':').map(Number); return h*60+m; };

const expectedCourses = [
  [0,'08:20','09:55','报关实务'], [0,'10:10','11:45','营销学'], [0,'13:15','14:50','财务管理'],
  [1,'13:15','14:50','商业政策'], [2,'08:20','09:55','外贸英文函电'], [2,'13:15','14:50','财务管理'],
  [2,'15:00','16:35','营销学'], [3,'08:20','09:55','报关实务'], [3,'10:10','11:45','商业政策'],
  [3,'15:00','16:35','国际贸易实务'], [4,'10:10','11:45','外贸英文函电']
];
for (const [day,start,end,title] of expectedCourses) {
  if (!baseClasses.some(x => x.day===day && x.start===start && x.end===end && x.title===title)) throw new Error(`missing course ${day} ${start}-${end} ${title}`);
}
if (baseClasses.some(x => x.day===0 && x.start==='15:00' && x.title.includes('财务管理'))) throw new Error('old Monday finance slot remains');
if (baseClasses.some(x => x.note || x.why)) throw new Error('course rows must show the course name only');
if (routines.some(x => x.id.includes('night-break'))) throw new Error('fixed night break overlaps subject blocks');
if (routines.some(x => x.start==='06:20' && x.title.includes('床铺'))) throw new Error('bed-making row should be merged into wake-up');

const homeworkDays = study1.filter(x => x.type==='homework').map(x => x.day).sort();
if (homeworkDays.join(',') !== '4,5,6') throw new Error(`homework days must be Fri-Sun, got ${homeworkDays}`);
if (!math880Required || math880Required.source !== '2027数学三带刷计划表') throw new Error('shared 880 plan source missing');
if (!math880Required.alignment?.includes('章→节→题型') || !math880Required.alignment.includes('题目主题') || !math880Required.alignment.includes('手头书确认')) throw new Error('880 cross-edition alignment and manual-confirmation rule missing');
const listedCount = chapter => [...Object.values(chapter.basics),...Object.values(chapter.comprehensive)].reduce((sum,list)=>sum+list.split('、').length,0);
if (math880Required.chapter1.count !== 38 || listedCount(math880Required.chapter1) !== 38) throw new Error(`chapter 1 required count must be 38, got declared=${math880Required.chapter1.count} listed=${listedCount(math880Required.chapter1)}`);
if (math880Required.chapter2.count !== 56 || listedCount(math880Required.chapter2) !== 56) throw new Error(`chapter 2 required count must be 56, got declared=${math880Required.chapter2.count} listed=${listedCount(math880Required.chapter2)}`);
if (!study1.some(x => x.id==='w1-tue-880' && x.title.includes('基础填空3、4') && x.title.includes('基础解答1、2(2)、4'))) throw new Error('chapter 1 exact required basics missing');
if (!study1.some(x => x.id==='w1-wed-880' && x.title.includes('综合选择1、2、3、5、6、7、8、9'))) throw new Error('chapter 1 exact required comprehensive choices missing');
if (!study1.some(x => x.id==='w1-sat-880' && x.title.includes('综合解答7、8、10、11'))) throw new Error('chapter 1 exact required solutions missing');
if (!study1.some(x => x.id==='w1-mon-eng' && x.title.includes('2015年 Text 1'))) throw new Error('exact English reading missing');
if (!study1.some(x => x.id==='w1-mon-436' && x.title.includes('p1–3'))) throw new Error('exact 436 page range missing');
if (!study1.some(x => x.id==='w1-mon-vocab' && x.title.includes('新30 + 旧60'))) throw new Error('vocabulary quantity missing');
const vocabDays = study1.filter(x => x.title.includes('英语单词')).map(x => x.day).sort();
if (vocabDays.join(',') !== '0,1,2,3,4,5,6') throw new Error(`every day needs an exact vocabulary block, got ${vocabDays}`);
if (!week2.some(x => x.id==='w2-mon-880' && x.title.includes('基础选择10、12、13、15、17'))) throw new Error('week 2 must use chapter 2 required list');
if (!week2.some(x => x.id==='w2-sun-880' && x.title.includes('综合解答4、6、7、8、10、11'))) throw new Error('chapter 2 required list must close on Sunday');
if (!week2.some(x => x.id==='w2-mon-436' && x.title.includes('p19–21'))) throw new Error('week 2 436 pages must progress');
if (!week2.some(x => x.id==='w2-mon-eng' && x.title.includes('2015年 Text 2'))) throw new Error('week 2 English reading must progress');
if (probabilityRawDurations[7] !== '34:23' || probabilityRawDurations[28] !== '1:00:49') throw new Error('verified probability durations missing');
if (probabilityMathScope[29] !== '数一' || probabilityMathScope[30] !== '数一') throw new Error('Math I-only probability lectures must be excluded');
if (probabilityModules.length !== 7 || !probabilityModules.includes('参数估计')) throw new Error('seven probability module index is missing');
if (!courseLedger.some(x => x.subject.includes('概率') && x.duration.includes('第7–8讲'))) throw new Error('probability duration ledger missing');
if (!courseLedger.some(x => x.subject.includes('线代') && x.duration.includes('2.10(2) 51:06'))) throw new Error('linear algebra duration ledger missing');
for (const [day,title] of [[0,'英语单词 · 新20 + 旧40'],[1,'436 · p1–18闭卷复述'],[6,'880第二章 · 基础题错题4题']]) {
  if (!schedules[2].some(x => x.day===day && x.start==='06:20' && x.end==='07:00' && x.title===title)) throw new Error(`high-intensity morning missing day=${day}`);
}
if (!schedules[2].some(x => x.day===1 && x.start==='14:50' && x.end==='16:35' && x.title.includes('436'))) throw new Error('Tuesday afternoon study block missing');
if (strictStartDate !== '2026-09-02') throw new Error(`strict plan must restart on 2026-09-02, got ${strictStartDate}`);
for (const day of ['2026-09-02','2026-09-03','2026-09-04','2026-09-05','2026-09-06','2026-09-07','2026-09-08','2026-09-09','2026-09-10','2026-09-11','2026-09-12','2026-09-13']) {
  if (!strictDateSchedules[day]?.length) throw new Error(`strict daily schedule missing ${day}`);
}
for (let day=2;day<=30;day++) {
  const date=`2026-09-${String(day).padStart(2,'0')}`;
  if (!strictDateSchedules[date]?.length) throw new Error(`September strict daily schedule missing ${date}`);
}
const sep2 = strictDateSchedules['2026-09-02'];
for (const required of [
  '880第一章 · 基础选择8、12、13 + 基础填空3、4 + 基础解答1、2(2)、4',
  '英语二 · 2010年 Text 1',
  '436 · p1–6',
  '线代第2章 · 剩余课第1节 + 对应题6道'
]) if (!sep2.some(x => x.title.includes(required))) throw new Error(`September 2 restart task missing: ${required}`);
if (!sep2.some(x => x.title.includes('外贸英文函电课内') && x.title.includes('静默'))) throw new Error('non-FHSU Wednesday class must carry a silent task');
for (const exactCourse of ['财务管理','营销学']) if (!sep2.some(x => x.title===exactCourse && x.type==='fhsu')) throw new Error(`FHSU course must remain course-only: ${exactCourse}`);
if (!sep2.some(x => x.start==='12:20' && x.title.includes('午休'))) throw new Error('sleep-protection nap is missing on September 2');
if (!sep2.some(x => x.end==='24:00' && x.title.includes('最晚00:00'))) throw new Error('midnight sleep boundary missing');
if (!selfCheckRules || !taskCheck({type:'math',title:'880第一章 · 8题',note:''}).includes('概念/计算/思路')) throw new Error('math self-check rule missing');
if (!taskCheck({type:'major',title:'436 · p1–6',note:''}).includes('先按手头目录补成“章-节-页”')) throw new Error('436 chapter-section-page self-indexing action missing');
if (!taskCheck({type:'english',title:'英语二 · 2010年 Text 1',note:''}).includes('证据句')) throw new Error('English evidence-sentence completion rule missing');
const mathCopy = [...study1,...week2,...highIntensityStartWeek].filter(x=>x.type==='math').map(x=>`${x.title} ${x.note}`).join('\n');
for (const forbidden of ['基础选择1–13','拓展解答1–2','综合解答7–12']) {
  if (mathCopy.includes(forbidden)) throw new Error(`excluded 880 work leaked into schedule: ${forbidden}`);
}
if (!mathCopy.includes('选择做/特难题不排')) throw new Error('daily schedule must state the 880 exclusion rule');
const taskCount = rows => rows.reduce((sum,x)=>sum+(x.note.match(/(?:计划表)?必做(\d+)题/)?.[1] ? Number(x.note.match(/(?:计划表)?必做(\d+)题/)[1]) : 0),0);
const chapter1Rows = Object.entries(strictDateSchedules).filter(([date])=>date>='2026-09-02'&&date<='2026-09-06').flatMap(([,rows])=>rows).filter(x=>x.type==='math'&&x.note.includes('必做')&&x.title.includes('880第一章'));
const chapter2Rows = Object.entries(strictDateSchedules).filter(([date])=>date>='2026-09-07'&&date<='2026-09-13').flatMap(([,rows])=>rows).filter(x=>x.type==='math'&&x.note.includes('必做')&&x.title.includes('880第二章'));
if (taskCount(chapter1Rows) !== 38) throw new Error(`chapter 1 daily required allocation must total 38, got ${taskCount(chapter1Rows)}`);
if (taskCount(chapter2Rows) !== 56) throw new Error(`chapter 2 daily required allocation must total 56, got ${taskCount(chapter2Rows)}`);
for (const [chapter,total] of [[3,86],[4,40],[5,41],[6,37]]) {
  const rows=Object.values(strictDateSchedules).flat().filter(x=>x.type==='math'&&x.title.includes(`880第${'一二三四五六七八九十'[chapter-1]}章`)&&x.note.includes('必做'));
  if (taskCount(rows)!==total) throw new Error(`chapter ${chapter} September required allocation must total ${total}, got ${taskCount(rows)}`);
}
if (!septemberContinuation['2026-09-29'].major.includes('p163–168') || !septemberContinuation['2026-09-30'].major.includes('p1–168')) throw new Error('436 first pass must finish by September 29 and review on September 30');
for (const day of ['2026-09-13','2026-09-20','2026-09-27']) {
  if (!strictDateSchedules[day].some(x=>x.type==='english' && x.title.includes('小作文审题'))) throw new Error(`low-dose September writing baseline missing ${day}`);
}
const sep30 = strictDateSchedules['2026-09-30'];
if (!sep30.some(x=>x.type==='math' && x.title.includes('九月闭卷小测6题') && x.note.includes('第1–6章各抽1道') && x.note.includes('基础/中等代表题') && x.note.includes('选择做/特难题不进小测'))) throw new Error('September 30 representative cross-chapter math readiness gate missing');
for (const chapterRange of ['第1–3章','第4–6章','第7–10章']) {
  if (!sep30.some(x=>x.type==='major' && x.title.includes(chapterRange))) throw new Error(`September 30 436 framework gate missing ${chapterRange}`);
}
if (sep30.some(x=>`${x.title} ${x.note}`.includes('当日新页'))) throw new Error('September 30 436 closeout must not claim there are new pages');
if (!sep30.some(x=>x.type==='major' && x.note.includes('断点章-节-页'))) throw new Error('September 30 436 gate must record chapter-section-page breakpoints');
const sep30Gate = sep30.find(x=>x.type==='buffer' && x.title.includes('月末门禁'));
if (!sep30Gate || !['880','436','英语','23:30'].every(key=>sep30Gate.note.includes(key))) throw new Error('September 30 must write the four October input fields');
for (const rule of ['低于4/6','只记标题','同类错重复2次','少于5/7天','首个对应块先回补']) if (!sep30Gate.note.includes(rule)) throw new Error(`September 30 recovery threshold missing: ${rule}`);
for (const day of ['2026-09-06','2026-09-13','2026-09-20','2026-09-27']) {
  const weeklyGate = strictDateSchedules[day].find(x=>x.type==='buffer' && x.title.includes('周验收'));
  if (!weeklyGate) throw new Error(`weekly evidence audit missing ${day}`);
  if (!weeklyGate.note.includes('下周首块先补') || !weeklyGate.note.includes('关灯少于5天')) throw new Error(`weekly recovery action missing ${day}`);
}
for (let day=14;day<=30;day++) {
  const date=`2026-09-${String(day).padStart(2,'0')}`;
  if (!strictDateSchedules[date].some(x=>x.type==='politics')) throw new Error(`daily low-dose politics missing ${date}`);
}
if (routeData[0].dates !== '9月2日—9月13日' || !routeData[0].desc.includes('第一章必做38题') || !routeData[0].desc.includes('第二章必做56题')) throw new Error('phase route must restart on September 2 and show exact required counts');
if (!routeData.every(x => x.desc.includes('选择做/特难题不排'))) throw new Error('every phase must preserve the exclusion rule');
if (!routeData[2].check.includes('9月30日') || !routeData[2].check.includes('实际数据')) throw new Error('October route must be gated by September evidence');
if (!routeData[2].check.includes('未达项') || !routeData[2].check.includes('先回补')) throw new Error('October route must say what to do when a gate fails');
const allowedFhsuTitles = new Set(['营销学','财务管理','商业政策']);
for (const [date, rows] of Object.entries(strictDateSchedules)) {
  for (const row of rows.filter(x=>x.type==='fhsu')) {
    if (!allowedFhsuTitles.has(row.title) || row.note) throw new Error(`FHSU row must remain course-name-only: ${date} ${row.title}`);
  }
}
for (const [date,expected] of [['2026-09-02',0],['2026-09-14',1],['2026-10-01',2],['2026-11-01',3],['2026-12-01',4]]) if (currentRouteIndex(new Date(`${date}T12:00:00`))!==expected) throw new Error(`phase highlight wrong on ${date}`);
for (const [date, rows] of Object.entries(strictDateSchedules)) {
  const sorted=[...rows].sort((a,b)=>minutes(a.start)-minutes(b.start));
  if (sorted[0].start!=='06:00' || sorted.at(-1).end!=='24:00') throw new Error(`strict day must cover 06:00-24:00 boundary: ${date}`);
  for(let i=1;i<sorted.length;i++) if(minutes(sorted[i].start)<minutes(sorted[i-1].end)) throw new Error(`strict overlap ${date}: ${sorted[i-1].title} / ${sorted[i].title}`);
  if (rows.some(x=>x.type==='homework') && ![0,5,6].includes(new Date(`${date}T12:00:00`).getDay())) throw new Error(`Blackboard homework leaked into weekday ${date}`);
  for (const row of rows.filter(x=>x.type==='politics')) {
    const split=row.note.match(/(\d+)分钟做题 \+ (\d+)分钟错因/);
    if (split && Number(split[1])+Number(split[2])!==minutes(row.end)-minutes(row.start)) throw new Error(`politics note exceeds its time box: ${date} ${row.start}-${row.end} ${row.note}`);
  }
}
const activeTypes=new Set(['math','major','english','politics']);
const activeMinutes=Object.fromEntries(Object.entries(strictDateSchedules).map(([date,rows])=>[date,rows.filter(x=>activeTypes.has(x.type)).reduce((sum,x)=>sum+minutes(x.end)-minutes(x.start),0)]));
const lightest=Math.min(...Object.values(activeMinutes)), heaviest=Math.max(...Object.values(activeMinutes));
const heaviestDate=Object.entries(activeMinutes).find(([,value])=>value===heaviest)?.[0];
if (lightest<420) throw new Error(`strict plan drops below 7 active study hours: ${lightest} minutes`);
if (heaviest>690) throw new Error(`strict plan exceeds 11.5 active study hours before FHSU/homework: ${Object.entries(activeMinutes).filter(([,value])=>value>690).map(([date,value])=>`${date}=${value}`).join(', ')}`);
for (const index of [0,1]) {
  const all=datedBlocks(index);
  for (let day=0;day<7;day++) {
    const rows=all.filter(x=>x.day===day).sort((a,b)=>minutes(a.start)-minutes(b.start));
    for(let i=1;i<rows.length;i++) if(minutes(rows[i].start)<minutes(rows[i-1].end)) throw new Error(`dated overlap index=${index} day=${day}: ${rows[i-1].title} / ${rows[i].title}`);
  }
}

for (const phase of [1,2,3,5]) {
  for (let day=0; day<7; day++) {
    const rows = [...routines,...schedules[phase]].filter(x => x.day===day).sort((a,b)=>minutes(a.start)-minutes(b.start));
    for (let i=1;i<rows.length;i++) {
      if (minutes(rows[i].start) < minutes(rows[i-1].end)) throw new Error(`overlap phase=${phase} day=${day}: ${rows[i-1].title} / ${rows[i].title}`);
    }
  }
}
console.log(`SCHEDULE_OK courses=${baseClasses.length} week1=${study1.length} week2=${week2.length} active=${lightest}-${heaviest}min`);
