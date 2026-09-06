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
| `actualScheduleStartDate` / `scheduleLagDays` | 实际第 1 天与顺延天数（当前 2026-09-06 / 4 天） |
| `septemberContinuation` | 9/14–9/30 每日 spec（436 页段 / 880 题号 / 英语 / 概率） |
| `currentBaselineDate` / `majorBaseline` | 436 起点（前 3 个已背）与每日新单元数（9 个/学习日） |
| `majorRecitationMaterial` / `majorChapterCumulative` | 《背诵笔记》真实结构：10 章 213 个编号知识点，"第 N 个内容单元"的唯一事实来源 |
| `linearAlgebraVerifiedLessons` / `linearAlgebraLessonSlots` / `futureLinearQueue` | 线代链：核对过的真实文件名、9 月排期、10 月队列 |
| `probabilityRawDurations` | 方浩概率逐讲原始时长（夸克核对） |
| `math880Required` | 880 顺序推进元数据（从第 1 题按序，14–16 题/天） |
| `applyFixedEveningFrame()` | 固定晚间框架：18:05 回家 → 充电+夸克挂下载 → 19:30/21:00/22:30 三段 → 00:00 关灯 |
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

## 当前锚点快照（2026-09-07，改动前先确认用户有没有新进展）

- **实际第 1 天 = 2026-09-06**，滞后 4 天（9/2–9/5 未执行）。
- **436**：只背了前 3 个（9/7 确认），新单元从 9/3 账起、9 个/学习日、周日只回收；
  一轮 213 个于 9/30 账收口并总回收；资料结构见 `majorRecitationMaterial`。
- **880**：从第一章第 1 题按题号顺序推进，14–16 题/天，课内刷题格计入；
  第一章 9/3–9/4 账、第二章 9/5–9/8 账……第六章 9/19–9/21 账收口；9/28–9/29 错题总回做，9/30 小测。
- **线代**：第 2 章只剩 2.8 矩阵的分块（34% 断点，9/3 账已排收尾）；2.9 已听完（100%，永不排课）；
  之后 03 矩阵相似 → 04 二次型按真实文件名推进（`linearAlgebraVerifiedLessons`）。
- **概率**：方浩基础班 30 讲，第 1 讲文件名已核对，29/30 讲数一跳过。
- **作息**：06:00 起、07:00 在家加练、07:50 出门 30 分钟到校、18:05 回家、00:00 关灯；
  午休 12:20–12:45（25–35 分钟封顶）。
- **iPhone**：描述文件（`kaoyan.mobileconfig`，Web Clip 指向线上）已可用，装一次即常新。

## 常见任务怎么做

- **用户漏做了一天** → 顺延机制 +1（改 `scheduleLagDays` 或整体后移对应序列），同步更新
  受影响的题号/单元区间与 tests；然后跑测试。
- **用户说"XX 只做了 N 个 / 还没开始"** → 找到对应序列的起点常量（436：`currentBaselineDate`；
  880：题号锚点行；线代：`linearAlgebraLessonSlots`）整体后移，别让账面跳号。
- **改强度** → 880 题量在 `septemberContinuation` 的 spec.math 与账面行；436 在 `majorBaseline`。
  改完更新 tests 里的合计校验（章合计 38/56/86/40/41/37、436 总量 213 是硬数字）。
- **改作息/排版** → `strictMorning`/`routines`/`applyFixedEveningFrame`，注意 06:00–24:00
  连续无缝、无重叠是测试保护的。
- **用户给了新资料/截图** → 先核对出"事实清单"（用户确认过），再进对应数据结构 + README + tests。

## 接手口令（用户可以直接把下面这段发给任何 AI）

> 这是我的考研课表项目：https://github.com/POP-YU/kaoyan-planner （线上：https://pop-yu.github.io/kaoyan-planner/ ）。
> 先完整读仓库里的 AGENTS.md 和 README.md，严格遵守里面的铁律。改任何内容前先告诉我你打算改什么；
> 改完必须跑 `node tests/schedule.mjs && node tests/smoke.mjs && node tests/perf.mjs`，三套全绿才能提交推送到 main。
> 推送后线上一分钟内自动更新，我的 iPhone 图标打开就是新版。
