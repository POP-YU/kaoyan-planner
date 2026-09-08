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
vm.runInNewContext(`${source}\n;globalThis.__plannerTest={baseClasses,routines,study1,week2,phaseBlocks,schedules,highIntensityStartWeek,strictStartDate,currentBaselineDate,actualScheduleStartDate,scheduleLagDays,scheduleSourceDate,majorBaseline,majorCumulativeForDate,majorNewRangeForDate,strictDateSchedules,septemberContinuation,probabilityRawDurations,probabilityMathScope,probabilityModules,probabilityLecture1File,linearAlgebraVerifiedLessons,linearAlgebraLessonSlots,linearAlgebraCatchupSlots,linearAlgebraAppliedSlots,futureLinearQueue,futureLinearLessonForDate,majorRecitationMaterial,majorChapterCumulative,majorChapterForUnit,majorChapterHintForRange,courseLedger,math880Required,math880BrushPlan,brushPlanEntryFor,brushPlanStartDate,brushPlanLagDays,selfCheckRules,taskCheck,routeData,datedBlocks,buildDayAgenda,currentRouteIndex,courseInfo};`, context, {filename:'app.js'});
const {baseClasses,routines,study1,week2,schedules,highIntensityStartWeek,strictStartDate,currentBaselineDate,actualScheduleStartDate,scheduleLagDays,scheduleSourceDate,majorBaseline,majorCumulativeForDate,majorNewRangeForDate,strictDateSchedules,septemberContinuation,probabilityRawDurations,probabilityMathScope,probabilityModules,probabilityLecture1File,linearAlgebraVerifiedLessons,linearAlgebraLessonSlots,linearAlgebraCatchupSlots,linearAlgebraAppliedSlots,futureLinearQueue,futureLinearLessonForDate,majorRecitationMaterial,majorChapterCumulative,majorChapterForUnit,majorChapterHintForRange,courseLedger,math880Required,math880BrushPlan,brushPlanEntryFor,brushPlanStartDate,brushPlanLagDays,selfCheckRules,taskCheck,routeData,datedBlocks,buildDayAgenda,currentRouteIndex,courseInfo} = context.__plannerTest;
const minutes = value => { const [h,m] = value.split(':').map(Number); return h*60+m; };

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

