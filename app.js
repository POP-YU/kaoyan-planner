const days = ['周一','周二','周三','周四','周五','周六','周日'];
const times = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
const storageKey = 'yu-kaoyan-planner-v1';
let state = {done:{},snoozed:{},reviews:{}};
try { state = {...state,...JSON.parse(localStorage.getItem(storageKey) || '{}')}; } catch { localStorage.removeItem(storageKey); }
let currentWeek = 1; let currentView = 'timetable'; let currentTask = null; let selectedDay = 0;
const t = (id,day,start,end,title,type,note,why,steps,output) => ({id,day,start,end,title,type,note,why,steps,output});
const course = (id,day,start,end,title,type='other',note='课内关键词') => t(id,day,start,end,title,type,note,'课堂先稳住：能听懂的先听懂，不和它抢深度注意力。',['听讲并记 3 个关键词','下课后用 2 分钟回想主线'], '留 3 个关键词，晚上不额外补课。');
const mustListen = (id,day,start,end) => course(id,day,start,end,'课程 · 必须听','fhsu','只听课，不叠考研任务');
const baseClasses = [
  t('mon-quiet-436',0,'08:20','09:55','436 · 新页输入','major','背诵笔记 p1–3','非FHSU课程时段改成安静学习。',['看目录','做框架卡','合书复述'],'3页框架卡'),
  mustListen('mon-marketing',0,'10:10','11:45'),mustListen('mon-finance',0,'15:00','16:35'),mustListen('tue-policy',1,'13:15','14:50'),
  t('wed-quiet-eng',2,'08:20','09:55','英语 · 真题阅读','english','1篇限时 + 证据句','非FHSU课程时段直接给考研主线。',['20分钟做题','逐题找证据','记错因'],'1篇阅读卡'),
  mustListen('wed-finance',2,'13:15','14:50'),mustListen('wed-marketing',2,'15:00','16:35'),
  t('thu-quiet-436',3,'08:20','09:55','436 · 旧页闭卷','major','复述前3天内容','非FHSU课程时段用来做安静输出。',['合书写标题','补关键词','抽1道短答'],'1页回忆纸'),
  mustListen('thu-policy',3,'10:10','11:45'),
  t('thu-quiet-eng',3,'15:00','16:35','英语 · 词汇与长难句','english','40词 + 5句','这段不塞视频，做适合课堂环境的安静任务。',['回想40词','拆5句主干','标记5个薄弱词'],'词汇清单'),
  t('fri-quiet-436',4,'10:10','11:45','436 · 新页输入','major','背诵笔记 p13–15','非FHSU课程时段继续专业课主线。',['读3页','写小标题','合书复述'],'3页框架卡')
];
const routines = days.flatMap((_,i)=>[
  t(`routine-reset-${i}`,i,'06:20','06:45','洗漱 · 整理床铺','routine','让身体醒透','先收拾自己和桌面，六点起床才不会变成起床后发懵。',['洗漱','整理床铺','把书桌留出今天第一块'],'桌面清爽'),
  t(`routine-wake-${i}`,i,'06:00','06:20','起床 · 洗脸喝水','routine','6:00 起床','你喜欢六点起床，所以第一格不是学习，是让身体醒过来。',['喝水','洗脸','打开窗/走动 3 分钟'],'人醒了再开始'),
  t(`routine-breakfast-${i}`,i,'07:00','07:30','早餐项目','meal','吃完再出门','早餐是学习的启动键，不把空腹硬撑当自律。',['蛋白质：鸡蛋/奶/豆制品任选一','主食：包子/燕麦/面包任选一','带水出门'],'吃饱、带水出门'),
  t(`routine-leave-${i}`,i,'07:30','07:35','出门检查','routine','钥匙、卡、水、耳机','出门前只检查一次，减少路上折返。',['钥匙/校园卡','水和耳机','确认作业已带'],'准时出门'),
  t(`routine-commute-${i}`,i,'07:35','07:55','通勤 · 家→学校','routine','20 分钟','通勤不算硬学习时间，听音频或回想提纲都可以。',['准备耳机和水','只听轻内容','到校后先坐稳'],'准时到校'),
  t(`routine-arrive-${i}`,i,'07:55','08:20','到校 · 找座准备','routine','不急着开卷','到校先坐稳，喝两口水，把第一节课要用的东西摆好。',['找到座位','水放手边','看一眼课程'],'准备完成'),
  t(`routine-break-am-${i}`,i,'11:45','11:50','下课 · 走动五分钟','routine','离开屏幕','短暂走动比继续坐着刷手机更能恢复。',['起身走动','接水','再去吃饭'],'身体动起来'),
  t(`routine-lunch-${i}`,i,'11:50','12:20','午饭 + 走动','meal','不边吃边刷题','午饭给大脑一个真正的暂停，下午才有深度。',['正常吃饭','走 5–10 分钟','回到桌前再开始'],'吃饭完成'),
  t(`routine-return-${i}`,i,'16:35','17:00','回程 · 收拾书包','routine','从课上切出来','回到生活节奏，不把课程情绪带进晚间深度块。',['收拾课本','洗手喝水','决定晚间第一块'],'切换完成'),
  t(`routine-dinner-${i}`,i,'17:00','17:40','晚饭 + 放空','meal','给晚上留电量','晚饭不是浪费时间，是把晚间学习做稳的前提。',['吃饭','简单收拾','决定晚上第一块做什么'],'能量回升'),
  t(`routine-evening-reset-${i}`,i,'17:40','18:00','短休 · 洗脸走动','routine','不要立刻开卷','晚饭后给大脑一个小缓冲，回来再开始数学或 436。',['洗脸/走动','放下手机','准备第一本资料'],'准备开始'),
  t(`routine-night-break-${i}`,i,'20:45','21:00','晚间小休','routine','离开座位','长学习块之间留十五分钟，避免越学越晕。',['喝水','看远处','再回到桌前'],'恢复注意力'),
  t(`routine-wind-${i}`,i,'23:30','24:00','洗漱 · 00:00 睡','sleep','把零点当固定收工线','你说以后零点左右睡，所以23:30开始收尾，不再把凌晨两点当常态。',['收手机','洗漱','确认明天第一格'],'00:00 关灯')
]);
const study1 = [
  t('w1-mon-hw',0,'12:20','13:20','作业 · 当天清掉','homework','只做必须交的','一小时到点就停。',['列清单','先交付','剩余进周末格'],'作业收口'),
  t('w1-mon-diagnose',0,'13:20','14:50','高数 · 12题诊断','math','90分钟闭卷','不看视频，先测真实独立性。',['极限4题','积分4题','其余4题'],'正确率+错因'),
  t('w1-mon-math',0,'18:00','19:30','高数 · 错题回炉','math','只补诊断暴露点','不整套重听。',['重做4题','补2道同类','写错因'],'6题结果'),
  t('w1-mon-436',0,'19:30','20:45','436 · p1–3闭卷复述','major','上午输入，晚上回收','把同3页说出来，不开新页。',['写标题','口述关键词','补缺口'],'1页回忆纸'),
  t('w1-mon-eng',0,'21:00','22:00','英语 · 真题阅读1','english','20分钟做题 + 40分钟复盘','只做一篇完整闭环。',['限时','找证据','写错因'],'1张阅读卡'),
  t('w1-mon-close',0,'22:00','23:20','436卡片 + 单词','buffer','先436后单词','最后一块做轻输出，不开长视频。',['抽10张卡','回想40词'],'薄弱卡清单'),

  t('w1-tue-math',1,'08:00','10:00','线代第2章 · 剩余课第1节 + 6题','math','听课最多70分钟','至少留50分钟独立做题。',['1.5倍速听','做6题','标卡点'],'6题结果'),
  t('w1-tue-436',1,'10:15','11:45','436 · p4–6','major','新3页 + 合书复述','名词准确，简答先抓框架。',['读3页','写小标题','复述'],'3页框架卡'),
  t('w1-tue-hw',1,'12:20','13:00','作业 · 必交部分','homework','40分钟收口','不让作业进入晚间主块。',['完成必须交的'],'作业收口'),
  t('w1-tue-major2',1,'15:00','16:30','436 · p1–6回忆','major','课堂后安静输出','不看资料先写，再对照。',['写框架','补关键词'],'1页回忆纸'),
  t('w1-tue-problems',1,'18:00','20:00','线代第2章 · 对应题10道','math','先做后看','同类错误第二次出现才补视频。',['基础6题','综合4题','分错因'],'10题结果'),
  t('w1-tue-eng',1,'20:00','20:45','英语 · 长难句5句','english','只拆主干','轻量但不断线。',['拆5句','回想生词'],'5句标注'),
  t('w1-tue-night',1,'21:00','22:30','436 · p4–6短答','major','写2个短答骨架','每题只看结构和关键词。',['短答2题','对照补点'],'2个骨架'),
  t('w1-tue-vocab',1,'22:30','23:20','英语 · 单词回想','english','40词','睡前只做回想，不刷手机。',['回想40词','圈5个薄弱词'],'5个薄弱词'),

  t('w1-wed-436',2,'10:15','11:45','436 · p7–9','major','新3页 + 前页抽查','先复述昨天，再开新页。',['抽查p4–6','读p7–9','合书复述'],'3页框架卡'),
  t('w1-wed-hw',2,'18:00','19:00','作业 · 当天清掉','homework','一小时硬停','先清掉再进数学。',['完成作业'],'作业收口'),
  t('w1-wed-math',2,'19:00','20:30','线代第2章 · 剩余课第2节 + 6题','math','今天收完课程','至少留40分钟做题。',['1.5倍速听','做6题','记卡点'],'课程收完+6题'),
  t('w1-wed-eng',2,'21:00','22:00','英语 · 真题阅读2','english','限时 + 证据句','开始观察固定错因。',['20分钟做题','逐题找证据','写错因'],'1张阅读卡'),
  t('w1-wed-major2',2,'22:00','23:20','436 · p1–9连续复述','major','按框架连续说','卡住再翻，不边看边背。',['连续复述','补3个缺口'],'缺口清单'),

  t('w1-thu-hw',3,'12:20','13:10','作业 · 提前收口','homework','50分钟','只保交付。',['完成必须交的'],'作业收口'),
  t('w1-thu-436',3,'13:15','14:45','436 · p10–12 + 计算1','major','新3页 + 1道计算','公式、条件、步骤一起写。',['读3页','做1题','复述'],'3页+1题'),
  t('w1-thu-math',3,'18:00','19:30','线代第2章 · 48小时回测6题','math','闭卷60分钟','低于70%才补具体知识点。',['6题计时','核对','标错因'],'正确率'),
  t('w1-thu-major2',3,'19:30','20:45','436 · p1–12抽查','major','旧页回忆','抽名词和短答，不开新页。',['抽10个名词','写1个短答'],'抽查结果'),
  t('w1-thu-eng',3,'21:00','22:15','英语 · 真题阅读3','english','一篇完整复盘','课堂词汇要回收到真题里。',['限时','证据句','错因'],'1张阅读卡'),
  t('w1-thu-preview',3,'22:15','23:20','概率 · 方浩目录预习 + 基础概念','math','只建入口，不抢跑长课','把明天第1讲需要的概念先认清。',['看目录','写5个概念','准备配套题'],'概率入口卡'),

  t('w1-fri-math',4,'08:00','10:00','概率 · 方浩第1–2讲 + 6题','math','1.5倍速含停顿约68分钟','剩余时间必须做题。',['听2讲','做6题','记错因'],'2讲+6题'),
  t('w1-fri-hw',4,'12:20','13:20','作业 · 周末前清空','homework','一小时','清单归零。',['完成作业'],'周末零欠账'),
  t('w1-fri-436',4,'13:45','15:45','436 · p13–15 + 短答2题','major','框架和落笔串起来','不是只读3页。',['读3页','写2题','复述'],'3页+2题'),
  t('w1-fri-eng',4,'18:00','19:00','英语 · 真题阅读4','english','本周第4篇','完成一周最小阅读量。',['限时','证据句','错因'],'1张阅读卡'),
  t('w1-fri-review',4,'19:15','20:45','数学 · 本周错题8道','math','高数+线代混合','先独立重做。',['高数4题','线代4题'],'8题结果'),
  t('w1-fri-major2',4,'21:00','22:20','436 · p1–15连续复述','major','按章节顺序说','记忆断点单列。',['连续复述','补缺口'],'断点清单'),
  t('w1-fri-vocab',4,'22:20','23:20','英语 · 单词回想','english','50词','轻量收尾。',['回想50词','圈薄弱词'],'薄弱词'),

  t('w1-sat-math',5,'08:00','10:30','概率 · 方浩第3–4讲 + 6题','math','听课约90分钟','至少留45分钟做题。',['听2讲','做6题','核对'],'2讲+6题'),
  t('w1-sat-436',5,'10:45','11:45','436 · p16–18','major','新3页','一小时只做输入和复述。',['读3页','合书复述'],'3页框架卡'),
  t('w1-sat-major2',5,'12:20','13:20','436 · 计算2','major','完整写步骤','条件、公式、单位都写。',['独立做1题','对照补步骤'],'1题完整过程'),
  t('w1-sat-eng',5,'14:00','15:00','英语 · 长难句 + 词汇','english','5句 + 40词','保持接触。',['拆5句','回想40词'],'标注结果'),
  t('w1-sat-hw',5,'15:15','16:15','作业 · 机动收口','homework','有作业就做','没有就改成60分钟休息。',['处理作业或休息'],'清单归零'),
  t('w1-sat-major3',5,'18:00','20:45','436 · p1–18闭卷回忆','major','中间自行休息10分钟','把本周内容压成一张纸。',['写框架','抽名词','写短答'],'一页总框架'),
  t('w1-sat-eng2',5,'21:00','22:15','英语 · 本周4篇错因回看','english','不做新阅读','把重复错因找出来。',['看4张卡','圈重复错因'],'下周提醒'),
  t('w1-sat-close',5,'22:15','23:20','436卡片 · 轻回想','major','只抽卡','睡前不再开新页。',['抽15张卡'],'薄弱5张'),

  t('w1-sun-math',6,'09:00','11:00','概率 · 方浩第5–6讲 + 周回收','math','听课约55分钟','重做第1–4讲错题。',['听2讲','重做6题'],'2讲+6题'),
  t('w1-sun-436',6,'11:15','11:45','436 · 名词抽查','major','30分钟闭卷','只查准确度。',['抽10个名词'],'准确率'),
  t('w1-sun-major2',6,'12:20','13:20','436 · 计算3 + 短答1','major','本周第三个计算单元','按计分步骤写。',['计算1题','短答1题'],'2题过程'),
  t('w1-sun-hw',6,'14:00','15:00','作业 · 最后收口','homework','不带进下周','做完就停。',['清掉必须交的'],'零欠账'),
  t('w1-sun-eng',6,'15:00','16:00','英语 · 本周复盘','english','4篇错因归类','只归为词义/句法/定位/逻辑/干扰项。',['归类错因','定下周重点'],'错因统计'),
  t('w1-sun-major3',6,'18:00','19:30','436 · p1–18闭卷复述','major','周末验收','能说出框架才算完成。',['连续复述','标断点'],'完成率'),
  t('w1-sun-math2',6,'19:30','20:45','数学 · 周错题回炉','math','不新增题','重做代表题。',['重做5题'],'下周重点'),
  t('w1-sun-review',6,'21:00','22:00','周复盘 · 只看四个数','buffer','数学正确率/英语篇数/436页数/睡眠','只调整下周一个变量。',['记4个数','改1处'],'下周调整项'),
  t('w1-sun-buffer',6,'22:00','23:20','容错格 · 补最小单元','buffer','只补一个，不清债','全完成就休息。',['补1个最小单元或休息'],'不欠核心任务')
];const week2 = study1.map(x => ({...x,id:x.id.replace('w1-','w2-'),title:x.title.replace('基线小测','基础题组').replace('搭框架','框架回忆').replace('第一篇阅读','第二篇阅读').replace('第二篇阅读','第三篇阅读').replace('第三篇阅读','第四篇阅读'),why:x.why}));
const phaseBlocks = [
  t('w3-mon-math',0,'08:00','10:00','数学 · 章节推进','math','基础题 + 1 道变式','从第一周的基线进入稳定推进。',['完成一小节例题','做 8 道基础题','把重复错因加粗'],'章节清单 + 错因'),
  t('w3-tue-436',1,'10:15','12:15','436 · 主题短答','major','定义→解释→例子','开始按题型输出，不只认关键词。',['抽 2 个主题','每题 12 分钟作答','对照评分点补漏'],'2 个短答'),
  t('w3-wed-eng',2,'18:45','20:15','英语 · 两篇对照','english','看证据链','把阅读速度和证据质量放在一起看。',['一篇限时','一篇精读','记录时间差'],'两篇错因'),
  t('w3-thu-math',3,'18:00','20:00','数学 · 线代主线','math','概念+题型','线代不再被挤到最后，保持每周可见。',['复习概念','做 8 道基础题','写出一页公式关系'],'一页线代图'),
  t('w3-fri-436',4,'13:45','15:45','436 · 计算题步骤','major','完整书写','训练“会做”到“按步骤拿分”。',['独立完成 3 题','逐步核对','标注丢分点'],'3 题过程'),
  t('w3-sat-politics',5,'14:00','15:00','政治 · 低量启动','politics','只建立目录','先认地图，不在第一周就背满。',['看章节目录','记 5 个关键词','写下暂时不懂的点'],'目录卡'),
  t('w3-sun-mock',6,'09:00','11:30','周测 · 数学+436','buffer','组合小测','用小测决定下周加哪一科，不用一次成绩定义自己。',['数学 90 分钟','436 30 分钟','整理失分原因'],'组合小测记录')
];
const schedules = {1:[...baseClasses,...study1],2:[...baseClasses,...week2],3:[...baseClasses,...phaseBlocks],5:[...baseClasses,...phaseBlocks.map(x=>({...x,id:x.id.replace('w3-','w5-'),title:x.title.replace('推进','真题组').replace('主题短答','题型压缩').replace('两篇对照','真题精读').replace('线代主线','真题线代').replace('计算题步骤','计分点训练').replace('低量启动','选择题启动').replace('组合小测','限时组合')}))]};
const breakfastMenu = [
  {name:'小米粥 + 茶叶蛋 + 玉米',price:'约 5–7 元',source:'食堂窗口优先',swap:'没有玉米就换成馒头'},
  {name:'无糖豆浆 + 鸡蛋 + 素菜包',price:'约 4–6 元',source:'食堂窗口优先',swap:'菜包太油时换白馒头'},
  {name:'燕麦牛奶 + 香蕉 + 茶叶蛋',price:'约 7–10 元',source:'便利店/外卖',swap:'牛奶换无糖豆浆'},
  {name:'鸡蛋灌饼（少酱） + 无糖豆浆',price:'约 7–10 元',source:'校门附近',swap:'饼皮油时只吃半张，补一个鸡蛋'},
  {name:'八宝粥 + 白煮蛋 + 小馒头',price:'约 6–8 元',source:'食堂窗口优先',swap:'甜粥换小米粥'},
  {name:'全麦面包 + 纯牛奶 + 苹果',price:'约 8–12 元',source:'便利店/外卖',swap:'苹果换香蕉'},
  {name:'豆腐脑（少油） + 鸡蛋 + 馒头',price:'约 6–9 元',source:'食堂窗口优先',swap:'不加辣油'},
  {name:'玉米 + 无糖酸奶 + 茶叶蛋',price:'约 8–11 元',source:'便利店/外卖',swap:'酸奶换纯牛奶'}
];
// 课程时长只写已经从用户夸克目录核对到的数字；没有总时长的课程明确留空。
const pauseRate = 0.15;
const courseLedger = [
  {subject:'线代 · 没咋了',now:'第二章只剩 2 节课',week:'周二、周三各收 1 节；周四做 6 题闭卷回测',done:'课听完 + 对应题 10–12 道 + 48小时后 6题正确率≥70%'},
  {subject:'概率 · 方浩',now:'基础班 30 讲，尚未正式推进',week:'周五第1–2讲；周六第3–4讲；周日第5–6讲',done:'每两讲至少 6 道基础题；做不出时只补对应知识点'},
  {subject:'高数 · 张宇/1000',now:'基础学过，独立性要重测',week:'周一 90 分钟诊断；周末只回炉错题',done:'12题闭卷；低于70%的章节才定点补课'},
  {subject:'436 · 背诵笔记',now:'168页；第一轮从目录和定义开始',week:'每天新3页 + 当天闭卷复述；周日只回收旧页',done:'能合书说出框架；每周3个计算题单元'},
  {subject:'英语二 · 真题',now:'阅读量少，先做精读闭环',week:'本周4篇：限时20分 + 证据句 + 错因',done:'每篇留1张错因卡，不用技巧视频代替真题'}
];
function renderCourseLedger(){
  const body=document.querySelector('#course-ledger-body'); if(!body)return;
  body.innerHTML=courseLedger.map(r=>`<tr><th scope="row">${r.subject}</th><td>${r.now}</td><td>${r.week}</td><td>${r.done}</td></tr>`).join('');
}
const rangeStarts = [];
for (let d = new Date('2026-08-31T00:00:00'); d <= new Date('2026-12-14T00:00:00'); d.setDate(d.getDate()+7)) rangeStarts.push(new Date(d));
let currentRangeIndex = 0; let lastAgendaDate = '';
const rangeLabel = (start) => { const end = new Date(start); end.setDate(end.getDate()+6); const fmt = d => `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`; return `${fmt(start)}—${fmt(end)}`; };
const dateKey = d => d.toISOString().slice(0,10);
const dateText = d => `${d.getMonth()+1}月${d.getDate()}日`;
function breakfastFor(d){ const seed = d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); return breakfastMenu[seed % breakfastMenu.length]; }
function datesForRange(index=currentRangeIndex){ const start = rangeStarts[index]; return days.map((_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return d;}); }
function phaseForRange(index=currentRangeIndex){ if(index===0)return 1; if(index===1)return 2; if(index<5)return 3; if(index<13)return 5; return 9; }
const routeData = [
  {dates:'8月31日—9月13日',title:'起床与学习节奏',desc:'完成数学基线、英语阅读起步、436 第一版框架；先把每天能收工做出来。',check:'检查：连续两段按时收工',color:'#5572b8',tint:'#e8eefb'},
  {dates:'9月14日—9月30日',title:'基础推进',desc:'数学高数/线代并行，436 进入框架—回忆—短答，英语保持每周 4–6 篇精读。',check:'检查：错因开始重复',color:'#e46c4e',tint:'#fbe6df'},
  {dates:'10月1日—10月31日',title:'真题入口',desc:'数学加入真题小组，436 开始按题型写答案，政治只做低量启动。',check:'检查：能解释失分',color:'#3b9b94',tint:'#e1f3f0'},
  {dates:'11月1日—11月30日',title:'稳定输出',desc:'每周一次限时组合，补洞优先于扩张；把“会”变成“写得出来”。',check:'检查：时间分配稳定',color:'#d79b46',tint:'#fff0d7'},
  {dates:'12月1日—初试前',title:'冲刺与保温',desc:'政治和英语写作逐步加权，436 做完整模拟；初试日期以教育部和报考点最终通知为准。',check:'检查：不靠熬夜硬撑',color:'#8170b5',tint:'#eeebf5'}
];
function minutes(v){const [h,m]=v.split(':').map(Number);return h*60+m}
function blockStyle(x){const start=minutes(x.start)-360;const height=minutes(x.end)-minutes(x.start);return `top:${45+start}px;height:${Math.max(height,28)}px`}
function progressFor(index, day, type, id=''){
  if(type==='major'){
    const start=index===0?1:1+index*22;
    if(day===6 || /4362|4363$/.test(id))return {label:`旧页复述 · p1–${Math.max(3,start-1)}`,note:'436 · 合书复述，不开新页'};
    const from=start+day*3; return {label:`背诵笔记 p${from}–${from+2}`,note:'436 · 新3页；每页先框架后复述'};
  }
  if(type==='math'){
    const map=index===0?{
      0:['高数诊断：极限/积分','90分钟闭卷，不看答案'],1:['线代第2章 · 剩余课第1节 + 6题','听课最多70分钟；余下时间独立做题'],2:['线代第2章 · 剩余课第2节 + 6题','收完课程；至少留下40分钟做题'],3:['线代第2章 · 48小时回测6题','闭卷60分钟；正确率低于70%再补对应点'],4:['概率 · 方浩第1–2讲 + 6题','1.5×含停顿约68分钟；余下时间做题'],5:['概率 · 方浩第3–4讲 + 6题','听课约90分钟；至少留45分钟做题'],6:['概率 · 方浩第5–6讲 + 周回收','听课约55分钟；重做本周错题']
    } : null;
    if(map && map[day]) return {label:map[day][0],note:map[day][1]};
    return {label:'数学 · 880对应章节/真题小组',note:'先做后看；连续两次同类错误才补课'};
  }
  return null;
}
function datedBlocks(index=currentRangeIndex){
  const dates=datesForRange(index); const phase=phaseForRange(index); const focus=schedules[phase]||[];
  const special=(index===9||index===10)?[course('sat-politics',5,'08:20','11:45','形势与政策','other','本日期段有课')]:[];
  return [...routines,...focus,...special].map(x=>{
    const y={...x}; const d=dates[x.day]; y.date=dateKey(d);
    const progress=progressFor(index,x.day,x.type,x.id);
    if(progress){y.title=progress.label; y.note=progress.note; y.output=x.type==='major' ? (progress.label.includes('旧页')?'能合书说出旧页结构':'3页框架卡 + 闭卷复述记录') : x.output;}
    if(y.id.startsWith('routine-breakfast')){
      const b=breakfastFor(d); y.title=`早餐 · ${b.name}`; y.note=`${b.price} · ${b.source}`;
      y.why='今天这份早餐按日期轮换，尽量做到有蛋白质、有主食、少油，避免空腹和油腻让上午发晕。';
      y.steps=[`预算：${b.price}`,`优先：${b.source}`,`替换：${b.swap}`]; y.output='吃完、带水出门'; y.id=`breakfast-${dateKey(d)}`;
    } else y.id=`${y.id}-${dateKey(d)}`;
    return y;
  });
}
function addVisibleGaps(items,index=currentRangeIndex){const result=[...items];for(let day=0;day<7;day++){const sorted=items.filter(x=>x.day===day).sort((a,b)=>minutes(a.start)-minutes(b.start));let cursor=360;for(const x of sorted){const gap=minutes(x.start)-cursor;if(gap>=15)result.push({id:`rest-${index}-${day}-${cursor}`,day,start:`${String(Math.floor(cursor/60)).padStart(2,'0')}:${String(cursor%60).padStart(2,'0')}`,end:x.start,title:'休息 · 走动/补水',type:'free',note:'不安排学习，恢复一下',why:'这一段明确留给身体和现实，不是没排完。',steps:['离开座位','喝水或走动','到下一格再开始'],output:'恢复注意力'});cursor=Math.max(cursor,minutes(x.end));}const gap=1440-cursor;if(gap>=15)result.push({id:`rest-${index}-${day}-${cursor}`,day,start:`${String(Math.floor(cursor/60)).padStart(2,'0')}:${String(cursor%60).padStart(2,'0')}`,end:'24:00',title:'休息 · 收尾',type:'free',note:'23:30开始洗漱，00:00关灯',why:'最后的时间用来收尾和睡觉准备，不用强行塞新任务。',steps:['整理明天第一件事','收好资料','00:00关灯'],output:'明天更容易开始'});}return result;}
function syncRangeToToday(){const now=new Date();let idx=0;rangeStarts.forEach((d,i)=>{if(now>=d)idx=i;});currentRangeIndex=idx;}
function renderPhaseLine(){const el=document.querySelector('#phase-line');if(!el)return;el.innerHTML=routeData.map((r,i)=>`<article class="phase-card ${i===Math.min(4,Math.floor(currentRangeIndex/3))?'is-current':''}" style="--route:${r.color};--tint:${r.tint}"><span class="phase-date">${r.dates}</span><strong>${r.title}</strong><p>${r.desc}</p><small>${r.check}</small></article>`).join('');}
function displayDate(){const now=new Date();const dates=datesForRange(currentRangeIndex);const start=dates[0];const end=dates[6];if(now<start)return start;if(now>end)return end;return new Date(now.getFullYear(),now.getMonth(),now.getDate());}
function renderDailyAgenda(){const host=document.querySelector('#daily-agenda');if(!host)return;const d=displayDate();lastAgendaDate=dateKey(d);const dates=datesForRange(currentRangeIndex);const dayIndex=Math.max(0,Math.min(6,Math.round((d-dates[0])/86400000)));const data=addVisibleGaps(datedBlocks(currentRangeIndex),currentRangeIndex).filter(x=>x.day===dayIndex).sort((a,b)=>minutes(a.start)-minutes(b.start));host.innerHTML='';const card=document.createElement('article');card.className='day-agenda-card is-today single-day';card.innerHTML=`<header><div><span class="day-name">${days[dayIndex]}</span><strong>${dateText(d)}</strong></div><span class="day-state">实时当天</span></header><div class="agenda-table-head"><span>时间</span><span>今天做什么</span></div><div class="agenda-list">${data.map(x=>`<div class="agenda-item ${x.type}"><time>${x.start}<br /><i>${x.end}</i></time><div><b>${x.title}</b><span>${x.note||''}</span></div></div>`).join('')}</div>`;host.append(card);document.querySelector('#daily-title').textContent=`${days[dayIndex]} · ${dateText(d)} · 当天安排`;document.querySelector('#today-badge').textContent=`${dateText(d)} 自动更新`;renderPhaseLine();}
function renderTimetable(){syncRangeToToday();renderCourseLedger();renderDailyAgenda();document.querySelector('#date-title').textContent='2026年8月31日—初试前';document.querySelector('#top-date').textContent='自动跟随真实日期';document.querySelector('#today-focus').textContent='阶段与每日安排';updateDailyBreakfast();}
function renderMobileDays(){const picker=document.querySelector('#mobile-day-picker');picker.innerHTML=days.map((d,i)=>`<button class="${i===selectedDay?'is-active':''}" data-day="${i}">${d}<small>${dateText(datesForRange()[i])}</small></button>`).join('');picker.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{selectedDay=Number(btn.dataset.day);picker.querySelectorAll('button').forEach(b=>b.classList.toggle('is-active',b===btn));document.querySelectorAll('.day-column').forEach(c=>c.style.display=Number(c.dataset.day)===selectedDay?'block':'none')}));if(innerWidth<=900)document.querySelectorAll('.day-column').forEach(c=>c.style.display=Number(c.dataset.day)===selectedDay?'block':'none')}
function save(){localStorage.setItem(storageKey,JSON.stringify(state))}
function renderRoute(){const el=document.querySelector('#phase-line');if(!el)return;el.innerHTML=routeData.map(r=>`<article class="route-card" style="--route:${r.color};--tint:${r.tint}"><p class="section-kicker">${r.dates}</p><span class="route-number">${r.title}</span><p>${r.desc}</p><span class="route-check">${r.check}</span></article>`).join('')}
// 页面只保留当天课表与阶段路线；复盘不再占一整块屏幕。
function updateDailyBreakfast(){const today=new Date();const b=breakfastFor(today);const el=document.querySelector('#today-meal');if(el)el.textContent=`今天早餐：${b.name} · ${b.price}`;const copy=document.querySelector('#review-breakfast-copy');if(copy)copy.textContent=`${b.name} · ${b.price} · ${b.source}`;}
function updateClock(){const now=new Date();const pad=n=>String(n).padStart(2,'0');const el=document.querySelector('#live-clock');if(el)el.textContent=`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;}
updateClock();setInterval(updateClock,1000);updateDailyBreakfast();setInterval(()=>{const before=currentRangeIndex;updateDailyBreakfast();syncRangeToToday();const next=dateKey(displayDate());if(before!==currentRangeIndex||next!==lastAgendaDate)renderTimetable();},60000);
renderRoute();renderTimetable();






