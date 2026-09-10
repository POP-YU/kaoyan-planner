import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const nodes = new Map(['course-ledger-body','daily-agenda','daily-title','today-badge','date-title','date-subtitle','top-date','today-focus','today-meal','phase-line','live-clock','current-task-title','current-task-time','next-task-title','next-task-time'].map(id => [id, {innerHTML:'',textContent:'',append(){}}]));
const document = {
  hidden: false,
  querySelector(selector){ return nodes.get(selector.slice(1)) ?? null; },
  createElement(){ return {className:'',innerHTML:'',append(){}}; },
  addEventListener(){}
};
const context = {document,console,Date,setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){}};
vm.runInNewContext(`${source}\n;globalThis.__plannerTest={baseClasses,routines,study1,week2,phaseBlocks,schedules,highIntensityStartWeek,strictStartDate,currentBaselineDate,actualScheduleStartDate,resetStudyStartDate,scheduleLagDays,scheduleSourceDate,majorBaseline,majorCumulativeForDate,majorNewRangeForDate,strictDateSchedules,septemberContinuation,probabilityRawDurations,probabilityMathScope,probabilityModules,probabilityLecture1File,linearAlgebraVerifiedLessons,linearAlgebraLessonSlots,linearAlgebraCatchupSlots,linearAlgebraAppliedSlots,futureLinearQueue,futureLinearLessonForDate,majorRecitationMaterial,majorChapterCumulative,majorChapterForUnit,majorChapterHintForRange,courseLedger,math880Required,math880BrushPlan,brushPlanEntryFor,brushPlanStartDate,brushPlanLagDays,selfCheckRules,taskCheck,routeData,datedBlocks,buildDayAgenda,composeDailyAgenda,brushFocusFor,agendaPosition,currentRouteIndex,courseInfo,rangeStarts,blackboardFridayStart,blackboardFridayEnd};`, context, {filename:'app.js'});
const {baseClasses,routines,study1,week2,schedules,highIntensityStartWeek,strictStartDate,currentBaselineDate,actualScheduleStartDate,resetStudyStartDate,scheduleLagDays,scheduleSourceDate,majorBaseline,majorCumulativeForDate,majorNewRangeForDate,strictDateSchedules,septemberContinuation,probabilityRawDurations,probabilityMathScope,probabilityModules,probabilityLecture1File,linearAlgebraVerifiedLessons,linearAlgebraLessonSlots,linearAlgebraCatchupSlots,linearAlgebraAppliedSlots,futureLinearQueue,futureLinearLessonForDate,majorRecitationMaterial,majorChapterCumulative,majorChapterForUnit,majorChapterHintForRange,courseLedger,math880Required,math880BrushPlan,brushPlanEntryFor,brushPlanStartDate,brushPlanLagDays,selfCheckRules,taskCheck,routeData,datedBlocks,buildDayAgenda,composeDailyAgenda,brushFocusFor,agendaPosition,currentRouteIndex,courseInfo,rangeStarts,blackboardFridayStart,blackboardFridayEnd} = context.__plannerTest;
const minutes = value => { const [h,m] = value.split(':').map(Number); return h*60+m; };
const rangeIndexFor = date => Math.max(0,Math.floor((Number(date)-Number(rangeStarts[0]))/(7*24*60*60*1000)));