const homeworkDays = study1.filter(x => x.type==='homework').map(x => x.day).sort();
if (homeworkDays.join(',') !== '4,5,6') throw new Error(`homework days must be Fri-Sun, got ${homeworkDays}`);
if (!math880Required || math880Required.source !== '李林880题（数学三）· 2026-09-07 中午改回带刷表跳选题号') throw new Error('brush-plan 880 source missing');
if (!math880Required.rule?.includes('按带刷计划表逐日跳选指定题号') || !math880Required.rule.includes('必做828题9/9–10/19完成') || !math880Required.rule.includes('特难题16题10/22收尾') || !math880Required.rule.includes('周日只吃计划表当周的周日轻量格')) throw new Error('brush-plan 880 rule missing');
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
  const e=brushPlanEntryFor('2026-09-09');
  if (!e || e[2] !== math880BrushPlan[0][2] || brushPlanEntryFor('2026-09-08') !== null) throw new Error('brushPlanEntryFor must start on 9/9 with lag=1');
  // 周日缓冲不动（2026-09-09 拍板）：实际周日吃计划表同日期的周日轻量格；
  // 周中（含周六）跳过计划表周日格按序消费；尾部自然后推（lag=1 时特难题 10/22 收尾）。
  const sun913=brushPlanEntryFor('2026-09-13');
  if (!sun913 || sun913[0] !== '2026-09-13' || sun913[3] !== 15) throw new Error('Sunday 9/13 must take the plan Sunday light entry (15题), not the shifted Saturday load');
  if (brushPlanEntryFor('2026-09-14')[0] !== '2026-09-12') throw new Error('Monday 9/14 must resume the plan weekday sequence (plan 9/12)');
  if (brushPlanEntryFor('2026-09-20')?.[0] !== '2026-09-20' || brushPlanEntryFor('2026-09-20')?.[3] !== 10) throw new Error('every plan-week Sunday must stay light');
  if (brushPlanEntryFor('2026-10-19')?.[0] !== '2026-10-17') throw new Error('last required entry must land on actual 10/19 under Sunday protection');
  if (brushPlanEntryFor('2026-10-22')?.[1] !== '特难题') throw new Error('hard-problem tail must close on actual 10/22');
  if (brushPlanEntryFor('2026-10-23') !== null || brushPlanEntryFor('2026-10-25') !== null) throw new Error('plan exhausted: weekdays after 10/22 and Sundays after 10/18 must not schedule 880');
}
// 带刷覆盖渲染守卫：2026-09-08 休整顺延1天后，实际 9/9 起每天数学格变成“880 带刷”并写明题号明细。
{
  const allDays=[0,1,2,3,4,5,6,7].flatMap(i=>datedBlocks(i));
  for (const [actual,tail] of [['2026-09-09','基础选择：8、12-13'],['2026-09-13','综合填空：1-3、5-10、12-15'],['2026-10-09','第15章·随机事件及其概率'],['2026-10-22','综合解答：2']]) {
    const brush=allDays.filter(x=>x.date===actual && x.type==='math' && x.title.includes('880 带刷'));
    if (!brush.length) throw new Error(`brush overlay missing on ${actual}`);
    if (!brush.some(x=>`${x.title} ${x.note}`.includes(tail))) throw new Error(`brush task detail missing on ${actual}: ${tail}`);
  }
  const nonBrush=allDays.filter(x=>x.date==='2026-09-08' && x.type==='math' && x.title.includes('带刷'));
  if (nonBrush.length) throw new Error('brush overlay must not start before 2026-09-09 (9/8 is a rest day, lag=1)');
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
if (currentBaselineDate !== '2026-09-03' || majorBaseline.completedUnits !== 3 || majorBaseline.dailyNewUnits !== 5) throw new Error('436 baseline must be three completed units with five new units per study day (user-paced 20-30min/unit)');
if (actualScheduleStartDate !== '2026-09-06' || scheduleLagDays !== 4) throw new Error('2026-09-06 is the confirmed first execution day; the four unexecuted days 9/2-9/5 must create a four-day catch-up lag');
if (scheduleSourceDate('2026-09-06') !== '2026-09-02' || scheduleSourceDate('2026-09-07') !== '2026-09-03' || scheduleSourceDate('2026-09-03') !== '2026-09-03') throw new Error('actual dates must consume the four unfinished ledgers in order from 2026-09-06');
// 2026-09-08 休整：从实际 9/9 起账面再滞后 1 天（436/线代/概率/英语），9/4 账在 9/9 重演。
if (scheduleSourceDate('2026-09-08') !== '2026-09-04' || scheduleSourceDate('2026-09-09') !== '2026-09-04' || scheduleSourceDate('2026-09-13') !== '2026-09-08' || scheduleSourceDate('2026-10-05') !== '2026-09-30') throw new Error('9/8 rest must add one replay day from actual 9/9 (lag 4->5)');
if (majorCumulativeForDate('2026-09-02') !== 3 || majorCumulativeForDate('2026-09-03') !== 8 || majorNewRangeForDate('2026-09-03').start !== 4 || majorNewRangeForDate('2026-09-03').end !== 8) throw new Error('436 September 2 ordinal range must cover units 4-8 at the five-per-day pace');
if (majorNewRangeForDate('2026-09-06') !== null || majorCumulativeForDate('2026-09-06') !== 18) throw new Error('Sunday must be review-only for 436');
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
  '436 · 第1–3个已背内容单元'
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
const sep6Shifted = datedBlocks(0).filter(x=>x.date==='2026-09-06').map(x=>`${x.title} ${x.note}`).join('\n');
if (!sep6Shifted.includes('第1–3个已背内容单元') || !sep6Shifted.includes('2010年 Text 1') || !sep6Shifted.includes('错题登记') || !sep6Shifted.includes('第2章 08 矩阵的分块（断点收尾）')) throw new Error('September 6 as day 1 must replay the unfinished first study day with sequential 880 and verified linear naming');
if (sep6Shifted.includes('第13–21个新内容单元') || sep6Shifted.includes('2010年 Text 2')) throw new Error('September 6 must not advance past the missed September 2 plan');
if (sep6Shifted.includes('剩余课第1节') || sep6Shifted.includes('剩余课第2节')) throw new Error('September 6 must not expose vague linear lesson placeholders');
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
// （majorBaseline.dailyNewUnits=5，一轮 213 个预计 10/25 前后账收口）。以下序数
// 按 5 个/天口径，经五天顺延（9/2–9/5 四天 + 9/8 休整一天）后落到各实际日期；章节提示
// 需与背诵笔记目录一致（第一章1–26、第二章27–48、第三章49–64、第四章65–108、
// 第五章109–135、第六章136–150…）。9/12 与 9/21 覆盖跨章提示（第一章–第二章、
// 第三章–第四章），验证 majorChapterHintForRange 的两章分支。
const sep29Rendered=datedBlocks(4).filter(x=>x.date==='2026-09-29'&&x.type==='major').map(x=>x.title).join('\n');
const oct3Rendered=datedBlocks(4).filter(x=>x.date==='2026-10-03'&&x.type==='major').map(x=>x.title).join('\n');
const oct4Rendered=datedBlocks(4).filter(x=>x.date==='2026-10-04'&&x.type==='major').map(x=>x.title).join('\n');
const oct5Rendered=datedBlocks(5).filter(x=>x.date==='2026-10-05'&&x.type==='major').map(x=>x.title).join('\n');
const sep12Rendered=datedBlocks(1).filter(x=>x.date==='2026-09-12'&&x.type==='major').map(x=>x.title).join('\n');
const all436=`${sep29Rendered}\n${oct3Rendered}\n${oct4Rendered}\n${oct5Rendered}\n${sep12Rendered}`;
// 9/8 休整后账面再 +1：实际 9/29→9/24 账（94–98）、10/3→9/28 账（109–113）、
// 10/4→9/29 账（114–118）、9/30 的月末三段门禁落到实际 10/5、9/12→9/7 账（19–23）。
if (!sep29Rendered.includes('第94–98个新内容单元（第四章）') || !sep29Rendered.includes('第1–98个已背内容单元') || !oct3Rendered.includes('第109–113个新内容单元（第五章）') || !oct3Rendered.includes('第1–113个已背内容单元') || !oct4Rendered.includes('第114–118个新内容单元（第五章）') || !oct4Rendered.includes('第1–118个已背内容单元') || !oct5Rendered.includes('第72–142个已背内容单元（第四章–第六章）') || !oct5Rendered.includes('第143–213个已背内容单元') || !sep12Rendered.includes('第19–23个新内容单元（第一章）') || /p\d/.test(all436)) throw new Error('436 ordinal first-pass/review rendering is wrong under the five-day lag (5 units/day)');
if (!oct3Rendered.includes('第109–113个新内容单元（第五章）')) throw new Error('436 ordinal labels must name the verified chapter from the actual 背诵笔记');
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
if (!courseLedger.some(x=>x.subject.includes('436') && x.now.includes('213个编号知识点') && x.week.includes('一轮213个于10/25账') && x.week.includes('每天新增5个'))) throw new Error('436 ledger must carry the verified recitation totals and the 5/day first-pass closeout');
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
if (routeData[0].dates !== '9月2日—9月13日' || !routeData[0].desc.includes('带刷计划表逐日跳选题号') || !routeData[0].desc.includes('实际9/9开刷')) throw new Error('phase route must show the brush-plan 880 switch');
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
// 课程元数据必须按周几给全教室（来自用户真实课表截图 2026-09-08）；截图无教师姓名，
// 此前误标的人名已删除；fhsu 三门须标 (FHSU) 外教课。
for (const row of baseClasses) {
  const info=courseInfo[row.title];
  if (!info || !info.rooms || !info.rooms[row.day]) throw new Error(`courseInfo must have a room for ${row.title} on day ${row.day}`);
}
for (const row of baseClasses.filter(x=>x.type==='fhsu')) {
  if (!courseInfo[row.title].foreign) throw new Error(`fhsu course must be marked (FHSU): ${row.title}`);
}
for (const name of Object.keys(courseInfo)) {
  if (courseInfo[name].teacher) throw new Error(`courseInfo must not carry teacher names (schedule has none): ${name}`);
}

for (const [date,expected] of [['2026-09-02',0],['2026-09-14',0],['2026-09-19',1],['2026-10-01',1],['2026-10-06',2],['2026-11-06',3],['2026-12-06',4]]) if (currentRouteIndex(new Date(`${date}T12:00:00`))!==expected) throw new Error(`phase highlight must follow the consumed ledger date, wrong on ${date}`);
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
