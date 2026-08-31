const days = ['周一','周二','周三','周四','周五','周六','周日'];
const t = (id,day,start,end,title,type,note,why,steps,output) => ({id,day,start,end,title,type,note,why,steps,output});
const classBlock = (id,day,start,end,title,type='other') => t(id,day,start,end,title,type,'','',[], '');
const mustListen = (id,day,start,end,title) => classBlock(id,day,start,end,title,'fhsu');
const baseClasses = [
  classBlock('mon-report',0,'08:20','09:55','报关实务'),
  mustListen('mon-marketing',0,'10:10','11:45','营销学'),
  mustListen('mon-finance-moved',0,'13:15','14:50','财务管理'),
  mustListen('tue-policy',1,'13:15','14:50','商业政策'),
  classBlock('wed-letter',2,'08:20','09:55','外贸英文函电'),
  mustListen('wed-finance',2,'13:15','14:50','财务管理'),
  mustListen('wed-marketing',2,'15:00','16:35','营销学'),
  classBlock('thu-report',3,'08:20','09:55','报关实务'),
  mustListen('thu-policy',3,'10:10','11:45','商业政策'),
  classBlock('thu-trade-practice',3,'15:00','16:35','国际贸易实务'),
  classBlock('fri-letter',4,'10:10','11:45','外贸英文函电')
];
const returnSlots = [['16:35','17:00'],['16:35','17:00'],['16:35','17:00'],['16:35','17:00'],['15:45','16:05'],['16:40','17:00'],['16:00','16:20']];
const routines = days.flatMap((_,i)=>[
  t(`routine-wake-${i}`,i,'06:00','06:20','起床 · 喝水洗漱','routine','20分钟内一次做完','六点起床后的第一格只负责把人叫醒。',['起床喝水','洗脸刷牙','换衣服'],'06:20前结束'),
  t(`routine-breakfast-${i}`,i,'07:00','07:30','早餐项目','meal','当天自动轮换','早餐按你给的选项轮换，尽量主食、蛋白质都有，少油。',['买早餐','吃完','带水出门'],'吃完、带水出门'),
  t(`routine-leave-${i}`,i,'07:30','07:35','出门检查','routine','钥匙、卡、水、耳机','出门前只检查一次。',['钥匙/校园卡','水和耳机'],'准时出门'),
  t(`routine-commute-${i}`,i,'07:35','07:55','通勤 · 家→学校','routine','20分钟','通勤不塞硬任务。',['出门','到校'],'准时到校'),
  t(`routine-arrive-${i}`,i,'07:55','08:20','到校 · 找座准备','routine','准备当天第一段','到校先把第一段需要的东西摆好。',['找到座位','拿出第一段资料'],'准备完成'),
  t(`routine-break-am-${i}`,i,'11:45','11:50','下课 · 走动5分钟','routine','直接离开教室去吃饭','一下课就走，不留在座位上拖。',['起身','离开教室','去吃饭'],'开始午饭'),
  t(`routine-lunch-${i}`,i,'11:50','12:20','午饭 · 直接去吃','meal','不边吃边学习','先吃饭，吃完再处理下午。',['吃饭','简单走动'],'午饭完成'),
  t(`routine-return-${i}`,i,returnSlots[i][0],returnSlots[i][1],'通勤 · 学校→家','routine','约20分钟','按当天最后一段校内任务收工，不套用同一个离校时间。',['收拾课本','回家'],'到家'),
  t(`routine-dinner-${i}`,i,'17:00','17:40','晚饭 + 放空','meal','给晚上留电量','晚饭后再进入晚间学习。',['吃饭','简单收拾'],'能量回升'),
  t(`routine-evening-reset-${i}`,i,'17:40','18:00','短休 · 洗脸走动','routine','20分钟缓冲','吃完饭先缓一下。',['洗脸/走动','准备资料'],'准备开始'),
  t(`routine-wind-${i}`,i,'23:30','24:00','洗漱 · 00:00 睡','sleep','零点固定收工','23:30开始收尾，00:00关灯。',['收手机','洗漱','关灯'],'00:00 睡')
]);
const study1 = [
  t('w1-mon-880',0,'18:00','20:00','880第一章 · 基础选择1–13','math','13题，先做后看','今天直接开始880：独立做，再按错因回看。',['独立做13题','对答案','只标不会和错因'],'13题结果'),
  t('w1-mon-436',0,'20:15','21:30','436 · p1–3页内全部卡片','major','p1–3；合书复述','按页码明确回收，不虚构卡片编号。',['读p1–3','合书说框架','补缺口'],'p1–3回忆纸'),
  t('w1-mon-eng',0,'21:30','22:15','英语二 · 2015年 Text 1','english','20分钟做题 + 25分钟证据句','第一篇必须标清年份和篇号。',['限时20分钟','逐题找证据','写错因'],'1张阅读卡'),
  t('w1-mon-vocab',0,'22:15','23:20','英语单词 · 新30 + 旧60','english','新词30个，旧词回想60个','数量写死，做不完只顺延旧词，不增加新词。',['新词30','旧词60','圈薄弱10词'],'薄弱词清单'),

  t('w1-tue-line',1,'08:20','10:00','线代第2章 · 剩余课第1节 + 6题','math','课程最多70分钟，余下做题','新知识和对应题一起收。',['1.5倍速听','做6题','标卡点'],'1节+6题'),
  t('w1-tue-436',1,'10:15','11:45','436 · p4–6页内全部卡片','major','新3页 + 合书复述','页码就是今天的明确范围。',['读p4–6','写小标题','合书复述'],'p4–6框架卡'),
  t('w1-tue-880',1,'18:00','20:00','880第一章 · 基础填空1–4 + 基础解答1–2','math','共6题','解答题写完整步骤。',['填空4题','解答2题','对答案'],'6题结果'),
  t('w1-tue-lineproblems',1,'20:00','20:45','线代第2章 · 对应题6道','math','只做今天课程对应题','把新知识当天落到题上。',['做6题','标不会的点'],'6题结果'),
  t('w1-tue-eng',1,'21:00','21:40','英语单词 · 新20 + 旧40','english','40分钟按20新词 + 40旧词','不刷手机，只做回想。',['新词20','旧词40'],'薄弱词'),
  t('w1-tue-436rec',1,'21:40','22:40','436 · p4–6短答2题','major','从p4–6写2个短答骨架','每题只抓结构和关键词。',['短答2题','对照补点'],'2个骨架'),
  t('w1-tue-close',1,'22:40','23:20','收尾 · 线代/436薄弱点','buffer','只整理今天不会的','不再开新视频和新页。',['列3个薄弱点'],'明日入口'),

  t('w1-wed-436',2,'10:10','11:45','436 · p7–9页内全部卡片','major','新3页 + 前页抽查','先抽p4–6，再开p7–9。',['抽查p4–6','读p7–9','合书复述'],'p7–9框架卡'),
  t('w1-wed-line',2,'18:00','19:30','线代第2章 · 剩余课第2节 + 6题','math','今天收完第二章课程','至少留40分钟做题。',['1.5倍速听','做6题','记卡点'],'课程收完+6题'),
  t('w1-wed-880',2,'19:30','21:30','880第一章 · 基础解答3–5 + 综合选择1–5','math','共8题','复习题和新题两手抓。',['解答3题','综合选择5题','对答案'],'8题结果'),
  t('w1-wed-eng',2,'21:30','22:15','英语二 · 2016年 Text 1','english','20分钟做题 + 25分钟复盘','开始观察重复错因。',['限时','证据句','错因'],'1张阅读卡'),
  t('w1-wed-436rec',2,'22:15','22:50','436 · p1–9连续复述','major','卡住再翻，不边看边背','按页码连续说。',['连续复述','补3个缺口'],'缺口清单'),
  t('w1-wed-vocab',2,'22:50','23:20','英语单词 · 新15 + 旧30','english','30分钟按15新词 + 30旧词','只做回想，不再开新阅读。',['新词15','旧词30'],'薄弱词'),

  t('w1-thu-436',3,'12:20','13:50','436 · p10–12 + 计算1题','major','新3页 + 1道计算','公式、条件、步骤一起写。',['读p10–12','做1题','复述'],'3页+1题'),
  t('w1-thu-line-test',3,'18:00','19:30','线代第2章 · 48小时回测6题','math','闭卷60分钟','低于70%才补具体知识点。',['6题计时','核对','标错因'],'正确率'),
  t('w1-thu-880',3,'19:30','21:30','880第一章 · 综合选择6–16 + 综合填空1–4','math','共15题','选择题控时，填空写关键步骤。',['选择11题','填空4题','对答案'],'15题结果'),
  t('w1-thu-eng',3,'21:30','22:15','英语二 · 2017年 Text 1','english','限时 + 证据句','只做一篇完整闭环。',['限时','证据句','错因'],'1张阅读卡'),
  t('w1-thu-preview',3,'22:15','22:50','概率 · 方浩第1讲预习','math','只看入口概念','给明天听课降低启动阻力。',['看目录','写5个概念'],'概率入口卡'),
  t('w1-thu-vocab',3,'22:50','23:20','英语单词 · 新15 + 旧30','english','30分钟按15新词 + 30旧词','只做回想，不再开新阅读。',['新词15','旧词30'],'薄弱词'),

  t('w1-fri-prob',4,'08:20','10:00','概率 · 方浩第1–2讲 + 6题','math','第1讲时长待定位；第2讲原始37:15，1.5倍速+暂停约35分钟','第1讲只先完成听课，时长核对后再补题；不编分钟数。',['听2讲','做6题','记错因'],'2讲+6题'),
  t('w1-fri-hw',4,'12:20','14:00','Blackboard作业 · 周五开放项','homework','只处理已经开放且必须交的','周一到周四不再塞作业。',['看截止时间','先做必须交的','上传确认'],'开放项清单'),
  t('w1-fri-436',4,'14:00','15:45','436 · p13–15 + 短答2题','major','框架和落笔串起来','不是只读3页。',['读p13–15','写2题','复述'],'3页+2题'),
  t('w1-fri-880',4,'18:00','20:30','880第一章 · 综合填空5–8 + 综合解答1–6','math','共10题','解答题按步骤写。',['填空4题','解答6题','对答案'],'10题结果'),
  t('w1-fri-eng',4,'20:30','21:15','英语二 · 2018年 Text 1','english','本周第4篇','完成一篇完整闭环。',['限时','证据句','错因'],'1张阅读卡'),
  t('w1-fri-436rec',4,'21:15','22:30','436 · p1–15连续复述','major','按页码顺序说','断点单列。',['连续复述','补缺口'],'断点清单'),
  t('w1-fri-vocab',4,'22:30','23:20','英语单词 · 新25 + 旧50','english','50分钟按25新词 + 50旧词','轻量收尾。',['新词25','旧词50'],'薄弱词'),

  t('w1-sat-prob',5,'08:20','10:30','概率 · 方浩第3–4讲 + 6题','math','原始1:58:10；1.5倍速+暂停约95分钟','课程约95分钟，余下约35分钟做6题。',['听2讲','做6题','核对'],'2讲+6题'),
  t('w1-sat-436',5,'10:45','11:45','436 · p16–18页内全部卡片','major','新3页','一小时只做输入和复述。',['读p16–18','合书复述'],'p16–18框架卡'),
  t('w1-sat-hw',5,'12:20','14:00','Blackboard作业 · 周六开放项','homework','集中处理开放项','没有新作业就直接休息，不补周一到周四的假任务。',['检查开放项','完成必须交的','上传确认'],'开放项清单'),
  t('w1-sat-eng',5,'14:00','15:00','英语二 · 2019年 Text 1','english','20分钟 + 40分钟复盘','第五篇用于巩固闭环。',['限时','证据句','错因'],'1张阅读卡'),
  t('w1-sat-major2',5,'15:50','16:40','436 · 计算2题','major','完整写步骤','条件、公式、单位都写。',['独立做2题','对照补步骤'],'2题完整过程'),
  t('w1-sat-880',5,'18:00','20:30','880第一章 · 综合解答7–12','math','共6题','难题允许20分钟封顶后看提示。',['解答6题','记录卡点'],'6题结果'),
  t('w1-sat-436rec',5,'20:30','21:45','436 · p1–18闭卷框架','major','把本周内容压成一张纸','先写再看。',['写框架','补缺口'],'一页总框架'),
  t('w1-sat-eng2',5,'21:45','22:30','英语 · 本周5篇错因回看','english','不做新阅读','圈重复错因。',['看5张卡','圈重复错因'],'下周提醒'),
  t('w1-sat-close',5,'22:30','22:50','436卡片 · p1–18薄弱页','major','只抽薄弱页内卡片','睡前不再开新页。',['抽薄弱页','标3个断点'],'薄弱页'),
  t('w1-sat-vocab',5,'22:50','23:20','英语单词 · 新15 + 旧30','english','30分钟按15新词 + 30旧词','只做回想，不开新页。',['新词15','旧词30'],'薄弱词'),

  t('w1-sun-prob',6,'09:00','11:00','概率 · 方浩第5–6讲 + 周回收','math','原始50:28；1.5倍速+暂停约40分钟','课程约40分钟，余下时间重做第1–4讲错题。',['听2讲','重做6题'],'2讲+6题'),
  t('w1-sun-436',6,'11:15','11:45','436 · p1–18名词抽查','major','30分钟闭卷','只查准确度。',['抽10个名词'],'准确率'),
  t('w1-sun-hw',6,'12:20','14:00','Blackboard作业 · 周日最后收口','homework','只处理必须交的','做完就停，不带进周一。',['清掉必须交的','确认上传'],'零欠账'),
  t('w1-sun-major2',6,'14:00','15:00','436 · 计算3 + 短答1','major','按计分步骤写','本周第三个计算单元。',['计算1题','短答1题'],'2题过程'),
  t('w1-sun-eng',6,'15:00','16:00','英语 · 2015–2019 Text 1错因归类','english','词义/句法/定位/逻辑/干扰项','只归类本周五篇。',['归类错因','定下周重点'],'错因统计'),
  t('w1-sun-major3',6,'18:00','19:30','436 · p1–18闭卷复述','major','周末验收','能说出框架才算完成。',['连续复述','标断点'],'完成率'),
  t('w1-sun-880',6,'19:30','20:45','880第一章 · 拓展解答1–2 + 全章错题','math','2道拓展 + 本周错题回做','完成第一章60题口径。',['拓展2题','重做代表错题'],'第一章收口'),
  t('w1-sun-review',6,'21:00','22:00','周复盘 · 只看四个数','buffer','880完成题数/英语篇数/436页数/睡眠','只调整下周一个变量。',['记4个数','改1处'],'下周调整项'),
  t('w1-sun-buffer',6,'22:00','22:50','容错格 · 补最小单元','buffer','只补一个，不清债','全完成就休息。',['补1个最小单元或休息'],'不欠核心任务'),
  t('w1-sun-vocab',6,'22:50','23:20','英语单词 · 新15 + 旧30','english','30分钟按15新词 + 30旧词','只做回想，按时收工。',['新词15','旧词30'],'薄弱词')
];
const week2Math = {
  'w1-mon-880':['880第二章 · 基础选择1–10','10题；先做后看'],
  'w1-tue-line':['线代第2章 · 错题回做8题','只回做第一周的错题'],
  'w1-tue-880':['880第二章 · 基础选择11–17 + 基础填空1–5','共12题'],
  'w1-tue-lineproblems':['概率第1–6讲 · 公式回想 + 4题','给新课做一次短回收'],
  'w1-wed-line':['概率 · 方浩第7–8讲 + 6题','原始69:15；1.5倍速+暂停约55分钟，配套6题'],
  'w1-wed-880':['880第二章 · 基础填空6–15 + 基础解答1–2','共12题'],
  'w1-thu-line-test':['线代第2章 · 7天回测8题','闭卷完成，再补具体错点'],
  'w1-thu-880':['880第二章 · 基础解答3–10','共8题'],
  'w1-thu-preview':['概率 · 方浩第9–10讲预习','只看目录与入口概念'],
  'w1-fri-prob':['概率 · 方浩第9–10讲 + 6题','原始49:42；1.5倍速+暂停约40分钟，配套6题'],
  'w1-fri-880':['880第二章 · 基础解答11–16','共6题'],
  'w1-sat-prob':['概率 · 方浩第11–12讲 + 6题','原始48:03；1.5倍速+暂停约40分钟，配套6题'],
  'w1-sat-880':['880第二章 · 基础解答17–22','共6题'],
  'w1-sun-prob':['概率第7–12讲 · 周回收6题','只回做本周错题'],
  'w1-sun-880':['880第二章 · 基础题错题回做','本周54道基础题收口']
};
const shiftPages = value => typeof value==='string' ? value.replace(/p(\d+)–(\d+)/g,(_,a,b)=>`p${Number(a)+18}–${Number(b)+18}`) : value;
const week2 = study1.map(x => {
  const y={...x,id:x.id.replace('w1-','w2-')};
  if(x.type==='major'){
    y.title=shiftPages(y.title); y.note=shiftPages(y.note); y.why=shiftPages(y.why); y.output=shiftPages(y.output);
    y.steps=(y.steps||[]).map(shiftPages);
  }
  if(x.type==='english'){
    y.title=y.title.replace(/(2015|2016|2017|2018|2019)年 Text 1/g,'$1年 Text 2').replace('2015–2019 Text 1','2015–2019 Text 2');
    y.note=y.note.replace('本周第4篇','本周第4篇 Text 2').replace('第五篇','第五篇 Text 2');
  }
  const math=week2Math[x.id];
  if(math){y.title=math[0];y.note=math[1];}
  return y;
});
// 9月1日起提高强度：把原本能用于学习的长空档改成明确的小单元，只有吃饭、通勤和短暂恢复保留为休息。
// 这些格子只叠加在第二周（9月1日–9月7日），不碰真实课程，也不挤占零点睡眠。
const highIntensityPhase2 = [
  t('w2-mon-morning',0,'06:20','07:00','英语单词 · 新20 + 旧40','english','起床后第一轮回想','先完成回想再吃早餐。',['新词20','旧词40'],'60词回想'),
  t('w2-mon-noon',0,'12:20','13:15','436 · p1–18闭卷框架','major','只写标题和关键词','把第一周内容压成一页，下午不空耗。',['默写框架','补3个缺口'],'一页框架'),
  t('w2-mon-afternoon',0,'14:50','16:35','880第二章 · 基础选择1–10复盘','math','逐题写错因，不开新视频','为晚间刷题先清掉旧错点。',['重做10题','归类错因'],'10题复盘'),
  t('w2-tue-morning',1,'06:20','07:00','436 · p1–18闭卷复述','major','卡住再翻页','早上只做主动回忆，不被动阅读。',['连续复述','标3个断点'],'断点清单'),
  t('w2-tue-noon',1,'12:20','13:15','880第二章 · 基础题错因回收4题','math','下午课前短单元','只回做错题，不开新章节。',['回做4题','写错因'],'4题回收'),
  t('w2-tue-afternoon',1,'14:50','16:35','436 · p19–21框架 + 短答1题','major','按评分点写，不只看答案','把前一周页码转成输出，晚间再做p22–24短答。',['短答2题','对照补点'],'2个短答'),
  t('w2-wed-morning',2,'06:20','07:00','英语单词 · 新20 + 旧40','english','回想优先','完成后再吃早餐。',['新词20','旧词40'],'60词回想'),
  t('w2-wed-noon',2,'12:20','13:15','436 · p19–27框架回忆','major','不翻书先写结构','承接上午页码，保持连续记忆。',['写框架','补缺口'],'框架卡'),
  t('w2-thu-morning',3,'06:20','07:00','880第二章 · 基础选择错题4题','math','闭卷做再核对','早上用来抓数学薄弱点。',['闭卷4题','标错因'],'4题结果'),
  t('w2-thu-midday',3,'13:50','15:00','436 · p28–30页内卡片','major','新3页 + 合书复述','下午空档不留白，按页推进。',['读p28–30','合书复述'],'3页框架卡'),
  t('w2-fri-morning',4,'06:20','07:00','英语单词 · 新25 + 旧50','english','回想优先','周五仍保持固定词量。',['新词25','旧词50'],'75词回想'),
  t('w2-fri-afternoon',4,'16:05','16:55','880第二章 · 基础错题4题','math','只补今天暴露的错因','晚饭前完成一个闭环。',['重做4题','写错因'],'4题回收'),
  t('w2-sat-morning',5,'06:20','07:00','436 · p19–27闭卷复述','major','先回忆再翻页','不把早起时间变成刷手机。',['连续复述','标断点'],'断点清单'),
  t('w2-sat-late',5,'15:00','15:45','英语单词 · 薄弱词20','english','只看当天错词','晚饭前做轻量收口。',['回想20词'],'薄弱词'),
  t('w2-sun-morning',6,'06:20','07:00','880第二章 · 基础题错题4题','math','闭卷回做','周日先做数学，再开始周回收。',['回做4题','写错因'],'4题结果'),
  t('w2-sun-prep',6,'08:20','09:00','436 · p19–36框架复述','major','周回收前先主动输出','把第二周新增页码串起来。',['写总框架','标断点'],'总框架卡')
];
const phaseBlocks = [
  t('w3-mon-math',0,'18:00','20:00','数学 · 章节推进','math','基础题 + 1 道变式','从第一周的基线进入稳定推进。',['完成一小节例题','做 8 道基础题','把重复错因加粗'],'章节清单 + 错因'),
  t('w3-tue-436',1,'10:15','11:45','436 · 主题短答','major','定义→解释→例子','开始按题型输出，不只认关键词。',['抽 2 个主题','每题 12 分钟作答','对照评分点补漏'],'2 个短答'),
  t('w3-wed-eng',2,'18:45','20:15','英语 · 两篇对照','english','看证据链','把阅读速度和证据质量放在一起看。',['一篇限时','一篇精读','记录时间差'],'两篇错因'),
  t('w3-thu-math',3,'18:00','20:00','数学 · 线代主线','math','概念+题型','线代不再被挤到最后，保持每周可见。',['复习概念','做 8 道基础题','写出一页公式关系'],'一页线代图'),
  t('w3-fri-436',4,'13:45','15:45','436 · 计算题步骤','major','完整书写','训练“会做”到“按步骤拿分”。',['独立完成 3 题','逐步核对','标注丢分点'],'3 题过程'),
  t('w3-sat-politics',5,'14:00','15:00','政治 · 低量启动','politics','只建立目录','先认地图，不在第一周就背满。',['看章节目录','记 5 个关键词','写下暂时不懂的点'],'目录卡'),
  t('w3-sun-mock',6,'09:00','11:30','周测 · 数学+436','buffer','组合小测','用小测决定下周加哪一科，不用一次成绩定义自己。',['数学 90 分钟','436 30 分钟','整理失分原因'],'组合小测记录')
];
const schedules = {1:[...baseClasses,...study1],2:[...baseClasses,...week2,...highIntensityPhase2],3:[...baseClasses,...phaseBlocks],5:[...baseClasses,...phaseBlocks.map(x=>({...x,id:x.id.replace('w3-','w5-'),title:x.title.replace('推进','真题组').replace('主题短答','题型压缩').replace('两篇对照','真题精读').replace('线代主线','真题线代').replace('计算题步骤','计分点训练').replace('低量启动','选择题启动').replace('组合小测','限时组合')}))]};
const breakfastMenu = [
  {name:'肉夹馍（少肥少酱） + 无糖豆浆',price:'约 8–12 元',source:'校门店/外卖',swap:'觉得油就换半个肉夹馍，加茶叶蛋'},
  {name:'绿豆粥 + 茶叶蛋 + 素菜包',price:'约 6–9 元',source:'食堂窗口优先',swap:'甜粥换无糖小米粥'},
  {name:'小米粥 + 鸡蛋 + 包子',price:'约 5–8 元',source:'食堂窗口优先',swap:'包子太油就换馒头'},
  {name:'无糖豆浆 + 素菜包 + 茶叶蛋',price:'约 5–8 元',source:'食堂窗口优先',swap:'豆浆售罄就换纯牛奶'},
  {name:'八宝粥（少糖） + 白煮蛋 + 小馒头',price:'约 6–9 元',source:'食堂窗口优先',swap:'八宝粥太甜就换绿豆粥'},
  {name:'玉米 + 无糖酸奶 + 茶叶蛋',price:'约 8–11 元',source:'便利店/外卖',swap:'酸奶换纯牛奶'},
  {name:'豆腐脑（少油） + 鸡蛋 + 馒头',price:'约 6–9 元',source:'食堂窗口优先',swap:'不加辣油'},
  {name:'燕麦牛奶 + 香蕉 + 茶叶蛋',price:'约 7–10 元',source:'便利店/外卖',swap:'牛奶换无糖豆浆'}
];
// 夸克桌面端逐条核对到的方浩概率课时长（原始播放时长）。
// 29、30讲文件名明确标注“数一”，数学三不排这两讲；第1讲当前未从播放列表定位到，保持未验证。
const probabilityRawDurations = {
  2:'37:15',3:'1:00:22',4:'57:48',5:'35:04',6:'15:24',7:'34:23',8:'34:52',9:'28:08',10:'21:34',
  11:'22:10',12:'25:53',13:'18:18',14:'22:19',15:'59:48',16:'34:30',17:'46:34',18:'45:34',19:'25:13',
  20:'04:07',21:'14:00',22:'20:24',23:'14:29',24:'06:18',25:'34:00',26:'37:36',27:'30:02',28:'1:00:49',
  29:'03:44',30:'25:17'
};
const probabilityMathScope = {29:'数一',30:'数一'};
const lineAlgebraVerifiedDurations = {
  '2.3':'44:20','2.4':'33:43','2.5':'30:47','2.6':'39:51','2.7':'1:03:17','2.8':'57:08','2.9':'51:18','2.10(1)':'54:02','2.10(2)':'51:06'
};
const durationSeconds = raw => {
  const p=String(raw).split(':').map(Number);
  return p.length===3 ? p[0]*3600+p[1]*60+p[2] : p[0]*60+p[1];
};
const formatClockDuration = seconds => {
  const total=Math.round(seconds), h=Math.floor(total/3600), m=Math.floor((total%3600)/60), s=total%60;
  return h ? `${h}小时${String(m).padStart(2,'0')}分` : `${m}分${String(s).padStart(2,'0')}秒`;
};
// 1.5倍速并不等于1/1.5的机械切片：按约15%暂停、回看和记笔记余量排入课表，向上取整到5分钟。
const plannedLectureMinutes = (start,end) => Math.ceil((Object.keys(probabilityRawDurations).filter(k=>Number(k)>=start&&Number(k)<=end).reduce((sum,k)=>sum+durationSeconds(probabilityRawDurations[k]),0)/1.5*1.15)/300)*5;
const probabilityWindow = (start,end) => {
  const keys=Object.keys(probabilityRawDurations).filter(k=>Number(k)>=start&&Number(k)<=end).map(Number);
  const raw=keys.reduce((sum,k)=>sum+durationSeconds(probabilityRawDurations[k]),0);
  const excluded=keys.filter(k=>probabilityMathScope[k]);
  return `原始${formatClockDuration(raw)} · 1.5倍速+暂停约${plannedLectureMinutes(start,end)}分钟${excluded.length?` · 排除${excluded.join('、')}讲（${excluded.map(k=>probabilityMathScope[k]).join('、')}）`:''}`;
};
// 880第一章题量按当前可查的2027数学三讲解目录口径：基础22 + 综合36 + 拓展2 = 60题；不同印次以用户手中试题册为准。
const courseLedger = [
  {subject:'高数 · 李林880',now:'第一章函数、极限、连续；目录口径60题',week:'周一到周日依次完成13/6/8/15/10/6/2题',done:'当天独立做完并标错因；周日回做代表错题'},
  {subject:'线代 · 没咋了',now:'第二章只剩 2 节课；播放列表已核对到 2.3–2.10 时长',duration:`可查原始时长：${Object.entries(lineAlgebraVerifiedDurations).map(([k,v])=>`${k} ${v}`).join('、')}；剩余两节编号以你当前夸克勾选为准`,week:'周二、周三各收 1 节；周四做 6 题闭卷回测',done:'课听完 + 当天对应题 + 48小时回测'},
  {subject:'概率 · 方浩',now:'基础班 30 讲；第2–28讲已核对原始时长，29–30为数一不排',duration:`第7–8讲 ${probabilityWindow(7,8)}；第9–10讲 ${probabilityWindow(9,10)}；第11–12讲 ${probabilityWindow(11,12)}`,week:'周五先处理第1–2讲（第1讲时长待定位）；周六第3–4讲；周日第5–6讲；第二周起按7–8、9–10、11–12讲推进',done:'每两讲至少 6 道基础题；听课时间按1.5倍速并留暂停余量'},
  {subject:'436 · 背诵笔记',now:'168页；本周 p1–18',week:'周一至周六每天新3页；周日只回收；页内定义/公式卡片全部过',done:'能合书说出页内框架；每周3个计算题单元'},
  {subject:'英语二 · 真题',now:'阅读量少，先做精读闭环',week:'2015–2019年各做 Text 1；单词每日写死数量，共新135+旧270',done:'每篇留1张错因卡；当天单词按格内数量收工'}
];
function renderCourseLedger(){
  const body=document.querySelector('#course-ledger-body'); if(!body)return;
  body.innerHTML=courseLedger.map(r=>`<tr><th scope="row">${r.subject}</th><td>${r.now}</td><td>${r.duration||'—'}</td><td>${r.week}</td><td>${r.done}</td></tr>`).join('');
}
function renderDurationIndex(){
  const el=document.querySelector('#duration-index'); if(!el)return;
  const entries=Object.entries(probabilityRawDurations).map(([lecture,raw])=>`<span class="duration-chip ${probabilityMathScope[lecture]?'excluded':''}">第${lecture}讲 ${raw}${probabilityMathScope[lecture]?` · ${probabilityMathScope[lecture]}不排`:''}</span>`).join('');
  el.innerHTML=`<div class="duration-index-heading"><b>方浩概率 · 夸克原始时长索引</b><span>第2–28讲已核对；第1讲待定位</span></div><div class="duration-chip-list">${entries}</div>`;
}
const rangeStarts = [];
for (let d = new Date('2026-08-31T00:00:00'); d <= new Date('2026-12-14T00:00:00'); d.setDate(d.getDate()+7)) rangeStarts.push(new Date(d));
let currentRangeIndex = 0; let lastAgendaDate = '';
const rangeLabel = (start) => { const end = new Date(start); end.setDate(end.getDate()+6); const fmt = d => `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`; return `${fmt(start)}—${fmt(end)}`; };
const dateKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const dateText = d => `${d.getMonth()+1}月${d.getDate()}日`;
function breakfastFor(d){ const seed = d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); return breakfastMenu[seed % breakfastMenu.length]; }
function datesForRange(index=currentRangeIndex){ const start = rangeStarts[index]; return days.map((_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return d;}); }
function phaseForRange(index=currentRangeIndex){ if(index===0)return 1; if(index===1)return 2; if(index<5)return 3; if(index<13)return 5; return 9; }
const routeData = [
  {dates:'8月31日—9月13日',title:'基础破局',desc:'第一周完成880第一章60题、线代第二章收尾；第二周推进880第二章基础54题。英语做Text 1/2，436推进到p36。',check:'检查：课程、刷题、回忆都留下结果',color:'#5572b8',tint:'#e8eefb'},
  {dates:'9月14日—9月30日',title:'基础推进',desc:'数学高数/线代并行，436 进入框架—回忆—短答，英语保持每周 4–6 篇精读。',check:'检查：错因开始重复',color:'#e46c4e',tint:'#fbe6df'},
  {dates:'10月1日—10月31日',title:'真题入口',desc:'数学加入真题小组，436 开始按题型写答案，政治只做低量启动。',check:'检查：能解释失分',color:'#3b9b94',tint:'#e1f3f0'},
  {dates:'11月1日—11月30日',title:'稳定输出',desc:'每周一次限时组合，补洞优先于扩张；把“会”变成“写得出来”。',check:'检查：时间分配稳定',color:'#d79b46',tint:'#fff0d7'},
  {dates:'12月1日—初试前',title:'冲刺与保温',desc:'政治和英语写作逐步加权，436 做完整模拟；初试日期以教育部和报考点最终通知为准。',check:'检查：不靠熬夜硬撑',color:'#8170b5',tint:'#eeebf5'}
];
function minutes(v){const [h,m]=v.split(':').map(Number);return h*60+m}
function progressFor(index, day, type, id=''){
  const key=id.replace(/^w2-/,'w1-');
  if(type==='major'){
    const firstWeek={
      'w1-mon-436':['436 · p1–3页内全部卡片','p1–3；合书复述'],
      'w1-tue-436':['436 · p4–6页内全部卡片','p4–6；合书复述'],
      'w1-wed-436':['436 · p7–9页内全部卡片','p7–9；合书复述'],
      'w1-thu-436':['436 · p10–12 + 计算1题','p10–12；合书复述'],
      'w1-fri-436':['436 · p13–15 + 短答2题','p13–15；写完再复述'],
      'w1-sat-436':['436 · p16–18页内全部卡片','p16–18；合书复述']
    };
    if(index===0 && firstWeek[key])return {label:firstWeek[key][0],note:firstWeek[key][1]};
    if(index<2)return null;
    const start=1+index*22;
    if(day===6 || /4362|4363$/.test(id))return {label:`旧页复述 · p1–${Math.max(3,start-1)}`,note:'436 · 合书复述，不开新页'};
    const from=start+day*3;return {label:`背诵笔记 p${from}–${from+2}`,note:'436 · 新3页；每页先框架后复述'};
  }
  if(type==='math'){
    const firstWeek={
      'w1-mon-880':['880第一章 · 基础选择1–13','13题；先做后看'],
      'w1-tue-line':['线代第2章 · 剩余课第1节 + 6题','课程最多70分钟；余下做题'],
      'w1-tue-880':['880第一章 · 基础填空1–4 + 基础解答1–2','共6题'],
      'w1-tue-lineproblems':['线代第2章 · 对应题6道','只做今天课程对应题'],
      'w1-wed-line':['线代第2章 · 剩余课第2节 + 6题','今天收完第二章课程'],
      'w1-wed-880':['880第一章 · 基础解答3–5 + 综合选择1–5','共8题'],
      'w1-thu-line-test':['线代第2章 · 48小时回测6题','闭卷60分钟'],
      'w1-thu-880':['880第一章 · 综合选择6–16 + 综合填空1–4','共15题'],
      'w1-thu-preview':['概率 · 方浩第1讲预习','只看入口概念'],
      'w1-fri-prob':['概率 · 方浩第1–2讲 + 6题','第1讲时长待定位；第2讲原始37:15，先听课再补题'],
      'w1-fri-880':['880第一章 · 综合填空5–8 + 综合解答1–6','共10题'],
      'w1-sat-prob':['概率 · 方浩第3–4讲 + 6题','原始1:58:10；1.5倍速+暂停约95分钟'],
      'w1-sat-880':['880第一章 · 综合解答7–12','共6题'],
      'w1-sun-prob':['概率 · 方浩第5–6讲 + 周回收','原始50:28；1.5倍速+暂停约40分钟'],
      'w1-sun-880':['880第一章 · 拓展解答1–2 + 全章错题','2道拓展 + 本周错题']
    };
    if(index===0 && firstWeek[key])return {label:firstWeek[key][0],note:firstWeek[key][1]};
    if(index<2)return null;
    return {label:'数学 · 880对应章节/真题小组',note:'先做后看；连续两次同类错误才补课'};
  }
  return null;
}
function datedBlocks(index=currentRangeIndex){
  const dates=datesForRange(index); const phase=phaseForRange(index); const focus=schedules[phase]||[];
  const special=(index===9||index===10)?[classBlock('sat-politics',5,'08:20','11:45','形势与政策4')]:[];
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
function buildDayAgenda(items,index,day){const result=[...items];const sorted=[...items].sort((a,b)=>minutes(a.start)-minutes(b.start));let cursor=360;for(const x of sorted){const gap=minutes(x.start)-cursor;if(gap>=10)result.push({id:`rest-${index}-${day}-${cursor}`,day,start:`${String(Math.floor(cursor/60)).padStart(2,'0')}:${String(cursor%60).padStart(2,'0')}`,end:x.start,title:'休息 · 走动/补水',type:'free',note:'不安排学习，恢复一下',why:'这一段明确留给身体和现实，不是没排完。',steps:['离开座位','喝水或走动','到下一格再开始'],output:'恢复注意力'});cursor=Math.max(cursor,minutes(x.end));}const gap=1440-cursor;if(gap>=10)result.push({id:`rest-${index}-${day}-${cursor}`,day,start:`${String(Math.floor(cursor/60)).padStart(2,'0')}:${String(cursor%60).padStart(2,'0')}`,end:'24:00',title:'休息 · 收尾',type:'free',note:'23:30开始洗漱，00:00关灯',why:'最后的时间用来收尾和睡觉准备，不用强行塞新任务。',steps:['整理明天第一件事','收好资料','00:00关灯'],output:'明天更容易开始'});return result.sort((a,b)=>minutes(a.start)-minutes(b.start));}
function syncRangeToToday(){const now=new Date();let idx=0;rangeStarts.forEach((d,i)=>{if(now>=d)idx=i;});currentRangeIndex=idx;}
function renderPhaseLine(){const el=document.querySelector('#phase-line');if(!el)return;el.innerHTML=routeData.map((r,i)=>`<article class="phase-card ${i===Math.min(4,Math.floor(currentRangeIndex/3))?'is-current':''}" style="--route:${r.color};--tint:${r.tint}"><span class="phase-date">${r.dates}</span><strong>${r.title}</strong><p>${r.desc}</p><small>${r.check}</small></article>`).join('');}
function displayDate(){const now=new Date();const dates=datesForRange(currentRangeIndex);const start=dates[0];const end=dates[6];if(now<start)return start;if(now>end)return end;return new Date(now.getFullYear(),now.getMonth(),now.getDate());}
function renderDailyAgenda(){const host=document.querySelector('#daily-agenda');if(!host)return;const d=displayDate();lastAgendaDate=dateKey(d);const dates=datesForRange(currentRangeIndex);const dayIndex=Math.max(0,Math.min(6,Math.round((d-dates[0])/86400000)));const dayBlocks=datedBlocks(currentRangeIndex).filter(x=>x.day===dayIndex);const data=buildDayAgenda(dayBlocks,currentRangeIndex,dayIndex);host.innerHTML='';const card=document.createElement('article');card.className='day-agenda-card is-today single-day';card.innerHTML=`<header><div><span class="day-name">${days[dayIndex]}</span><strong>${dateText(d)}</strong></div><span class="day-state">实时当天</span></header><div class="agenda-table-head"><span>时间</span><span>今天做什么</span></div><div class="agenda-list">${data.map(x=>`<div class="agenda-item ${x.type}"><time>${x.start}<br /><i>${x.end}</i></time><div><b>${x.title}</b><span>${x.note||''}</span></div></div>`).join('')}</div>`;host.append(card);document.querySelector('#daily-title').textContent=`${days[dayIndex]} · ${dateText(d)} · 当天安排`;document.querySelector('#today-badge').textContent=`${dateText(d)} 自动更新`;renderPhaseLine();}
function renderTimetable(){syncRangeToToday();renderDailyAgenda();document.querySelector('#date-title').textContent='2026年8月31日—初试前';document.querySelector('#top-date').textContent='自动跟随真实日期';document.querySelector('#today-focus').textContent='阶段与每日安排';updateDailyBreakfast();}
// 页面只保留当天课表与阶段路线；复盘不再占一整块屏幕。
function updateDailyBreakfast(){const today=new Date();const b=breakfastFor(today);const el=document.querySelector('#today-meal');if(el)el.textContent=`今天早餐：${b.name} · ${b.price}`;const copy=document.querySelector('#review-breakfast-copy');if(copy)copy.textContent=`${b.name} · ${b.price} · ${b.source}`;}
function updateClock(){const now=new Date();const pad=n=>String(n).padStart(2,'0');const el=document.querySelector('#live-clock');if(el)el.textContent=`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;}
function syncDailyState(){const before=currentRangeIndex;updateDailyBreakfast();syncRangeToToday();const next=dateKey(displayDate());if(before!==currentRangeIndex||next!==lastAgendaDate)renderTimetable();}
let clockTimer=0;let dailyTimer=0;
function scheduleClock(){clearTimeout(clockTimer);if(document.hidden)return;updateClock();const delay=Math.max(100,1020-(Date.now()%1000));clockTimer=setTimeout(scheduleClock,delay);}
function stopLiveUpdates(){clearTimeout(clockTimer);clearInterval(dailyTimer);clockTimer=0;dailyTimer=0;}
function startLiveUpdates(){stopLiveUpdates();if(document.hidden)return;scheduleClock();dailyTimer=setInterval(syncDailyState,60000);}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopLiveUpdates();else{syncDailyState();startLiveUpdates();}});
renderTimetable();startLiveUpdates();





