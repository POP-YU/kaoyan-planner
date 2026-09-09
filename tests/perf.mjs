import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const js = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const ids = ['course-ledger-body','daily-agenda','daily-title','today-badge','date-title','date-subtitle','top-date','today-focus','today-meal','phase-line','show-today','show-tomorrow'];
const nodeListeners = new Map();
let agendaCard=null;
const makeStyle=()=>{const values=new Map();return {setProperty(k,v){values.set(k,v);},removeProperty(k){values.delete(k);},getPropertyValue(k){return values.get(k)||'';}};};
const nodes = new Map(ids.map((id) => [id, {
  innerHTML: '', textContent: '', clientWidth:id==='daily-agenda'?390:0,
  append(value) { if(id==='daily-agenda')agendaCard=value; }, setAttribute() {},
  querySelector(selector){return id==='daily-agenda'&&selector==='.day-agenda-card'?agendaCard:null;},
  setPointerCapture(){},releasePointerCapture(){},
  classList: { toggle() {},add(){},remove(){} }, style:makeStyle(),
  addEventListener(type, callback) {
    const listeners=nodeListeners.get(id) ?? new Map();listeners.set(type,callback);nodeListeners.set(id,listeners);
  }
}]));
const listeners = new Map();
const timers = { timeouts: [], intervals: [], clearedTimeouts: [], clearedIntervals: [] };
const document = {
  hidden: false,
  querySelector(selector) { return nodes.get(selector.slice(1)) ?? null; },
  querySelectorAll() { return []; },
  createElement() { return { className: '', innerHTML: '', append() {},classList:{add(){},remove(){}},style:makeStyle()}; },
  addEventListener(type, callback) { listeners.set(type, callback); },
};
const context = {
  document,
  console,
  setTimeout(callback, delay) { const id = timers.timeouts.length + 1; timers.timeouts.push({ id, callback, delay }); return id; },
  clearTimeout(id) { timers.clearedTimeouts.push(id); },
  setInterval(callback, delay) { const id = timers.intervals.length + 1; timers.intervals.push({ id, callback, delay }); return id; },
  clearInterval(id) { timers.clearedIntervals.push(id); },
};
vm.runInNewContext(js, context, { filename: 'app.js' });
if (timers.timeouts.length !== 1 || timers.intervals.length !== 1) throw new Error('visible page should use one aligned clock timer and one daily sync timer');
const agendaListeners=nodeListeners.get('daily-agenda');
if (!agendaListeners?.get('pointerdown') || !agendaListeners?.get('pointermove') || !agendaListeners?.get('pointerup') || !agendaListeners?.get('pointercancel')) throw new Error('drag-following agenda swipe listeners missing');
agendaListeners.get('pointerdown')({pointerType:'touch',pointerId:1,clientX:20,clientY:20});
agendaListeners.get('pointermove')({pointerType:'touch',pointerId:1,clientX:100,clientY:22,preventDefault(){}});
if (Number.parseFloat(agendaCard.style.getPropertyValue('--swipe-x')) <= 0) throw new Error('right swipe must move the card right with the finger');
agendaListeners.get('pointerup')({pointerType:'touch',pointerId:1,clientX:100,clientY:22});
if (!nodes.get('daily-title').textContent.includes('明天安排')) throw new Error('right swipe must advance the agenda to tomorrow');
agendaListeners.get('pointerdown')({pointerType:'touch',pointerId:2,clientX:100,clientY:20});
agendaListeners.get('pointermove')({pointerType:'touch',pointerId:2,clientX:20,clientY:22,preventDefault(){}});
if (Number.parseFloat(agendaCard.style.getPropertyValue('--swipe-x')) >= 0) throw new Error('left swipe must move the tomorrow card left with the finger');
agendaListeners.get('pointerup')({pointerType:'touch',pointerId:2,clientX:20,clientY:22});
if (!nodes.get('daily-title').textContent.includes('今天安排')) throw new Error('left swipe must return the agenda to today');
agendaListeners.get('pointerdown')({pointerType:'touch',pointerId:3,clientX:100,clientY:20});
agendaListeners.get('pointermove')({pointerType:'touch',pointerId:3,clientX:20,clientY:21,preventDefault(){}});
agendaListeners.get('pointerup')({pointerType:'touch',pointerId:3,clientX:20,clientY:21});
if (!nodes.get('daily-title').textContent.includes('今天安排')) throw new Error('left swipe from today must not open tomorrow');
if (timers.timeouts[0].delay < 100 || timers.timeouts[0].delay > 1020) throw new Error('clock timer is not aligned to the next second');
const visibility = listeners.get('visibilitychange');
if (!visibility) throw new Error('visibilitychange handler missing');
document.hidden = true;
visibility();
if (!timers.clearedTimeouts.includes(1) || !timers.clearedIntervals.includes(1)) throw new Error('hidden page should stop live timers');
document.hidden = false;
visibility();
if (timers.intervals.length !== 2 || timers.timeouts.at(-1).delay < 100 || timers.timeouts.at(-1).delay > 1020) throw new Error('visible page should restart live timers');
console.log('PERF_RUNTIME_OK visible=1 hidden=1 restart=1');

