import { readFileSync } from 'node:fs';
const root = new URL('..', import.meta.url);
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const must = (text, fragment, label) => { if (!text.includes(fragment)) throw new Error(`missing ${label}`); };
['小于的考研课表','id="daily-agenda"','id="phase-line"','id="live-clock"','id="current-task-title"','id="next-task-title"','id="date-subtitle"','id="show-today"','id="show-tomorrow"','向左划看明天，向右划回今天','kaoyan.mobileconfig','id="app-version"','apple-touch-icon'].forEach((x) => must(html,x,x));
must(html,'考研任务按未完成账顺延','ledger explanation');
must(html,'路线日期是锚点；日任务按实际执行日顺延','phase anchor explanation');
['styles.css?v=reset-0910j','app.js?v=reset-0910j'].forEach((x) => must(html,x,x));
// 2026-09-08：主屏 Web Clip 用户要求"打开即最新版"。sw.js（网络优先、缓存仅离线兜底）
// 已注册；每次发布必须同步 bump index.html 的 sw.js?v= 与 sw.js 内 CACHE 版本。
must(html,"serviceWorker.register('sw.js?v=reset-0910j')",'service worker registration');
must(sw,"kaoyan-reset-0910j",'sw cache version');
must(sw,"addEventListener('fetch'",'sw fetch handler');
must(sw,'caches.delete','sw old cache purge');
must(sw,'skipWaiting','sw immediate activation');
must(html,'id="syllabus-table"','436 recitation syllabus section');
must(html,'id="syllabus-progress"','436 syllabus progress line');
[
  'id="intensity-calibration"',
  '7天新课抢救 · 数学约六四开',
  '9月11日至17日',
  '前置未学',
  '已学做错',
  '独立做对',
  '一道跨章节题不用于判断整章水平',
  '先背，再刷',
  '9月10日880已完成17/32题，剩15题顺延',
  '436第1–3个已背熟，第4个起顺延',
  '23:15–23:40只打一局游戏',
  '1份19条精读总结和1份483条视频元数据表'
].forEach((x) => must(html,x,`intensity calibration: ${x}`));
[
  'id="major-method"',
  '小于的436背书法',
  '每天最多5个新内容单元',
  '课内只刷数学，不背436',
  'A：能独立讲完整',
  'B：能讲框架但漏关键点',
  'C：关书后无法开口',
  '当天 → 次日 → 第3天 → 第7天',
  '名词解释',
  '简答 / 论述',
  '计算题',
  '章末：一页章节框架 → 已核对的辽大436真题 → 对照补答题语句',
  '日期｜新内容1–5｜A/B/C',
  '先清欠账，再开新内容',
  '连续执行7天后再按真实结果调整'
].forEach((x) => must(html,x,`436 method: ${x}`));
const syllabusIndex = html.indexOf('id="syllabus-table"');
const methodIndex = html.indexOf('id="major-method"');
const intensityIndex = html.indexOf('id="intensity-calibration"');
const mainEndIndex = html.indexOf('</main>');
if (!(intensityIndex < syllabusIndex && syllabusIndex < methodIndex && methodIndex < mainEndIndex)) throw new Error('intensity calibration must precede the syllabus and 436 method must remain the final main-page section');
['本周完成度','今天如果只完成一件事','这张表怎么用','容错规则'].forEach((x) => { if (html.includes(x)) throw new Error(`obsolete copy remains: ${x}`); });
if (html.includes('modal-backdrop') || html.includes('data-action="complete-task"') || html.includes('method-strip') || html.includes('review-view')) throw new Error('obsolete interactive/extra sections remain');
if (html.includes('date-range-switcher') || html.includes('view-switcher')) throw new Error('all dates should stay on one page');
if (/fonts\.(googleapis|gstatic)\.com/.test(html)) throw new Error('remote font dependency should not delay first render');
['@media(max-width:900px)','phase-card','agenda-item','brush-focus','task-check','ledger-table','--font-ui','font-variant-numeric:tabular-nums','contain:layout paint','overflow-wrap:anywhere','.phase-card small{position:static','margin-top:auto','.day-view-switch','touch-action:pan-y','overscroll-behavior-x:contain','.day-agenda-card.is-tomorrow','.intensity-calibration','.intensity-grid','.major-method-section','.method-loop','.answer-template-grid','.method-fit-grid'].forEach((x) => must(css,x,x));
['--swipe-x','.is-dragging','.swipe-ghost','@keyframes swipe-enter-left','will-change:transform'].forEach((x)=>{if(css.includes(x))throw new Error(`laggy follow-finger CSS remains: ${x}`);});
if (css.includes('.phase-card small{position:absolute')) throw new Error('phase completion text must stay in normal flow instead of overlapping the description');
['renderTimetable','renderMajorSyllabus','majorRecitationMaterial','majorChapterCumulative','majorFirstDayCompletedUnits','datedBlocks','buildDayAgenda','composeDailyAgenda','applyReportedNapOverride','reportedNapDate','reportedBrushCompleted','reportedBrushRemaining','14:20–18:07实际睡眠','未进行 · 436移到晚间后只完成第1–3个','已完成17 / 32题','剩15题移到明天','436 · 实际进度：第1–3个已背熟，第4个起未完成','游戏一局 · 25分钟时间盒','英语阅读与薄弱词今晚未做','线代2.8明天08:20优先处理','newCourseRescueStart','newCourseRescueEnd','applyNewCourseRescueOverride','newCourseRescueFocusFor','prioritizeMemorizationBeforeBrush','P/W/A','前置未学','9月10日剩余15题','actualCompleted','actualRemaining','排入时间不等于完成量','brushFocusFor','agendaPosition','rangeStarts','2026-09-02','actualScheduleStartDate','resetStudyStartDate','2026-09-10','scheduleLagDays','scheduleSourceDate','currentBaselineDate','majorCumulativeForDate','majorNewRangeForDate','strictDateSchedules','breakfastMenu','breakfastFor','probabilityRawDurations','probabilityModules','probabilityLecture1File','linearAlgebraVerifiedLessons','linearAlgebraLessonSlots','futureLinearQueue','futureLinearLessonForDate','taskCheck','验收：','次日或48小时','剩余题单','可用分钟','订正/回测','方浩第1讲（随机事件：概念、关系与运算）','特征值与特征向量','p1–6','章内题数以手头书为准','九月闭卷小测6题','月末门禁','小作文审题','routeData','updateClock','scheduleClock','visibilitychange','stopLiveUpdates','06:00','24:00','肉夹馍','绿豆粥','英语二 · 2010年 Text 1','英语单词 · 新20 + 旧40','按题号顺序推进','880第一章 · 第1–4题（顺序启动）','按题号顺序','math880BrushPlan','brushPlanEntryFor','brushPlanLagDays','880 带刷',"今日${brush.rescueMode?'活跃题单':'战单'}",'教师：','必做828题9/10–10/20完成','881个题号与原表逐章逐题型一致','Blackboard（BB）作业 · 周五晚固定','blackboardFridayStart','classAgendaRow','allocateBrushPlanAcrossAgenda','课内不背436','setAgendaDayOffset','setupDayNavigation','pointerdown','pointerup','数一不排','今日事今日毕','213个编号知识点','矩阵的分块','断点收尾','18:05','夸克挂下载','承前格续做','applyFixedEveningFrame','APP_VERSION'].forEach((x) => must(js,x,x));
['高数诊断','作业 · 当天清掉','只听课，不叠考研任务','洗漱 · 整理床铺','离开屏幕','routine-night-break'].forEach((x) => { if (js.includes(x)) throw new Error(`obsolete schedule copy remains: ${x}`); });
['10/23收尾后开始数学真题入口','限时集中→仿真作答→错题二测→总结自检','“7天4套、模拟2天1套”只作强度参考','不机械追套数'].forEach((x) => must(js,x,`source-calibrated route: ${x}`));
// 2026-09-08：用户真实课表本身以 (FHSU) 标记三门外教课，渲染层用它做标注，不再算 obsolete copy。
if (!js.includes("const blackboardFridayStart = '19:30'") || !js.includes("const blackboardFridayEnd = '20:30'")) throw new Error('fixed Friday-evening Blackboard rule is missing');
['localStorage','setInterval(updateClock,1000)','renderRoute();renderTimetable()'].forEach((x) => { if (js.includes(x)) throw new Error(`performance regression remains: ${x}`); });
['145小时','每天3小时约50天','一天100词','政治≤1h'].forEach((x) => { if (js.includes(x)) throw new Error(`external creator quota leaked into personal schedule: ${x}`); });
const blocks = (js.match(/t\('w1-/g) || []).length;
if (blocks < 30) throw new Error(`expected rich week 1 data, got ${blocks}`);
console.log(`SMOKE_STATIC_OK blocks=${blocks}`);
