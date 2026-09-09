# AGENTS.md — 给任何接手这个仓库的 AI（先读完再动手）

这是**小于的考研每日课表**：纯静态页（HTML+CSS+JS，无后端、无构建），线上地址
**https://pop-yu.github.io/kaoyan-planner/** = `main` 分支的实时部署（推送后 ~1 分钟自动更新）。
iPhone 上已装"描述文件"（Web Clip），图标打开的就是线上地址——**发布即更新，无需重装**。

用户：辽大 025600 资产评估专硕（2027 届），科目：数学三 / 英语二 / 436 资产评估专业基础 / 政治，
初试约 2026 年 12 月下旬。用户是唯一事实来源；他的口述 = 最高优先级的事实。

## 铁律（违反任何一条 = 这次修改不合格）

1. **只写已核对的事实。** 题号、页码、课程文件名、时长，必须有出处（用户提供的文件/截图/口述）。
   没核对过的写"待核对"，**绝不编造题号、页码、单元数**。
2. **账面 ≠ 实际。** 课表按"账面日期"顺序消化（顺延机制见 app.js 的
   `actualScheduleStartDate` / `scheduleLagDays`）。用户漏做了 → 整体顺延，**绝不把没做的当完成**。
   用户说"我只背了前三个/还没做" → 对应序列的起点整体后移。
3. **睡眠边界 00:00 关灯（极限 00:30）不许动。** 强度只能加到用户资料包（《考研冲刺3个月规划》
   等）的水平；用户没要求就别自己发明新量。
4. **推送前三套测试必须全绿**：
   ```bash
   node tests/schedule.mjs   # 账面事实与不变量
   node tests/smoke.mjs      # 页面/文案锚点
   node tests/perf.mjs       # 定时器行为
   ```
   测试是"事实的守卫"：改了事实就要改测试，改了测试就要能说出对应的事实变化。
5. **别把用户的本地资料编进仓库。** 抖音资料包、背诵笔记 PDF、夸克清单在用户本机
   （C:\Users\Pop\Doubao\... 和微信传的文件），仓库里只放核对后的结论。

## 代码地图（全在 app.js，约 1000 行）

| 常量/函数 | 含义 |
|---|---|
| `strictDateSchedules` | 9/2–9/30 每日账面（键=账面日期，显示时按滞后映射到实际日期） |
| `resetStudyStartDate` / `actualScheduleStartDate` / `scheduleLagDays` | 数学与 436 的实际第 1 天及账面顺延（当前 2026-09-10 / 8 天） |
| `septemberContinuation` | 9/14–9/30 每日 spec（436 页段 / 880 题号 / 英语 / 概率） |
| `currentBaselineDate` / `majorBaseline` | 436 账面起点（9/2 模板、完成 0 个）与每日新单元数（5 个/学习日） |
| `majorRecitationMaterial` / `majorChapterCumulative` | 《背诵笔记》真实结构：10 章 213 个编号知识点，"第 N 个内容单元"的唯一事实来源 |
| `linearAlgebraVerifiedLessons` / `linearAlgebraLessonSlots` / `futureLinearQueue` | 线代链：核对过的真实文件名、9 月排期、10 月队列 |
| `probabilityRawDurations` | 方浩概率逐讲原始时长（夸克核对） |
| `math880Required` / `math880BrushPlan` | 880 带刷原题单：44 天、881 个题号；当前实际 2026-09-10 起跑，`brushPlanEntryFor` / `brushPlanLagDays=2` 负责映射与顺延 |
| `courseInfo` / `courseDisplayTitle()` | 课程教室与教师展示；财务管理教师 NAHID 来自用户口述，其余教师仍待核对，禁止恢复历史误标人名 |
| `applyFixedEveningFrame()` | 固定晚间框架：18:05 回家 → 充电+夸克挂下载 → 19:30/21:00/22:30 三段 → 00:00 关灯 |
| `composeDailyAgenda()` / `brushFocusFor()` / `agendaPosition()` | 最终页面合成、880 今日战单、当前/下一格定位；课程、生活框架、顺延任务的优先级只在这里收口，schedule 测试会直接检查最终结果 |
| `blackboardFridayBlock()` | 真实星期约束：Blackboard/BB 只在周五 19:30–20:30，历史账面的 homework 行在最终合成时全部丢弃 |
| `setAgendaDayOffset()` / `setupDayNavigation()` | 默认今天；手指向右划看明天、向左划回今天，卡片跟手移动并平滑换页，按钮是同等兜底 |
| `strictMorning()` / `routines` | 早晨框架：06:00 起床 → 06:20 第一格 → 07:00–07:45 在家加练 → 07:50 出门（买饭+吃+走路 30 分钟）→ 08:20 到校 |
| `majorOrdinalLabel` / `normalizeMajorString` | "第 X–Y 个内容单元"序号引擎（含章提示、213 封口、二轮滚动） |
| `routeData` / `courseLedger` | 阶段路线与台账（README 测试都锚定其中的句子，改文案要同步 tests） |