// 2026-09-09 用户最新事实：数学与 436 均未开始，统一从 9/10 起跑；
// Blackboard/BB 只放真实周五晚间，不再占周六、周日或白天。
if (resetStudyStartDate !== '2026-09-10' || actualScheduleStartDate !== '2026-09-10' || scheduleLagDays !== 8) throw new Error('math/436 reset must start on 2026-09-10 with the 9/2 ledger replayed eight days later');
if (currentBaselineDate !== '2026-09-02' || majorBaseline.completedUnits !== 0 || majorBaseline.dailyNewUnits !== 5) throw new Error('436 must restart from zero, five new units per study day');
if (blackboardFridayStart !== '19:30' || blackboardFridayEnd !== '20:30') throw new Error('Blackboard must use the fixed Friday-evening hour');
{
  const activeTypes=new Set(['math','major','english','politics']);
  const activeMinutes=[];
  for (let date=new Date('2026-09-11T12:00:00'); date<=new Date('2026-09-23T12:00:00'); date.setDate(date.getDate()+1)) {
    const rows=composeDailyAgenda(new Date(date),rangeIndexFor(date)).data;
    activeMinutes.push(rows.filter(x=>activeTypes.has(x.type)).reduce((sum,x)=>sum+minutes(x.end)-minutes(x.start),0));
  }
  if (Math.min(...activeMinutes)!==540 || Math.max(...activeMinutes)!==720) throw new Error(`9/11-9/23 final core-study calibration must remain 9-12 hours, got ${Math.min(...activeMinutes)}-${Math.max(...activeMinutes)} minutes`);
  const resetDay=composeDailyAgenda(new Date('2026-09-10T12:00:00'),rangeIndexFor(new Date('2026-09-10T12:00:00'))).data;
  const resetMinutes=resetDay.filter(x=>activeTypes.has(x.type)).reduce((sum,x)=>sum+minutes(x.end)-minutes(x.start),0);
  if (resetMinutes!==430) throw new Error(`reported-nap day with missed afternoon 436 moved to night must retain exactly 7h10 scheduled core-study time, got ${resetMinutes} minutes`);
  const truthPhase=routeData.find(x=>x.dates==='10月9日—11月8日');
  const paperPhase=routeData.find(x=>x.dates==='11月9日—12月8日');
  if (!truthPhase?.desc.includes('10/23收尾后开始数学真题入口') || !truthPhase.desc.includes('模拟卷只补漏洞')) throw new Error('post-880 route must start truth-paper work without letting simulations displace verified priorities');
  if (!paperPhase?.desc.includes('只作强度参考') || !paperPhase.check.includes('错因、二测和自检')) throw new Error('paper phase must calibrate blogger pacing against real output instead of copying set counts');
}
{
  const before=composeDailyAgenda(new Date('2026-09-09T12:00:00'),1).data;
  if (before.some(x=>x.type==='math'||x.type==='major')) throw new Error('math/436 must not appear before the 9/10 reset start');
  if (before.some(x=>/436|880|数学/.test(`${x.title} ${x.note}`))) throw new Error('pre-reset buffer notes must not leak stale math/436 progress');
  const first=composeDailyAgenda(new Date('2026-09-10T12:00:00'),1).data;
  const brush=brushFocusFor(new Date('2026-09-10T12:00:00'),first);
  if (!brush || brush.sourceDate!=='2026-09-08' || brush.count!==32) throw new Error('9/10 math must start from brush-plan day 1 (32 questions)');
  if (!first.some(x=>x.type==='major' && x.title.includes('第1–5个新内容单元'))) throw new Error('9/10 436 must start from units 1-5');
  if (first.some(x=>/昨日错题|436回看/.test(`${x.title} ${x.note}`))) throw new Error('reset day must not claim nonexistent prior-day math/436 work');
  const classMath=first.filter(x=>x.studyClass);
  if (classMath.length!==1 || classMath[0].start!=='08:20' || classMath[0].brushCount!==10) throw new Error('9/10 must retain only the morning quantified class-study slot before the reported nap');
  if (!first.some(x=>x.type==='fhsu'&&x.title.includes('商业政策（FHSU）')&&!/880|436/.test(`${x.title} ${x.note}`))) throw new Error('9/10 FHSU course must remain a pure class slot');
  if (first.filter(x=>x.brushCount).reduce((sum,x)=>sum+x.brushCount,0)!==32) throw new Error('9/10 880 quantities across class and after-class slots must total the exact 32-question daily plan');
  const nap=first.find(x=>x.start==='14:20'&&x.end==='18:07');
  if (!nap || nap.type!=='sleep' || !nap.note.includes('436缺口回收、课内数学和线代2.8均未完成')) throw new Error('9/10 reported 14:20-18:07 sleep must replace the missed afternoon tasks without counting them complete');
  const remaining=first.find(x=>x.start==='19:10'&&x.end==='21:30');
  if (!remaining || remaining.type!=='math' || remaining.brushCount!==22 || !remaining.note.includes('若上午第1–10题已完成')) throw new Error('9/10 evening must show the conditional 22-question remaining 880 block');
  if (!first.some(x=>x.start==='12:45'&&x.end==='14:20'&&x.type==='buffer'&&x.title.includes('未进行')&&x.note.includes('移到今晚重新学习'))) throw new Error('9/10 missed 12:45-14:20 436 block must be recorded as not done, never as completed study');
  if (!first.some(x=>x.start==='21:40'&&x.end==='23:15'&&x.type==='major'&&x.title.includes('第1–5个新内容单元 · 重新学习 + 框架默写'))) throw new Error('9/10 evening must contain the full moved 95-minute 436 study block');
  if (!first.some(x=>x.start==='23:15'&&x.end==='23:30'&&x.type==='major'&&x.title.includes('A/B/C登记'))) throw new Error('9/10 moved 436 block must finish with retrieval evidence');
  if (first.some(x=>x.start>='21:40'&&x.type==='english')) throw new Error('9/10 English must not be squeezed beside the moved 436 block or into the sleep boundary');
  if (!first.some(x=>x.start==='23:30'&&x.note.includes('英语阅读与薄弱词今晚未做'))) throw new Error('9/10 ledger must truthfully record displaced English work');
  if (first.some(x=>x.title==='通勤 · 学校→家')) throw new Error('9/10 reported nap override must not pretend the missed 18:05 commute happened');
  const status=agendaPosition(first,new Date('2026-09-10T18:10:00'));
  if (status.active?.title!=='起床恢复 · 喝水洗脸') throw new Error('9/10 current panel must move directly to wake-up recovery after the reported nap');
  const tomorrow=composeDailyAgenda(new Date('2026-09-11T12:00:00'),1).data;
  if (!tomorrow.some(x=>x.start==='08:20'&&x.end==='09:50'&&x.title.includes('矩阵的分块（昨日欠账优先）'))) throw new Error('9/11 must use the free morning window to recover the missed linear-algebra 2.8 block');
  if (!tomorrow.some(x=>x.start==='16:35'&&x.title.includes('矩阵相似 01'))) throw new Error('9/11 catch-up must not silently delete the scheduled 03-01 lesson');
}
for (let date=new Date('2026-09-10T12:00:00'); date<=new Date('2026-10-31T12:00:00'); date.setDate(date.getDate()+1)) {
  const rows=composeDailyAgenda(new Date(date),1).data;
  const homework=rows.filter(x=>x.type==='homework');
  const friday=date.getDay()===5;
  if (homework.length !== (friday?1:0)) throw new Error(`Blackboard must appear exactly once on Friday only: ${date.toISOString().slice(0,10)}`);
  if (friday && (homework[0].start!==blackboardFridayStart || homework[0].end!==blackboardFridayEnd)) throw new Error(`Blackboard must stay in the fixed Friday-evening slot: ${date.toISOString().slice(0,10)}`);
}

const expectedCourses = [
  [0,'08:20','09:55','报关实务'], [0,'10:10','11:45','营销学'], [0,'15:00','16:35','财务管理'],
  [1,'13:15','14:50','商业政策'], [2,'08:20','09:55','外贸英文函电'], [2,'13:15','14:50','财务管理'],
  [2,'15:00','16:35','营销学'], [3,'08:20','09:55','报关实务'], [3,'10:10','11:45','商业政策'],
  [3,'15:00','16:35','国际贸易实务'], [4,'10:10','11:45','外贸英文函电']
];
for (const [day,start,end,title] of expectedCourses) {
  if (!baseClasses.some(x => x.day===day && x.start===start && x.end===end && x.title===title)) throw new Error(`missing course ${day} ${start}-${end} ${title}`);
}
// 2026-09-08 按用户真实课表截图核对：周一财务管理在 7-8节(15:00-16:35)，13:15 是旧错位。
if (baseClasses.some(x => x.day===0 && x.start==='13:15' && x.title.includes('财务管理'))) throw new Error('stale Monday finance 13:15 slot remains');
if (baseClasses.some(x => x.note || x.why)) throw new Error('course rows must show the course name only');
if (routines.some(x => x.id.includes('night-break'))) throw new Error('fixed night break overlaps subject blocks');
if (routines.some(x => x.start==='06:20' && x.title.includes('床铺'))) throw new Error('bed-making row should be merged into wake-up');

