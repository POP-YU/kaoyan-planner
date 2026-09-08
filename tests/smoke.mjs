import { readFileSync } from 'node:fs';
const root = new URL('..', import.meta.url);
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const must = (text, fragment, label) => { if (!text.includes(fragment)) throw new Error(`missing ${label}`); };
['小于的考研课表','id="daily-agenda"','id="phase-line"','id="live-clock"','kaoyan.mobileconfig','id="app-version"','apple-touch-icon'].forEach((x) => must(html,x,x));
must(html,'9 月 6 日是实际起步日','first execution day explanation');
must(html,'路线日期是锚点；日任务按实际执行日顺延','phase anchor explanation');
['styles.css?v=brush-0909b','app.js?v=brush-0909b'].forEach((x) => must(html,x,x));
// 2026-09-08：主屏 Web Clip 用户要求"打开即最新版"。sw.js（网络优先、缓存仅离线兜底）
// 已注册；每次发布必须同步 bump index.html 的 sw.js?v= 与 sw.js 内 CACHE 版本。
must(html,"serviceWorker.register('sw.js?v=brush-0909b')",'service worker registration');
must(sw,"kaoyan-brush-0909b",'sw cache version');
must(sw,"addEventListener('fetch'",'sw fetch handler');
must(sw,'caches.delete','sw old cache purge');
must(sw,'skipWaiting','sw immediate activation');
must(html,'id="syllabus-table"','436 recitation syllabus section');
must(html,'id="syllabus-progress"','436 syllabus progress line');
['本周完成度','今天如果只完成一件事','这张表怎么用','容错规则'].forEach((x) => { if (html.includes(x)) throw new Error(`obsolete copy remains: ${x}`); });
if (html.includes('modal-backdrop') || html.includes('data-action="complete-task"') || html.includes('method-strip') || html.includes('review-view')) throw new Error('obsolete interactive/extra sections remain');
if (html.includes('date-range-switcher') || html.includes('view-switcher')) throw new Error('all dates should stay on one page');
if (/fonts\.(googleapis|gstatic)\.com/.test(html)) throw new Error('remote font dependency should not delay first render');
['@media(max-width:900px)','phase-card','agenda-item','task-check','ledger-table','--font-ui','font-variant-numeric:tabular-nums','contain:layout paint','overflow-wrap:anywhere','.phase-card small{position:static','margin-top:auto'].forEach((x) => must(css,x,x));
if (css.includes('.phase-card small{position:absolute')) throw new Error('phase completion text must stay in normal flow instead of overlapping the description');
['renderTimetable','renderMajorSyllabus','majorRecitationMaterial','majorChapterCumulative','datedBlocks','buildDayAgenda','rangeStarts','2026-09-02','actualScheduleStartDate','scheduleLagDays','scheduleSourceDate','currentBaselineDate','majorCumulativeForDate','majorNewRangeForDate','strictDateSchedules','breakfastMenu','breakfastFor','probabilityRawDurations','probabilityModules','probabilityLecture1File','linearAlgebraVerifiedLessons','linearAlgebraLessonSlots','futureLinearQueue','futureLinearLessonForDate','taskCheck','验收：','次日或48小时','剩余题单','可用分钟','订正/回测','方浩第1讲（随机事件：概念、关系与运算）','特征值与特征向量','p1–6','章内题数以手头书为准','九月闭卷小测6题','月末门禁','小作文审题','routeData','updateClock','scheduleClock','visibilitychange','stopLiveUpdates','06:00','24:00','肉夹馍','绿豆粥','英语二 · 2010年 Text 1','英语单词 · 新20 + 旧40','按题号顺序推进','880第一章 · 第1–4题（顺序启动）','按题号顺序','math880BrushPlan','brushPlanEntryFor','brushPlanLagDays','880 带刷','必做828题9/9–10/18完成','881个题号与原表逐章逐题型一致','Blackboard作业 · 周五开放项','数一不排','今日事今日毕','213个编号知识点','矩阵的分块','断点收尾','18:05','夸克挂下载','承前格续做','applyFixedEveningFrame','APP_VERSION'].forEach((x) => must(js,x,x));
['高数诊断','作业 · 当天清掉','只听课，不叠考研任务','洗漱 · 整理床铺','离开屏幕','routine-night-break'].forEach((x) => { if (js.includes(x)) throw new Error(`obsolete schedule copy remains: ${x}`); });
// 2026-09-08：用户真实课表本身以 (FHSU) 标记三门外教课，渲染层用它做标注，不再算 obsolete copy。
if ((js.match(/Blackboard作业/g) || []).length < 3) throw new Error('Blackboard homework schedule is missing');
['localStorage','setInterval(updateClock,1000)','renderRoute();renderTimetable()'].forEach((x) => { if (js.includes(x)) throw new Error(`performance regression remains: ${x}`); });
['145小时','每天3小时约50天','一天100词','政治≤1h'].forEach((x) => { if (js.includes(x)) throw new Error(`external creator quota leaked into personal schedule: ${x}`); });
const blocks = (js.match(/t\('w1-/g) || []).length;
if (blocks < 30) throw new Error(`expected rich week 1 data, got ${blocks}`);
console.log(`SMOKE_STATIC_OK blocks=${blocks}`);
