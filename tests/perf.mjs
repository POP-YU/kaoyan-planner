import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const js = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const ids = ['course-ledger-body','daily-agenda','daily-title','today-badge','date-title','date-subtitle','top-date','today-focus','today-meal','phase-line','show-today','show-tomorrow'];
const nodeListeners = new Map();
const nodes = new Map(ids.map((id) => [id, {
  innerHTML: '', textContent: '',
  append() {}, setAttribute() {},
  classList: { toggle() {} },
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
  createElement() { return { className: '', innerHTML: '', append() {} }; },
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
if (!agendaListeners?.get('pointerdown') || !agendaListeners?.get('pointerup')) throw new Error('daily agenda swipe listeners missing');
agendaListeners.get('pointerdown')({pointerType:'touch',clientX:20,clientY:20});
agendaListeners.get('pointerup')({pointerType:'touch',clientX:100,clientY:22});
if (!nodes.get('daily-title').textContent.includes('明天安排')) throw new Error('right swipe must advance the agenda to tomorrow');
agendaListeners.get('pointerdown')({pointerType:'touch',clientX:100,clientY:20});
agendaListeners.get('pointerup')({pointerType:'touch',clientX:20,clientY:22});
if (!nodes.get('daily-title').textContent.includes('今天安排')) throw new Error('left swipe must return the agenda to today');
if (timers.timeouts[0].delay < 100 || timers.timeouts[0].delay > 1020) throw new Error('clock timer is not aligned to the next second');
const visibility = listeners.get('visibilitychange');
if (!visibility) throw new Error('visibilitychange handler missing');
document.hidden = true;
visibility();
if (!timers.clearedTimeouts.includes(1) || !timers.clearedIntervals.includes(1)) throw new Error('hidden page should stop live timers');
document.hidden = false;
visibility();
if (timers.timeouts.length !== 2 || timers.intervals.length !== 2) throw new Error('visible page should restart live timers');
console.log('PERF_RUNTIME_OK visible=1 hidden=1 restart=1');

