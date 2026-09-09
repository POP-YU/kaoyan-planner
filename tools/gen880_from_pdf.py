# -*- coding: utf-8 -*-
"""2027考研《李林880》(数三) 带刷执行计划生成器
题单来源: 带刷计划表(通用版)三层划分, 已与做题本逐章核对题号范围
"""
import datetime as dt
import re
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

def R(*ns):
    out = []
    for x in ns:
        if isinstance(x, tuple): out += list(range(x[0], x[1] + 1))
        else: out.append(x)
    return out

# (章号, 篇, 章名, 必做题, 选择做, 特难题)  题型键: 基选/基填/基解/综选/综填/综解/拓展
CH = [
 (1,'高数','函数、极限、连续',
   {'基选':[8,12,13],'基填':[3,4],'基解':[1,2,4],'综选':[1,2,3,5,6,7,8,9,11,12,13,14,15,16],'综填':R((1,8)),'综解':[1,2,5,6,7,8,10,11]},
   {'综选':[10],'综解':[3,9,12],'拓展':[1]},
   {'拓展':[2]}),
 (2,'高数','一元函数微分学',
   {'基选':[10,12,13,15,17],'基填':[2,3,6,8,10,11,12,15],'基解':[1,2,3,5,6,8,9,12,17,18,19],'综选':[1,2,3,5,6,7,8,9,10,11,12,13,14,16,19,20,21,24],'综填':[1,2,3,4,5,7],'综解':[2,3,4,6,7,8,10,11]},
   {'基解':[11,12,14,15],'综选':[17,22,23],'综填':[6],'拓展':[1]},
   {'综选':[18],'综解':[13,14],'拓展':[2,3]}),
 (3,'高数','一元函数积分学',
   {'基选':[3,8,9,13,14],'基填':[1,2,6,7,8,9,10,12,14,15],'基解':[1,2,3,4,5,6,7,8,9,10,11,12,13,15],'综选':[1,2,3,4,5,6,7,8,10,11,13,14,15,16,18],'综填':[1,2,3,5,6,7,8,9,10,12,13,14,15],'综解':[1,2,3,4,5,6,8,9,11,12,13,14,15,16,17,18,19,22,23,24,25,26,27,30,31,32,33,34,35]},
   {'综解':[20,21],'拓展':[1]},
   {'综解':[36,37],'拓展':[3,4,5]}),
 (4,'高数','多元函数微分学',
   {'基选':[3,4,5,7],'基填':[2,4,11,12],'基解':[1,2,3,8,9,10],'综选':R((1,8)),'综填':[1,2,3],'综解':[1,2,3,5,6,7,8,9,10,11,12,14,16,17,18]},
   {'综解':[13,15],'拓展':[1,2]}, {}),
 (5,'高数','二重积分',
   {'基填':[3,4,5,6,8,9],'基解':[1,2,3,5,6,8,9,10,12],'综选':[1,2,3,4,6,7],'综填':[1,2,3,5],'综解':[4,5,6,7,8,9,10,11,13,14,15,16,17,19,20,21],'拓展':[1,2]},
   {'综解':[1,2,3,23]},
   {'综解':[22],'拓展':[3]}),
 (6,'高数','微分方程',
   {'基选':[1,4,5,7],'基填':[1,3,5,6],'基解':[2,4,5,6,7,8,9],'综选':[3,5,6,7],'综填':[1,3,4,5,7,8,9,10],'综解':[1,2,3,4,5,6,7,8,9,12]},
   {'综解':[10,11]}, {}),
 (7,'高数','微积分在经济学中的应用',
   {'基填':R((1,7)),'基解':R((1,4)),'综填':[1,2],'综解':R((1,9))}, {}, {}),
 (8,'高数','无穷级数',
   {'基选':R((1,6)),'基填':[1,3],'基解':R((1,11)),'综选':[1,3,4,5,6,7,8,9,10,13],'综填':R((1,5)),'综解':[1,7,8,9,10,13,14,15],'拓展':[1]},
   {'综选':[2,11],'综解':[4,12]}, {}),
 (9,'线代','行列式',
   {'基选':R((1,3)),'基填':R((1,11)),'基解':R((1,3)),'综选':R((1,4)),'综填':R((1,6)),'综解':[1,2,3],'拓展':[1,2]},
   {'综解':[4]}, {}),
 (10,'线代','矩阵',
   {'基选':R((1,6)),'基填':R((1,12)),'基解':R((1,11)),'综选':R((1,8)),'综填':R((1,6)),'综解':R((1,5)),'拓展':[1,2]}, {}, {}),
 (11,'线代','向量',
   {'基选':R((1,8)),'基填':[1,2],'基解':R((1,8)),'综选':R((1,8)),'综解':R((1,9))}, {}, {}),
 (12,'线代','线性方程组',
   {'基选':R((1,11)),'基填':[1,2],'基解':R((1,8)),'综选':R((1,8)),'综填':[1,2,3],'综解':R((1,11)),'拓展':[2]},
   {'拓展':[1]}, {}),
 (13,'线代','相似矩阵',
   {'基选':R((1,6)),'基填':R((1,4)),'基解':R((1,11)),'综选':R((1,9)),'综填':R((1,3)),'综解':R((1,17)),'拓展':R((1,3))}, {}, {}),
 (14,'线代','二次型',
   {'基选':R((1,8)),'基填':[1,2],'基解':R((1,6)),'综选':[1,2,3,4,5,6,7,8,9,10,13],'综填':R((1,4)),'综解':R((1,12)),'拓展':R((1,5))},
   {'综选':[11],'拓展':[6]},
   {'综选':[12]}),
 (15,'概率','随机事件及其概率',
   {'基选':R((1,7)),'基填':R((1,8)),'基解':[1,2],'综选':[1,2],'综填':R((1,5)),'综解':[1],'拓展':[1]},
   {'拓展':[2]},
   {'综填':[6],'综解':[2]}),
 (16,'概率','随机变量及其分布',
   {'基选':R((1,6)),'基填':R((1,7)),'基解':R((1,7)),'综选':R((1,4)),'综填':R((1,7)),'综解':[1,2]}, {}, {}),
 (17,'概率','多维随机变量及其分布',
   {'基选':R((1,3)),'基填':R((1,3)),'基解':R((1,11)),'综选':R((1,4)),'综填':R((1,4)),'综解':R((1,10)),'拓展':R((1,3))}, {}, {}),
 (18,'概率','随机变量的数字特征',
   {'基选':R((1,8)),'基填':R((1,5)),'基解':R((1,7)),'综选':R((1,9)),'综填':[1,2,4,5,6,7,8,9,10,11,12],'综解':R((1,10)),'拓展':[1,2]},
   {'综填':[3]}, {}),
 (19,'概率','大数定律与中心极限定理',
   {'基选':R((1,3)),'基填':R((1,4)),'基解':[1,2]}, {}, {}),
 (20,'概率','数理统计的基本概念',
   {'基选':R((1,4)),'基填':R((1,4)),'基解':[1,2],'综选':R((1,7)),'综填':R((1,3)),'综解':R((1,4))}, {}, {}),
 (21,'概率','参数估计',
   {'基解':R((1,13)),'综解':R((1,4)),'拓展':[1,2]}, {}, {}),
]