## 验证与发布

```bash
node tests/schedule.mjs && node tests/smoke.mjs && node tests/perf.mjs   # 全绿才准推送
git add -A && git commit -m "..." && git push origin main                 # 推送即发布
```

- 缓存穿透：改了代码要同步 `index.html` 的 `?v=` 参数和 `tests/smoke.mjs` 里的版本串。
- 版本号显示：页面页脚 `APP_VERSION`（app.js 顶部），改了就让它跟 `?v=` 一致。
- 发布后验证：打开线上 URL 确认内容变了（或 `curl` 线上 `app.js?v=新版本号`）。

## 2026-09-09 最新重置与页面规则

- 用户最新确认：截至 9/9，数学 880 完成 0 题、436 完成 0 个内容单元；旧“9/6 已开始”“436 前 3 个已背”“880 9/9 开刷”全部作废。
- 实际 9/10 统一起跑：`scheduleLagDays=8`，9/10 消化 9/2 首账；`brushPlanLagDays=2`，9/10 显示原 9/8 题单的第 1 天 32 题；436 显示第 1–5 个内容单元。
- 9/9 最终页面不得显示任何 `math` / `major` 任务；9/10 才出现首日任务。数学首日已排 120 分钟、对照原表估时仍缺 78 分钟，必须如实显示，不能把排入时间冒充完成。
- Blackboard/BB 是真实星期约束，只在每周五 19:30–20:30 出现一次；最终合成层忽略旧模板里所有 `homework` 行，周六、周日和白天不得出现。
- 页面默认今天；手指从 `#daily-agenda` 中间向右划看明天、向左划回今天，拖动期间卡片必须跟手，也可点“今天 / 明天”。顶部“当前安排 / 接下来”始终取真实今天，不把明日预览误标为正在进行。
- `composeDailyAgenda()` 是最终渲染的单一入口：真实课程优先于冲突的休息占位；固定晚间框架只保留一段 18:05–18:25 回家通勤，并保留 19:10–19:30 洗澡恢复块。
- `tests/schedule.mjs` 会检查重置起点、Blackboard 周五唯一性和最终显示时间轴；`tests/perf.mjs` 会模拟右滑/左滑。所有日程仍必须 06:00–24:00 连续且无重叠。
- 用户随后要求把教室、教师和 880 写得更明确：课程标题显示真实教室；财务管理显示用户口述的教师 `NAHID`，其余教师因现有截图无姓名而显示“待核对”；`brushFocusFor()` 完整列出当日 880 题单、原题单日期、题量、估时、已排分钟和缺口，不擅自增加题号或把排入时间当完成。

## 当前锚点快照（2026-09-09，改动前先确认用户有没有新进展）

- **实际第 1 天 = 2026-09-10**，9/2 起的账面整体后移 8 天。
- **436**：当前完成 0 个；9/10 从第 1–5 个起，5 个/学习日、周日只回收；一轮 213 个预计实际 10/29 前后收口。资料结构见 `majorRecitationMaterial`。
- **880**：2026-09-07 中午用户拍板改回**带刷表跳选题号**（推翻同日早间“顺序推进”方案）。
  逐日原题单在 `math880BrushPlan`（44 天，9/8→10/21；必做 828、选择做 37、特难题 16，合计 881，已与原表核对）。当前完成 0 题；实际 9/10 从原 9/8 首日 32 题起跑，预计 10/23 收尾。
  渲染时 `applyBrushPlanOverlay` 把当天数学格改写成“880 带刷”题单。
  落后就把 `brushPlanLagDays` +1，周日是缓冲垫。
- **线代**：第 2 章只剩 2.8 矩阵的分块（34% 断点，9/3 账已排收尾）；2.9 已听完（100%，永不排课）；
  之后 03 矩阵相似 → 04 二次型按真实文件名推进（`linearAlgebraVerifiedLessons`）。