// Dormant historical templates may still carry old homework rows; composeDailyAgenda is the
// single final gate and is verified above against real calendar Fridays.
if (!math880Required || math880Required.source !== '李林880题（数学三）· 2026-09-07 中午改回带刷表跳选题号') throw new Error('brush-plan 880 source missing');
if (!math880Required.rule?.includes('按带刷计划表逐日跳选指定题号') || !math880Required.rule.includes('2026-09-10从原题单第1天开始') || !math880Required.rule.includes('必做828题9/10–10/20完成') || !math880Required.rule.includes('特难题16题10/23收尾') || !math880Required.rule.includes('周日只吃计划表当周的周日轻量格')) throw new Error('brush-plan 880 reset rule missing');
if (!math880Required.alignment?.includes('881个题号与原表逐章逐题型一致') || !math880Required.alignment.includes('brushPlanLagDays +1')) throw new Error('brush-plan alignment/defer rule missing');
if (math880Required.chapter1.count !== 38 || math880Required.chapter2.count !== 56 || math880Required.chapter3.count !== 86 || math880Required.chapter4.count !== 40 || math880Required.chapter5.count !== 41 || math880Required.chapter6.count !== 37) throw new Error('880 chapter totals must match the verified counts');
// 2026-09-07 中午：带刷表成为 880 的唯一事实来源。数据守卫：
if (math880Required.totalCount !== 881 || math880Required.requiredCount !== 828 || math880Required.optionalCount !== 37 || math880Required.hardCount !== 16 || math880Required.planDays !== 44) throw new Error('brush-plan totals must be 828+37+16=881 across 44 days');
if (!Array.isArray(math880BrushPlan) || math880BrushPlan.length !== 44) throw new Error('brush plan must have exactly 44 daily entries');
if (brushPlanStartDate !== '2026-09-08' || math880BrushPlan[0][0] !== '2026-09-08' || math880BrushPlan.at(-1)[0] !== '2026-10-21') throw new Error('brush plan must run 2026-09-08 through 2026-10-21');
{
  const sum = math880BrushPlan.reduce((s,[,,,count])=>s+count,0);
  if (sum !== 881) throw new Error(`brush plan daily counts must total 881, got ${sum}`);
  for (let i=1;i<math880BrushPlan.length;i++) {
    const a=new Date(`${math880BrushPlan[i-1][0]}T12:00:00`), b=new Date(`${math880BrushPlan[i][0]}T12:00:00`);
    if (b-a !== 86400000) throw new Error(`brush plan dates must be contiguous at ${math880BrushPlan[i][0]}`);
  }
  for (const [,stage,task,count] of math880BrushPlan) {
    if (!['必做','选择做','特难题'].includes(stage) || typeof task!=='string' || !/第\d+章·/.test(task) || count<1) throw new Error('brush plan entry shape invalid');
  }
  // 每日计划的“阶段”列是排期分组：必做段到 10/17，加餐（选择做集中）10/18–20，特难题 10/21。
  const byStage=d=>math880BrushPlan.find(x=>x[0]===d)?.[1];
  if (math880BrushPlan.filter(x=>x[1]==='必做').at(-1)[0] !== '2026-10-17') throw new Error('required stage must run through 2026-10-17');
  if (['2026-10-18','2026-10-19','2026-10-20'].some(d=>byStage(d)!=='选择做') || byStage('2026-10-21')!=='特难题') throw new Error('optional/hard stage windows must match the plan');
  const e=brushPlanEntryFor('2026-09-10');
  if (!e || e[2] !== math880BrushPlan[0][2] || brushPlanEntryFor('2026-09-08') !== null || brushPlanEntryFor('2026-09-09') !== null) throw new Error('brushPlanEntryFor must start on 9/10 with lag=2');
  // 周日缓冲不动（2026-09-09 拍板）：实际周日吃计划表同日期的周日轻量格；
  // 周中（含周六）跳过计划表周日格按序消费；尾部自然后推（lag=2 时特难题 10/23 收尾）。
  const sun913=brushPlanEntryFor('2026-09-13');
  if (!sun913 || sun913[0] !== '2026-09-13' || sun913[3] !== 15) throw new Error('Sunday 9/13 must take the plan Sunday light entry (15题), not the shifted Saturday load');
  if (brushPlanEntryFor('2026-09-14')[0] !== '2026-09-11') throw new Error('Monday 9/14 must resume the reset weekday sequence (plan 9/11)');
  if (brushPlanEntryFor('2026-09-20')?.[0] !== '2026-09-20' || brushPlanEntryFor('2026-09-20')?.[3] !== 10) throw new Error('every plan-week Sunday must stay light');
  if (brushPlanEntryFor('2026-10-20')?.[0] !== '2026-10-17') throw new Error('last required entry must land on actual 10/20 under Sunday protection');
  if (brushPlanEntryFor('2026-10-23')?.[1] !== '特难题') throw new Error('hard-problem tail must close on actual 10/23');
  if (brushPlanEntryFor('2026-10-24') !== null || brushPlanEntryFor('2026-10-25') !== null) throw new Error('plan exhausted: weekdays after 10/23 and Sundays after 10/18 must not schedule 880');
}
// 带刷覆盖渲染守卫：数学进度清零后，实际 9/10 起数学格变成“880 带刷”并写明题号明细。
{
  const allDays=[0,1,2,3,4,5,6,7].flatMap(i=>datedBlocks(i));
  for (const [actual,tail] of [['2026-09-10','基础选择：8、12-13'],['2026-09-13','综合填空：1-3、5-10、12-15'],['2026-10-10','第15章·随机事件及其概率'],['2026-10-23','综合解答：2']]) {
    const brush=allDays.filter(x=>x.date===actual && x.type==='math' && x.title.includes('880 带刷'));
    if (!brush.length) throw new Error(`brush overlay missing on ${actual}`);
    if (!brush.some(x=>`${x.title} ${x.note}`.includes(tail))) throw new Error(`brush task detail missing on ${actual}: ${tail}`);
  }
  const nonBrush=allDays.filter(x=>['2026-09-08','2026-09-09'].includes(x.date) && x.type==='math' && x.title.includes('带刷'));
  if (nonBrush.length) throw new Error('brush overlay must not start before the 2026-09-10 reset');
}
if (!study1.some(x => x.id==='w1-tue-880' && x.title.includes('按题号顺序推进12题'))) throw new Error('sequential chapter-1 work block missing');
if (!study1.some(x => x.id==='w1-wed-880' && x.title.includes('按题号顺序推进8题'))) throw new Error('sequential chapter-1 work block missing');
if (!study1.some(x => x.id==='w1-sat-880' && x.title.includes('按题号顺序推进14题'))) throw new Error('sequential chapter-1 work block missing');
if (!study1.some(x => x.id==='w1-mon-eng' && x.title.includes('2015年 Text 1'))) throw new Error('exact English reading missing');
if (!study1.some(x => x.id==='w1-mon-436' && x.title.includes('p1–3'))) throw new Error('source 436 seed range missing');
if (!study1.some(x => x.id==='w1-mon-vocab' && x.title.includes('新30 + 旧60'))) throw new Error('vocabulary quantity missing');
const vocabDays = study1.filter(x => x.title.includes('英语单词')).map(x => x.day).sort();
if (vocabDays.join(',') !== '0,1,2,3,4,5,6') throw new Error(`every day needs an exact vocabulary block, got ${vocabDays}`);
if (!week2.some(x => x.id==='w2-mon-880' && x.title.includes('按题号顺序推进'))) throw new Error('week 2 must keep sequential 880 work');
if (!week2.some(x => x.id==='w2-sun-880' && x.title.includes('错题'))) throw new Error('week 2 must keep the sequential correction loop');
if (!week2.some(x => x.id==='w2-mon-436' && x.title.includes('p19–21'))) throw new Error('week 2 436 pages must progress');
if (!week2.some(x => x.id==='w2-mon-eng' && x.title.includes('2015年 Text 2'))) throw new Error('week 2 English reading must progress');
if (probabilityRawDurations[7] !== '34:23' || probabilityRawDurations[28] !== '1:00:49') throw new Error('verified probability durations missing');
if (probabilityMathScope[29] !== '数一' || probabilityMathScope[30] !== '数一') throw new Error('Math I-only probability lectures must be excluded');
if (probabilityModules.length !== 7 || !probabilityModules.includes('参数估计')) throw new Error('seven probability module index is missing');
if (!courseLedger.some(x => x.subject.includes('概率') && x.duration.includes('第7–8讲'))) throw new Error('probability duration ledger missing');
if (!courseLedger.some(x => x.subject.includes('线代') && x.duration.includes('90分钟时间盒'))) throw new Error('linear algebra time-box ledger missing');
for (const [day,title] of [[0,'英语单词 · 新20 + 旧40'],[1,'436 · p1–18闭卷复述'],[6,'880第二章 · 基础题错题4题']]) {
  if (!schedules[2].some(x => x.day===day && x.start==='06:20' && x.end==='07:00' && x.title===title)) throw new Error(`high-intensity morning missing day=${day}`);
}
if (!schedules[2].some(x => x.day===1 && x.start==='14:50' && x.end==='16:35' && x.title.includes('436'))) throw new Error('Tuesday afternoon study block missing');
if (strictStartDate !== '2026-09-02') throw new Error(`strict plan must restart on 2026-09-02, got ${strictStartDate}`);
if (scheduleSourceDate('2026-09-09') !== '2026-09-09' || scheduleSourceDate('2026-09-10') !== '2026-09-02' || scheduleSourceDate('2026-09-11') !== '2026-09-03' || scheduleSourceDate('2026-09-13') !== '2026-09-05' || scheduleSourceDate('2026-10-08') !== '2026-09-30') throw new Error('actual dates must consume the 9/2 ledger in order from the 9/10 reset');
if (majorCumulativeForDate('2026-09-02') !== 5 || majorNewRangeForDate('2026-09-02').start !== 1 || majorNewRangeForDate('2026-09-02').end !== 5) throw new Error('436 first ledger day must cover units 1-5 from zero');
if (majorNewRangeForDate('2026-09-06') !== null || majorCumulativeForDate('2026-09-06') !== 20) throw new Error('Sunday must be review-only for 436');
for (const day of ['2026-09-02','2026-09-03','2026-09-04','2026-09-05','2026-09-06','2026-09-07','2026-09-08','2026-09-09','2026-09-10','2026-09-11','2026-09-12','2026-09-13']) {
  if (!strictDateSchedules[day]?.length) throw new Error(`strict daily schedule missing ${day}`);
}
for (let day=2;day<=30;day++) {
  const date=`2026-09-${String(day).padStart(2,'0')}`;
  if (!strictDateSchedules[date]?.length) throw new Error(`September strict daily schedule missing ${date}`);
}
const sep2 = strictDateSchedules['2026-09-02'];
for (const required of [
  '错题登记',
  '英语二 · 2010年 Text 1',
  '436 · 第1–5个新内容单元'
]) if (!sep2.some(x => x.title.includes(required))) throw new Error(`September 2 restart task missing: ${required}`);
if (!sep2.some(x => x.title==='外贸英文函电' && x.type==='course')) throw new Error('9/2 外贸英文函电 must be a pure non-fhsu course slot (not occupied by 880)');
for (const exactCourse of ['财务管理','营销学']) if (!sep2.some(x => x.title===exactCourse && x.type==='fhsu')) throw new Error(`FHSU course must remain course-only: ${exactCourse}`);
// 全局守卫：任何 strict 日的 FHSU 课程格都不得内嵌 880/线代/概率/做题内容。
for (const [date,rows] of Object.entries(strictDateSchedules)) for (const x of rows) if ((x.type==='fhsu' || x.type==='course') && /880|线代|方浩|概率|做题|题单|错题|必做|选择做/.test(`${x.title} ${x.note}`)) throw new Error(`course slot ${date} "${x.title}" must stay course-only (no 880/math embedded)`);
if (!sep2.some(x => x.start==='12:20' && x.title.includes('午休'))) throw new Error('sleep-protection nap is missing on September 2');
if (!sep2.some(x => x.end==='24:00' && x.title.includes('00:00关灯'))) throw new Error('midnight sleep boundary missing');
if (sep2.some(x=>/p\d/.test(`${x.title} ${x.note}`))) throw new Error('rendered September 2 rows must not expose page-range shorthand');
const sep2Linear=strictDateSchedules['2026-09-02'].find(x=>x.title.includes('第2章 08 矩阵的分块（断点收尾）'));
if (!sep2Linear) throw new Error('the replayed first day must close chapter 2 with the verified 02-08 breakpoint lesson');
if (!sep2Linear.note.includes('34%') || !sep2Linear.note.includes('90分钟时间盒')) throw new Error('02-08 must resume from the verified 34% breakpoint inside its actual 90-minute time box');
if (!strictDateSchedules['2026-09-03'].some(x=>x.title.includes('矩阵相似 01 特征值与特征向量'))) throw new Error('exact verified linear lesson 03-01 missing');
const sep3Linear=strictDateSchedules['2026-09-03'].find(x=>x.type==='math'&&x.title.includes('矩阵相似 01')&&!x.title.includes('（续）')&&!x.title.includes('对应题回收'));
if (!sep3Linear?.note.includes('95分钟时间盒') || sep3Linear.note.includes('90分钟时间盒')) throw new Error('linear time-box note must use the actual slot length');
if (!strictDateSchedules['2026-09-15'].some(x=>x.title.includes('矩阵相似 05 正交矩阵、实对称矩阵（1）'))) throw new Error('exact verified linear lesson 03-05 missing');
if (!strictDateSchedules['2026-09-05'].some(x=>x.title.includes('矩阵相似 02 秩为1矩阵专题'))) throw new Error('exact verified linear lesson 03-02 missing');
if (!strictDateSchedules['2026-09-29'].some(x=>x.title.includes('二次型 02 二次型的标准形、规范形'))) throw new Error('exact verified linear lesson 04-02 missing on September 29');
if (Object.values(strictDateSchedules).flat().some(x=>x.title.includes('初等变换与初等矩阵'))) throw new Error('02-09 is already watched to 100% and must never be scheduled');
if (!linearAlgebraVerifiedLessons.find(x=>x.key==='02-08')?.resumeFrom.includes('34') || !linearAlgebraVerifiedLessons.find(x=>x.key==='02-09')?.watchedFull) throw new Error('chapter-2 tail watch progress evidence missing');
if (linearAlgebraVerifiedLessons.length !== 23 || linearAlgebraLessonSlots.length !== 20 || linearAlgebraCatchupSlots.length !== 1 || linearAlgebraAppliedSlots.length !== 21) throw new Error('verified linear lesson inventory/slot application incomplete');
if (!linearAlgebraVerifiedLessons.find(x=>x.key==='03-10')?.caveat.includes('疑似另一版本') || !linearAlgebraVerifiedLessons.find(x=>x.key==='04-04')?.caveat.includes('数三跳过')) throw new Error('linear duplicate/Math-I caveats missing');
if (futureLinearQueue[0] !== '04-05' || !futureLinearLessonForDate('2026-10-01')?.includes?.('04-05') || futureLinearLessonForDate('2026-11-19') !== null) throw new Error('October linear continuation queue missing or repeats after exhaustion');
if (!strictDateSchedules['2026-09-04'].some(x=>x.title.includes('方浩第1讲（随机事件：概念、关系与运算）'))) throw new Error('exact probability lecture topic normalisation missing');
const sep10Shifted = datedBlocks(1).filter(x=>x.date==='2026-09-10').map(x=>`${x.title} ${x.note}`).join('\n');
if (!sep10Shifted.includes('第1–5个新内容单元') || !sep10Shifted.includes('2010年 Text 1') || !sep10Shifted.includes('880 带刷（必做 · 32题') || !sep10Shifted.includes('第2章 08 矩阵的分块（断点收尾）')) throw new Error('September 10 as reset day 1 must replay the first study ledger with verified 436, English, math and linear details');
if (sep10Shifted.includes('第6–10个新内容单元') || sep10Shifted.includes('2010年 Text 2')) throw new Error('September 10 must not advance past the September 2 first-day ledger');
if (sep10Shifted.includes('剩余课第1节') || sep10Shifted.includes('剩余课第2节')) throw new Error('September 10 must not expose vague linear lesson placeholders');
if (!selfCheckRules || !taskCheck({type:'math',title:'880第一章 · 8题',note:''}).includes('概念/计算/思路')) throw new Error('math self-check rule missing');
const math880Check = taskCheck({type:'math',title:'880第一章 · 8题',note:''});
if (!math880Check.includes('次日或48小时') || !math880Check.includes('同类')) throw new Error('880 correction loop must require a delayed same-type retry');
if (!taskCheck({type:'major',title:'436 · 第4–6个新内容单元',note:''}).includes('按资料顺序核对内容单元')) throw new Error('436 ordinal self-check action missing');
if (!taskCheck({type:'english',title:'英语二 · 2010年 Text 1',note:''}).includes('证据句')) throw new Error('English evidence-sentence completion rule missing');
const mathCopy = [...study1,...week2,...highIntensityStartWeek].filter(x=>x.type==='math').map(x=>`${x.title} ${x.note}`).join('\n');
for (const forbidden of ['基础选择1–13','拓展解答1–2','综合解答7–12']) {
  if (mathCopy.includes(forbidden)) throw new Error(`excluded 880 work leaked into schedule: ${forbidden}`);
}
if (!mathCopy.includes('按题号顺序')) throw new Error('daily schedule must state the sequential 880 rule');
const taskCount = rows => rows.reduce((sum,x)=>sum+(x.note.match(/(?:计划表)?必做(\d+)题/)?.[1] ? Number(x.note.match(/(?:计划表)?必做(\d+)题/)[1]) : 0),0);
const chapter1Rows = Object.entries(strictDateSchedules).filter(([date])=>date>='2026-09-03'&&date<='2026-09-04').flatMap(([,rows])=>rows).filter(x=>x.type==='math'&&x.note.includes('必做')&&x.title.includes('880第一章'));
const chapter2Rows = Object.entries(strictDateSchedules).filter(([date])=>date>='2026-09-05'&&date<='2026-09-08').flatMap(([,rows])=>rows).filter(x=>x.type==='math'&&x.note.includes('必做')&&x.title.includes('880第二章'));
if (taskCount(chapter1Rows) !== 38) throw new Error(`chapter 1 daily required allocation must total 38, got ${taskCount(chapter1Rows)}`);
if (taskCount(chapter2Rows) !== 56) throw new Error(`chapter 2 daily required allocation must total 56, got ${taskCount(chapter2Rows)}`);
for (const [chapter,total] of [[3,86],[4,40],[5,41],[6,37]]) {
  const rows=Object.values(strictDateSchedules).flat().filter(x=>x.type==='math'&&x.title.includes(`880第${'一二三四五六七八九十'[chapter-1]}章`)&&x.note.includes('必做'));
  if (taskCount(rows)!==total) throw new Error(`chapter ${chapter} September required allocation must total ${total}, got ${taskCount(rows)}`);
}
// 436 序数渲染：用户 2026-09-07 拍板非专业出身、每天只背 5 个新内容单元
// （majorBaseline.dailyNewUnits=5）。以下序数按从零起步、5 个/天口径，
// 经八天整体顺延后落到各实际日期；章节提示
// 需与背诵笔记目录一致（第一章1–26、第二章27–48、第三章49–64、第四章65–108、
// 第五章109–135、第六章136–150…）。9/12 与 9/21 覆盖跨章提示（第一章–第二章、
// 第三章–第四章），验证 majorChapterHintForRange 的两章分支。
const sep29Rendered=datedBlocks(4).filter(x=>x.date==='2026-09-29'&&x.type==='major').map(x=>x.title).join('\n');
const oct3Rendered=datedBlocks(4).filter(x=>x.date==='2026-10-03'&&x.type==='major').map(x=>x.title).join('\n');
const oct4Rendered=datedBlocks(4).filter(x=>x.date==='2026-10-04'&&x.type==='major').map(x=>x.title).join('\n');
const oct8Rendered=datedBlocks(5).filter(x=>x.date==='2026-10-08'&&x.type==='major').map(x=>x.title).join('\n');
const sep12Rendered=datedBlocks(1).filter(x=>x.date==='2026-09-12'&&x.type==='major').map(x=>x.title).join('\n');
const all436=`${sep29Rendered}\n${oct3Rendered}\n${oct4Rendered}\n${oct8Rendered}\n${sep12Rendered}`;
// 9/10 从零起步：实际日比账面日后移 8 天；9/30 月末门禁落到实际 10/8。
if (!sep29Rendered.includes('第81–85个新内容单元（第四章）') || !oct3Rendered.includes('第101–105个新内容单元（第四章）') || !oct3Rendered.includes('第1–105个已背内容单元') || !oct4Rendered.includes('第106–110个新内容单元（第四章–第五章）') || !oct4Rendered.includes('第1–110个已背内容单元') || !oct8Rendered.includes('第72–142个已背内容单元（第四章–第六章）') || !oct8Rendered.includes('第143–213个已背内容单元') || !sep12Rendered.includes('第11–15个新内容单元（第一章）') || /p\d/.test(all436)) throw new Error('436 ordinal first-pass/review rendering is wrong under the eight-day reset lag (5 units/day)');
if (!oct3Rendered.includes('第101–105个新内容单元（第四章）')) throw new Error('436 ordinal labels must name the verified chapter from the actual 背诵笔记');
if (all436.includes('第214个')) throw new Error('ordinals must never run past the 213 verified units');
for (const day of ['2026-09-13','2026-09-20','2026-09-27']) {
  if (!strictDateSchedules[day].some(x=>x.type==='english' && x.title.includes('小作文审题'))) throw new Error(`low-dose September writing baseline missing ${day}`);
}
const sep30 = strictDateSchedules['2026-09-30'];
if (!sep30.some(x=>x.type==='math' && x.title.includes('九月闭卷小测6题') && x.note.includes('第1–6章各抽1道') && x.note.includes('基础/中等代表题') && x.note.includes('选择做/特难题不进小测'))) throw new Error('September 30 representative cross-chapter math readiness gate missing');
for (const unitRange of ['第1–71个已背内容单元','第72–142个已背内容单元','第143–213个已背内容单元']) {
  if (!sep30.some(x=>x.type==='major' && x.title.includes(unitRange))) throw new Error(`September 30 436 framework gate missing ${unitRange}`);
}
if (!sep30.some(x=>x.type==='major' && x.title.includes('第1–71个已背内容单元（第一章–第四章）'))) throw new Error('September 30 436 gate must map ordinal ranges to the verified chapters');
if (!courseLedger.some(x=>x.subject.includes('436') && x.now.includes('213个编号知识点') && x.now.includes('当前完成0个') && x.week.includes('一轮213个预计10/29前后收口') && x.week.includes('每天新增5个'))) throw new Error('436 ledger must carry the zero baseline, verified total and 5/day first-pass closeout');
// 2026-09-06：436《背诵笔记》结构成为内容单元序号的唯一事实来源。
if (majorRecitationMaterial.source !== '背诵笔记（436 资产评估专业基础）' || majorRecitationMaterial.totalUnits !== 213 || majorRecitationMaterial.pages !== 168) throw new Error('436 recitation material must be the verified 背诵笔记 with 213 numbered points across 168 pages');
if (majorChapterCumulative.length !== 10 || majorChapterCumulative.reduce((s,c)=>s+c.units,0) !== 213 || majorChapterCumulative[3].to !== 108 || majorChapterCumulative[9].from !== 202) throw new Error('436 chapter cumulative map must cover the recitation part in the verified order');
if (majorChapterForUnit(1)?.no !== '第一章' || majorChapterForUnit(78)?.no !== '第四章' || majorChapterForUnit(213)?.no !== '第十章' || majorChapterForUnit(214) !== null) throw new Error('unit→chapter lookup broken');
if (majorChapterHintForRange(70,72) !== '第四章' || majorChapterHintForRange(25,30) !== '第一章–第二章') throw new Error('chapter hint for ordinal ranges broken');
if (sep30.some(x=>`${x.title} ${x.note}`.includes('当日新页'))) throw new Error('September 30 436 closeout must not claim there are new pages');
if (!sep30.some(x=>x.type==='major' && x.note.includes('断点章-节-内容单元'))) throw new Error('September 30 436 gate must record ordinal breakpoints');
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
if (routeData[0].dates !== '9月10日—9月21日' || !routeData[0].desc.includes('数学与436均未开始') || !routeData[0].desc.includes('实际9/10从原题单第1天开刷')) throw new Error('phase route must show the 9/10 math/436 reset');
if (!routeData.every(x => x.desc.includes('带刷'))) throw new Error('every phase must reference the brush plan');
if (!routeData[2].check.includes('9月30日') || !routeData[2].check.includes('实际数据')) throw new Error('October route must be gated by September evidence');
if (!routeData[2].check.includes('未达项') || !routeData[2].check.includes('先回补')) throw new Error('October route must say what to do when a gate fails');
for (const rule of ['剩余题单','可用分钟','订正/回测']) if (!routeData[2].check.includes(rule)) throw new Error(`October capacity rule missing: ${rule}`);
if (/145小时|每天3小时|50天/.test(`${routeData[2].desc} ${routeData[2].check}`)) throw new Error('external 880 timing claim must not become the personal October schedule');
const allowedFhsuTitles = new Set(['报关实务','外贸英文函电','国际贸易实务','营销学','财务管理','商业政策']);
for (const [date, rows] of Object.entries(strictDateSchedules)) {
  for (const row of rows.filter(x=>x.type==='fhsu')) {
    if (!allowedFhsuTitles.has(row.title) || row.note) throw new Error(`FHSU row must remain course-name-only: ${date} ${row.title}`);
  }
}
// 2026-09-07 晚间：非 fhsu 校内课改为 type 'course'，并列靠边、不排任务。
const nonFhsuCourses=new Set(['报关实务','外贸英文函电','国际贸易实务','形势与政策4']);
for (const [date,rows] of Object.entries(strictDateSchedules)) {
  for (const row of rows.filter(x=>nonFhsuCourses.has(x.title))) {
    if (row.type!=='course') throw new Error(`non-fhsu course must be type 'course': ${date} ${row.title}`);
    if (row.note) throw new Error(`non-fhsu course must carry no task note: ${date} ${row.title}`);
    if (Array.isArray(row.title)) throw new Error(`course row title must be a string, not nested array: ${date}`);
  }
}
// 课程元数据必须按周几给全教室；财务管理教师由用户口述确认为 NAHID，
// 其余教师没有可核对姓名，必须明确写待核对，不能恢复历史误标。
for (const row of baseClasses) {
  const info=courseInfo[row.title];
  if (!info || !info.rooms || !info.rooms[row.day]) throw new Error(`courseInfo must have a room for ${row.title} on day ${row.day}`);
}
for (const row of baseClasses.filter(x=>x.type==='fhsu')) {
  if (!courseInfo[row.title].foreign) throw new Error(`fhsu course must be marked (FHSU): ${row.title}`);
}
if (courseInfo['财务管理'].teacher!=='NAHID') throw new Error('finance teacher must use the user-confirmed NAHID name');
for (const [name,info] of Object.entries(courseInfo)) if (name!=='财务管理' && info.teacher!=='待核对') throw new Error(`unverified teacher must stay explicitly pending: ${name}`);