SEC_NAME = {'基选':'基础选择','基填':'基础填空','基解':'基础解答','综选':'综合选择','综填':'综合填空','综解':'综合解答','拓展':'拓展题'}
SEC_ORDER = ['基选','基填','基解','综选','综填','综解','拓展']
SEC_MIN = {'基选':4,'基填':5,'基解':10,'综选':5,'综填':6,'综解':15,'拓展':20}
PHASE = {'高数': '第一阶段·高数必做', '线代': '第二阶段·线代必做', '概率': '第三阶段·概率必做'}

def fmt_nums(ns):
    ns = sorted(set(ns)); parts = []; i = 0
    while i < len(ns):
        j = i
        while j + 1 < len(ns) and ns[j+1] == ns[j] + 1: j += 1
        parts.append(str(ns[i]) if i == j else f'{ns[i]}-{ns[j]}')
        i = j + 1
    return '、'.join(parts)

# ============ 任务与题库 ============
must_tasks, extra_tasks, hard_tasks = [], [], []
problem_rows = []
tier_cnt = {'必做题':0,'选择做':0,'特难题':0}
chapter_stat = {}
for no, book, name, must, extra, hard in CH:
    ch_label = f'第{no}章·{name}'
    chapter_stat[ch_label] = {}
    for tier, mapping in [('必做题',must),('选择做',extra),('特难题',hard)]:
        cnt = 0
        for sec in SEC_ORDER:
            ns = mapping.get(sec)
            if not ns: continue
            cnt += len(ns)
            for n in ns:
                problem_rows.append([tier, ch_label, SEC_NAME[sec], n, f'{SEC_NAME[sec]}{n}', '未开始', '', ''])
            if tier == '必做题':
                must_tasks.append((PHASE[book], ch_label, sec, ns, SEC_MIN[sec], tier))
            elif tier == '选择做':
                extra_tasks.append(('第四阶段·加餐(选择做集中处理)', ch_label, sec, ns, SEC_MIN[sec], tier))
            else:
                hard_tasks.append(('第五阶段·特难题(目标130+)', ch_label, sec, ns, SEC_MIN[sec], tier))
        chapter_stat[ch_label][tier] = cnt
        tier_cnt[tier] += cnt
