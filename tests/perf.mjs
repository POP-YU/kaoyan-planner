import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const js = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const ids = ['course-ledger-body','daily-agenda','daily-title','today-badge','date-title','top-date','today-focus','today-meal','phase-line'];
const nodes = new Map(ids.map((id) => [id, { innerHTML: '', textContent: '', append() {} }]));
const listeners = new Map();
const timers = { timeouts: [], intervals: [], clearedTimeouts: [], clearedIntervals: [] };
const document = {
  hidden: false,
  querySelector(selector) { return nodes.get(selector.slice(1)) ?? null; },
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