// 最终页面守卫：底层账面还要经过真实星期课表和固定晚间框架重排。
// 这里直接验证用户最终看到的时间轴，防止旧“15:45回家”重新压到15:00–16:35课程上。
for (let date=new Date('2026-09-09T12:00:00'); date<=new Date('2026-10-23T12:00:00'); date.setDate(date.getDate()+1)) {
  const actual=new Date(date), key=actual.toISOString().slice(0,10), index=rangeIndexFor(actual);
  const {data}=composeDailyAgenda(actual,index);
  const rows=[...data].sort((a,b)=>minutes(a.start)-minutes(b.start));
  if (rows[0]?.start!=='06:00' || rows.at(-1)?.end!=='24:00') throw new Error(`rendered page boundary missing on ${key}`);
  for (let i=1;i<rows.length;i++) if (rows[i].start!==rows[i-1].end) throw new Error(`rendered page gap/overlap ${key}: ${rows[i-1].end} -> ${rows[i].start}`);
  const commutes=rows.filter(x=>x.title==='通勤 · 学校→家');
  if (key==='2026-09-10') {
    if (commutes.length!==0) throw new Error('reported nap day must not show an unobserved commute');
  } else if (commutes.length!==1 || commutes[0].start!=='18:05' || commutes[0].end!=='18:25') throw new Error(`rendered page must show the single fixed 18:05 commute on ${key}`);
}
{
  const actual=new Date('2026-09-09T12:00:00'), {data}=composeDailyAgenda(actual,rangeIndexFor(actual));
  if (!data.some(x=>x.start==='15:00'&&x.end==='16:35'&&x.title.includes('营销学'))) throw new Error('9/9 real afternoon class missing from rendered page');
  if (!data.some(x=>x.start==='13:15'&&x.end==='14:50'&&x.title.includes('国商502')&&x.title.includes('教师：NAHID'))) throw new Error('9/9 finance row must show verified room and teacher');
  if (!data.some(x=>x.start==='08:20'&&x.end==='09:55'&&x.title.includes('国商608')&&x.title.includes('教师：待核对'))) throw new Error('unverified teacher must be visible as pending instead of invented');
  if (!data.some(x=>x.start==='19:10'&&x.end==='19:30'&&x.title==='洗澡 · 放空')) throw new Error('fixed evening recovery block must not be overwritten by packed study');
  if (brushFocusFor(actual,data)!==null) throw new Error('9/9 must show no 880 task before the reset start');
  const status=agendaPosition(data,new Date('2026-09-09T19:15:00'));
  if (status.active?.title!=='洗澡 · 放空' || !status.next) throw new Error('current/next panel must read from the final rendered agenda');
}
{
  const actual=new Date('2026-09-10T12:00:00'), {data}=composeDailyAgenda(actual,rangeIndexFor(actual));
  const brush=brushFocusFor(actual,data);
  if (!brush || brush.count!==32 || brush.sourceDate!=='2026-09-08' || brush.scheduledMinutes!==235 || brush.deficitMinutes!==0) throw new Error('9/10 880 focus must reflect the reported nap and the revised morning-plus-evening execution slots');
}