all_tasks = must_tasks + extra_tasks + hard_tasks

# ============ 排程: 周一~六 200min, 周日 110min ============
def pack_days(tasks, start_date):
    days = []; cur = []; cur_min = 0
    d = start_date
    cap = lambda day: 110 if day.weekday() == 6 else 200
    for phase, ch_label, sec, nums, per, tier in tasks:
        batch = []; batch_min = 0
        for n in nums:
            if cur_min + batch_min + per > cap(d) and (cur or batch):
                if batch:
                    cur.append((phase, ch_label, sec, list(batch), batch_min, tier)); batch = []; batch_min = 0
                days.append({'date': d, 'items': cur}); d += dt.timedelta(days=1)
                cur = []; cur_min = 0
            batch.append(n); batch_min += per
        if batch:
            cur.append((phase, ch_label, sec, list(batch), batch_min, tier)); cur_min += batch_min
    if cur: days.append({'date': d, 'items': cur})
    return days

START = dt.date(2026, 9, 8)
days = pack_days(all_tasks, START)
last_must_day = max(di+1 for di, day in enumerate(days) if any(it[5]=='必做题' for it in day['items']))
last_extra_day = max(di+1 for di, day in enumerate(days) if any(it[5]=='选择做' for it in day['items']))

day_of = {}
for di, day in enumerate(days):
    for it in day['items']:
        for n in it[3]:
            day_of[(it[1], it[2], n)] = di + 1

# ============ Excel ============
wb = Workbook()
thin = Border(*[Side(style='thin', color='B0B0B0')]*4)
hfill = PatternFill('solid', fgColor='2F5597')
hfont = Font(name='微软雅黑', size=10, bold=True, color='FFFFFF')
bfont = Font(name='微软雅黑', size=9)
sfill = PatternFill('solid', fgColor='E2EFDA')
sunfill = PatternFill('solid', fgColor='FFF2CC')
wrap = Alignment(wrap_text=True, vertical='center')
ctr = Alignment(horizontal='center', vertical='center', wrap_text=True)

