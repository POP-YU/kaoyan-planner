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
vm.runInNewContext(`${source}\n;globalThis.__plannerTest={baseClasses,routines,study1,week2,phaseBlocks,schedules};`, context, {filename:'app.js'});
const {baseClasses,routines,study1,week2,schedules} = context.__plannerTest;
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
if (!study1.some(x => x.id==='w1-mon-880' && x.title.includes('基础选择1–13'))) throw new Error('Monday 880 range missing');
if (!study1.some(x => x.id==='w1-mon-eng' && x.title.includes('2015年 Text 1'))) throw new Error('exact English reading missing');
if (!study1.some(x => x.id==='w1-mon-436' && x.title.includes('p1–3'))) throw new Error('exact 436 page range missing');
if (!study1.some(x => x.id==='w1-mon-vocab' && x.title.includes('新30 + 旧60'))) throw new Error('vocabulary quantity missing');
const vocabDays = study1.filter(x => x.title.includes('英语单词')).map(x => x.day).sort();
if (vocabDays.join(',') !== '0,1,2,3,4,5,6') throw new Error(`every day needs an exact vocabulary block, got ${vocabDays}`);
if (!week2.some(x => x.id==='w2-mon-880' && x.title.includes('第二章'))) throw new Error('week 2 must progress instead of copying week 1');
if (!week2.some(x => x.id==='w2-mon-436' && x.title.includes('p19–21'))) throw new Error('week 2 436 pages must progress');
if (!week2.some(x => x.id==='w2-mon-eng' && x.title.includes('2015年 Text 2'))) throw new Error('week 2 English reading must progress');

for (const phase of [1,2,3,5]) {
  for (let day=0; day<7; day++) {
    const rows = [...routines,...schedules[phase]].filter(x => x.day===day).sort((a,b)=>minutes(a.start)-minutes(b.start));
    for (let i=1;i<rows.length;i++) {
      if (minutes(rows[i].start) < minutes(rows[i-1].end)) throw new Error(`overlap phase=${phase} day=${day}: ${rows[i-1].title} / ${rows[i].title}`);
    }
  }
}
console.log(`SCHEDULE_OK courses=${baseClasses.length} week1=${study1.length} week2=${week2.length}`);