// 2026-09-09 最新口径：FHSU 必须听课；其余校内课从 9/10 起都是定量数学刷题时间，且绝不背 436。
for (let date=new Date('2026-09-10T12:00:00'); date<=new Date('2026-10-23T12:00:00'); date.setDate(date.getDate()+1)) {
  const actual=new Date(date), key=actual.toISOString().slice(0,10), index=rangeIndexFor(actual);
  const {data}=composeDailyAgenda(actual,index), dayIndex=(actual.getDay()+6)%7;
  for (const source of baseClasses.filter(x=>x.day===dayIndex)) {
    if (key==='2026-09-10'&&source.start==='15:00') continue;
    const row=data.find(x=>x.start===source.start&&x.end===source.end);
    if (!row) throw new Error(`class-time row missing from final agenda: ${key} ${source.title}`);
    if (source.type==='fhsu') {
      if (row.type!=='fhsu'||!/（FHSU）/.test(row.title)||/880|436|刷题/.test(`${row.title} ${row.note}`)) throw new Error(`FHSU class must remain course-only: ${key} ${source.title}`);
    } else if (row.type!=='math'||!row.studyClass||!row.title.startsWith('880 带刷')||!/原课表：/.test(row.note)||!row.note.includes('课内不背436')) {
      throw new Error(`non-FHSU class must become quantified math-only study: ${key} ${source.title}`);
    }
  }
  const entry=brushPlanEntryFor(key);
  if (entry) {
    const allocated=data.filter(x=>Number.isInteger(x.brushCount)&&x.brushCount>0).reduce((sum,x)=>sum+x.brushCount,0);
    if (allocated!==entry[3]) throw new Error(`final 880 slot quantities must total the daily plan: ${key} expected=${entry[3]} got=${allocated}`);
  }
}
{
  const {data}=composeDailyAgenda(new Date('2026-11-07T12:00:00'),9);
  const politicsClass=data.find(x=>x.start==='08:20'&&x.end==='11:45'&&x.studyClass&&x.originalCourse?.includes('形势与政策4'));
  if (!politicsClass||politicsClass.type!=='math'||!politicsClass.title.includes('数学刷题')||!politicsClass.note.includes('不背436')) throw new Error('non-FHSU politics class must also become a quantified math study slot after the 880 plan ends');
}