# ---------- 使用说明 ----------
ws = wb.active; ws.title = '使用说明'
ws.column_dimensions['A'].width = 112
end_must = START + dt.timedelta(days=last_must_day-1)
end_extra = START + dt.timedelta(days=last_extra_day-1)
notes = [
 ('2027考研《李林880题》(数学三) 带刷执行计划 —— 依据「没咋了&吃尽天下面」通用版计划表逐题落实', True),
 ('', False),
 (f'【题量总览】 必做题 {tier_cnt["必做题"]} 题(主线,目标120分以下做完即可) ｜ 选择做 {tier_cnt["选择做"]} 题(120-130分加做) ｜ 特难题 {tier_cnt["特难题"]} 题(目标130+挑战,可放弃)', False),
 (f'【排期】 {START.strftime("%Y年%m月%d日")}开刷 → 预计 {end_must.strftime("%m月%d日")}完成全部必做题 → {end_extra.strftime("%m月%d日")}收尾加餐, 11月起主攻真题套卷。周一至六每天约3.5h, 周日半天(约2h)+本周错题复盘。', False),
 ('', False),
 ('【怎么记录进度】(交接必读)', True),
 ('1. 每天做完 → 「每日计划」表把当天状态改为 已完成/部分完成, 并在"完成情况记录"列写实际完成的题号(如: 解答1-8)。', False),
 ('2. 做错的题 → 「题库清单」表在"错题"列打√。二刷 = 错题 + 看板中未完成的题。', False),
 ('3. 「进度看板」全自动统计剩余(按章节×层级)。想知道还剩什么 → 看板看总量, 题库清单筛选"未开始"看明细。', False),
 ('4. 进度落后不用改日期: 优先保证每章必做题连着做完, 周日复盘日就是缓冲垫, 顺延即可。', False),
 ('5. 交接: 把本文件发给对方, 从「每日计划」找到第一个"未开始"的日子接着做, 规则全在本页。', False),
 ('', False),
 ('【记号说明】 选=选择题 填=填空题 解=解答题; 题号与做题本(A4紧凑版)完全一致。第1章"解答2"含两小问。第4章拓展题书上不印题号, 按顺序对应拓展1(选择)/拓展2(解答)。', False),
 ('【出处】 分层题单 = 《2027考研李林880题(数学三)带刷计划表—通用版》; 已逐章核对做题本实际题量, "全做"章节按实际题数展开。计划表未列的题(如第3章拓展2)按原表意图不做。', False),
]
for i,(t,b) in enumerate(notes):
    c = ws.cell(row=i+1, column=1, value=t)
    c.font = Font(name='微软雅黑', size=11 if b else 10, bold=b, color='1F3864' if b else '000000')
    c.alignment = Alignment(wrap_text=True, vertical='top')
    ws.row_dimensions[i+1].height = 28 if b else 36

# ---------- 进度看板 ----------
ws2 = wb.create_sheet('进度看板')
heads = ['章节','必做题总数','必做已完成','必做剩余','选择做总数','选择做已完成','选择做剩余','特难题总数','特难题已完成','特难题剩余','总体完成率']
for j,h in enumerate(heads,1):
    c = ws2.cell(row=1,column=j,value=h); c.font=hfont; c.fill=hfill; c.border=thin; c.alignment=ctr
for i,(ch,st) in enumerate(chapter_stat.items(), start=2):
    ws2.cell(row=i,column=1,value=ch).font=bfont
    for k,tier in enumerate(['必做题','选择做','特难题']):
        col = 2+k*3
        ws2.cell(row=i,column=col,value=st.get(tier,0)).font=bfont
        ws2.cell(row=i,column=col+1,value=f'=COUNTIFS(题库清单!$B:$B,$A{i},题库清单!$A:$A,"{tier}",题库清单!$F:$F,"已完成")').font=bfont
        ws2.cell(row=i,column=col+2,value=f'={get_column_letter(col)}{i}-{get_column_letter(col+1)}{i}').font=bfont
    ws2.cell(row=i,column=11,value=f'=IF(SUM(B{i},E{i},H{i})=0,"",ROUND((C{i}+F{i}+I{i})/SUM(B{i},E{i},H{i})*100,1)&"%")').font=bfont
    for j in range(1,12): ws2.cell(row=i,column=j).border=thin
r = len(chapter_stat)+2
ws2.cell(row=r,column=1,value='合计').font=Font(name='微软雅黑',size=9,bold=True)
for j in range(2,11):
    col = get_column_letter(j)
    ws2.cell(row=r,column=j,value=f'=SUM({col}2:{col}{r-1})').font=Font(name='微软雅黑',size=9,bold=True)