- **概率**：方浩基础班 30 讲，第 1 讲文件名已核对，29/30 讲数一跳过。
- **FHSU 课程行纯净化（硬约束）**：用户 2026-09-07 明确要求“fhsu 的课程不能够允许你占用”——报关实务/外贸英文函电/国际贸易实务/营销学/财务管理/商业政策只承载课程信息（课程名、FHSU、教室、教师），不嵌入 880/线代/概率/436 任务。880 带刷题单、线代、概率一律落在课余/晚间数学格：`continuationRows` 里原本写进 FHSU 课内格的 `spec.mathMorning` / `spec.math` 已改为晚间 `mathMorningEvening(spec)` 槽位；9/30 门禁日的 `majorGate[0]`（第1–71个）也从课内格移到了晚间 major 槽，三个回收桶（1–71 / 72–142 / 143–213）全部保留。
- **作息**：06:00 起、07:00 在家加练、07:50 出门 30 分钟到校、18:05 回家、00:00 关灯；
  午休 12:20–12:45（25–35 分钟封顶）。
- **iPhone**：描述文件（`kaoyan.mobileconfig`，Web Clip 指向线上）已可用，装一次即常新。

## 交接素材索引（tools/）

- `2027李林880带刷执行计划.xlsx` — 880 官方逐日题单 + 进度看板（用户每天在里面打勾；
  网页课表管"什么时间做什么"，这份 Excel 管"题做没做完"，两者并行使用）
- `brush_plan.json` — 从 Excel"每日计划"表提取的 44 天结构化数据（date/stage/task/count/hours）
- `gen880_from_pdf.py` — 从带刷计划表 PDF + 两本做题本 PDF 生成上述 Excel 的原始脚本
  （换开始日期：改脚本里的 START 重跑）

## 常见任务怎么做

- **用户漏做了一天** → 顺延机制 +1（改 `scheduleLagDays` 或整体后移对应序列），同步更新
  受影响的题号/单元区间与 tests；然后跑测试。
- **用户说"XX 只做了 N 个 / 还没开始"** → 找到对应序列的起点常量（436：`currentBaselineDate`；
  880：题号锚点行；线代：`linearAlgebraLessonSlots`）整体后移，别让账面跳号。
- **改强度** → 880 题单改 `math880BrushPlan`（逐日题号，改完同步 tests 的 881/828/37/16 总量校验）；436 在 `majorBaseline`。
  改完更新 tests 里的合计校验（章合计 38/56/86/40/41/37、436 总量 213 是硬数字）。
- **改作息/排版** → `strictMorning`/`routines`/`applyFixedEveningFrame`，注意 06:00–24:00
  连续无缝、无重叠是测试保护的。
- **用户给了新资料/截图** → 先核对出"事实清单"（用户确认过），再进对应数据结构 + README + tests。

## 2026-09-07 中午：880 改回带刷表跳选（用户拍板）

- 用户把《2027李林880带刷执行计划.xlsx》接入课表：**880 恢复带刷表跳选题号**，
  推翻同日早间"从第 1 题按题号顺序推进"的方案。44 天逐日题单全部进入
  `math880BrushPlan`（实际日期 9/8 → 10/21，必做 828 + 选择做 37 + 特难题 16 = 881，
  与原带刷计划表逐章逐题型程序化核对一致）。
- 实现方式：渲染层覆盖。`applyBrushPlanOverlay` 按实际日期把当天 880 数学格改写成
  带刷题单（第一个数学格承载完整题单，其余为"续"格；线代/概率格不动）；
  实际 10/5–10/21 的账面账已用完，由生成的带刷日子接管（键=实际日期，datedBlocks 回退命中）。
- 顺延机制独立于账面 `scheduleLagDays`：带刷表本身按真实日历排（周日=缓冲垫），
  漏做一天就把 `brushPlanLagDays` +1。
- 测试同步：schedule.mjs 增加 881/828/37/16 总量、日期连续性、阶段窗口、覆盖渲染守卫；
  smoke.mjs 版本串升为 `brush-0907`。原顺序推进的账面行保留为历史账（测试仍守卫其完整性）。

## 接手口令（用户可以直接把下面这段发给任何 AI）

> 这是我的考研课表项目：https://github.com/POP-YU/kaoyan-planner （线上：https://pop-yu.github.io/kaoyan-planner/ ）。
> 先完整读仓库里的 AGENTS.md 和 README.md，严格遵守里面的铁律。改任何内容前先告诉我你打算改什么；
> 改完必须跑 `node tests/schedule.mjs && node tests/smoke.mjs && node tests/perf.mjs`，三套全绿才能提交推送到 main。
> 推送后线上一分钟内自动更新，我的 iPhone 图标打开就是新版。