for (const [date,expected] of [['2026-09-02',0],['2026-09-21',0],['2026-09-22',1],['2026-10-08',1],['2026-10-09',2],['2026-11-08',2],['2026-11-09',3],['2026-12-08',3],['2026-12-09',4]]) if (currentRouteIndex(new Date(`${date}T12:00:00`))!==expected) throw new Error(`phase highlight must follow the eight-day shifted ledger date, wrong on ${date}`);
for (const [date, rows] of Object.entries(strictDateSchedules)) {
  const sorted=[...rows].sort((a,b)=>minutes(a.start)-minutes(b.start));
  if (sorted[0].start!=='06:00' || sorted.at(-1).end!=='24:00') throw new Error(`strict day must cover 06:00-24:00 boundary: ${date}`);
  for(let i=1;i<sorted.length;i++) if(minutes(sorted[i].start)<minutes(sorted[i-1].end)) throw new Error(`strict overlap ${date}: ${sorted[i-1].title} / ${sorted[i].title}`);
  const displayed=buildDayAgenda(rows,0,new Date(`${date}T12:00:00`).getDay()).sort((a,b)=>minutes(a.start)-minutes(b.start));
  if (displayed[0].start!=='06:00' || displayed.at(-1).end!=='24:00') throw new Error(`displayed agenda boundary missing: ${date}`);
  for(let i=1;i<displayed.length;i++) if(displayed[i].start!==displayed[i-1].end) throw new Error(`displayed agenda gap/overlap ${date}: ${displayed[i-1].end} -> ${displayed[i].start}`);
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
// 2026-09-07 极限强度：早上在家加练45分钟后，上限放宽到735分钟（12.25小时）。
if (heaviest>735) throw new Error(`strict plan exceeds 12.25 active study hours (extreme-mode ceiling): ${Object.entries(activeMinutes).filter(([,value])=>value>735).map(([date,value])=>`${date}=${value}`).join(', ')}`);
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