ws2.cell(row=r,column=11,value=f'=ROUND((C{r}+F{r}+I{r})/SUM(B{r},E{r},H{r})*100,1)&"%"').font=Font(name='微软雅黑',size=9,bold=True)
for j in range(1,12):
    ws2.cell(row=r,column=j).fill=sfill; ws2.cell(row=r,column=j).border=thin
    ws2.column_dimensions[get_column_letter(j)].width = 30 if j==1 else 12
ws2.freeze_panes = 'A2'
ws2.auto_filter.ref = f'A1:K{r-1}'

# ---------- 每日计划 ----------
ws3 = wb.create_sheet('每日计划')
heads3 = ['天数','日期','星期','阶段','当日任务(题号与做题本一致)','新题量','预计用时','状态','完成情况记录(实际做完的题号)','备注']
for j,h in enumerate(heads3,1):
    c = ws3.cell(row=1,column=j,value=h); c.font=hfont; c.fill=hfill; c.border=thin; c.alignment=ctr
WD = '一二三四五六日'
for di, day in enumerate(days):
    row = di + 2
    is_sun = day['date'].weekday() == 6
    tasks_txt = '；'.join(f'{it[1]} {SEC_NAME[it[2]]}：{fmt_nums(it[3])}' for it in day['items'])
    nq = sum(len(it[3]) for it in day['items'])
    mins = sum(it[4] for it in day['items'])
    note = '半天量, 其余时间复盘本周错题' if is_sun else ''
    vals = [di+1, day['date'].strftime('%m-%d'), '周'+WD[day['date'].weekday()], day['items'][0][0], tasks_txt, nq, f'{mins/60:.1f}h', '未开始', '', note]
    for j,v in enumerate(vals,1):
        c = ws3.cell(row=row,column=j,value=v); c.font=bfont; c.border=thin
        c.alignment = wrap if j in (5,9,10) else ctr
    if is_sun:
        for j in range(1,11): ws3.cell(row=row,column=j).fill=sunfill
for j,w in enumerate([6,8,7,26,78,8,9,9,28,22],1): ws3.column_dimensions[get_column_letter(j)].width = w
ws3.freeze_panes = 'A2'
ws3.auto_filter.ref = f'A1:J{len(days)+1}'
dv = DataValidation(type='list', formula1='"未开始,进行中,已完成,部分完成"', allow_blank=True)
ws3.add_data_validation(dv); dv.add(f'H2:H{len(days)+1}')

# ---------- 题库清单 ----------
ws4 = wb.create_sheet('题库清单')
heads4 = ['层级','章节','题型','题号','题目标识','状态','错题','备注']
for j,h in enumerate(heads4,1):
    c = ws4.cell(row=1,column=j,value=h); c.font=hfont; c.fill=hfill; c.border=thin; c.alignment=ctr
for i,row in enumerate(problem_rows, start=2):
    for j,v in enumerate(row,1):
        c = ws4.cell(row=i,column=j,value=v); c.font=bfont; c.border=thin
        c.alignment = ctr
    sec_key = [k for k,v in SEC_NAME.items() if v==row[2]][0]
    dn = day_of.get((row[1], sec_key, row[3]))
    if dn:
        c = ws4.cell(row=i,column=8,value=f'计划第{dn}天'); c.font=bfont
for j,w in enumerate([10,36,11,7,13,9,7,12],1): ws4.column_dimensions[get_column_letter(j)].width = w
ws4.freeze_panes = 'A2'
ws4.auto_filter.ref = f'A1:H{len(problem_rows)+1}'
dv2 = DataValidation(type='list', formula1='"未开始,进行中,已完成"', allow_blank=True)
ws4.add_data_validation(dv2); dv2.add(f'F2:F{len(problem_rows)+1}')

out = r'C:\Users\Pop\Downloads\2027李林880带刷执行计划.xlsx'
wb.save(out)
print('已生成:', out)
print(f'总天数 {len(days)} | 必做题完成于第{last_must_day}天({end_must}) | 加餐完成于第{last_extra_day}天({end_extra})')
print('题量:', tier_cnt, '| 题库清单行数:', len(problem_rows))
