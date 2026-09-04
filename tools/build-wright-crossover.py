#!/usr/bin/env python3
"""wright-crossover.svg — where each composition wins, by group size and problem difficulty."""
import math

W, H = 940, 600
L, R, T, B = 96, 700, 56, 486          # plot box
NMIN, NMAX = 2, 12
YMIN, YMAX = -1.15, 0.80

PACK, TEAM, ALERT, INK, MUT = "#B45309", "#047857", "#B91C1C", "#1F2937", "#6B7280"
FONT = 'font-family="system-ui,-apple-system,Segoe UI,sans-serif"'

def X(n): return L + (n - NMIN) / (NMAX - NMIN) * (R - L)
def Y(v): return B - (v - YMIN) / (YMAX - YMIN) * (B - T)
def thr(n): return math.log(n) / (n - 1)

steps = [NMIN + i * (NMAX - NMIN) / 400 for i in range(401)]
up = [(X(n), Y(thr(n))) for n in steps]
lo = [(X(n), Y(-thr(n))) for n in steps]
path = lambda pts: "M " + " L ".join(f"{x:.2f},{y:.2f}" for x, y in pts)

s = []
a = s.append
a(f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block" {FONT}>')
a('<title>PACK vs TEAM vs CHAIN strength, by group size and problem difficulty</title>')
a(f'<rect x="0" y="0" width="{W}" height="{H}" fill="#FCFCFB"/>')

# ---- bands ---------------------------------------------------------------
a(f'<path d="{path(up)} L {R:.2f},{T} L {L:.2f},{T} Z" fill="{TEAM}" fill-opacity="0.13"/>')
a(f'<path d="{path(up)} L {R:.2f},{Y(-thr(NMAX)):.2f} '
  + " L ".join(f"{x:.2f},{y:.2f}" for x, y in reversed(lo)) + f' Z" fill="{PACK}" fill-opacity="0.11"/>')
a(f'<path d="{path(lo)} L {R:.2f},{B} L {L:.2f},{B} Z" fill="{PACK}" fill-opacity="0.22"/>')

# ---- grid ----------------------------------------------------------------
for n in range(NMIN, NMAX + 1):
    a(f'<line x1="{X(n):.1f}" y1="{T}" x2="{X(n):.1f}" y2="{B}" stroke="#E5E7EB" stroke-width="1"/>')
    a(f'<text x="{X(n):.1f}" y="{B+22}" text-anchor="middle" font-size="13" fill="{MUT}">{n}</text>')
for v in [-1.0, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]:
    dash = '' if v == 0 else ' stroke-dasharray="2 3"'
    col = "#9CA3AF" if v == 0 else "#E5E7EB"
    a(f'<line x1="{L}" y1="{Y(v):.1f}" x2="{R}" y2="{Y(v):.1f}" stroke="{col}" stroke-width="{1.4 if v==0 else 1}"{dash}/>')
    a(f'<text x="{L-12}" y="{Y(v)+4:.1f}" text-anchor="end" font-size="12" fill="{MUT}">{v:+.2f}</text>')

# ---- the two threshold curves -------------------------------------------
a(f'<path d="{path(up)}" fill="none" stroke="{TEAM}" stroke-width="2.4" stroke-linecap="round"/>')
a(f'<path d="{path(lo)}" fill="none" stroke="{ALERT}" stroke-width="2.4" stroke-linecap="round"/>')

# ---- band labels ---------------------------------------------------------
a(f'<text x="{X(8.6):.0f}" y="{Y(0.46):.0f}" text-anchor="middle" font-size="16" font-weight="700" fill="{TEAM}">TEAM is best</text>')
a(f'<text x="{X(8.6):.0f}" y="{Y(0.46)+19:.0f}" text-anchor="middle" font-size="12.5" fill="{TEAM}">the group already out-matches the problem</text>')
a(f'<text x="{X(7.6):.0f}" y="{Y(0.03):.0f}" text-anchor="middle" font-size="16" font-weight="700" fill="{PACK}">PACK is best</text>')
a(f'<text x="{X(7.6):.0f}" y="{Y(0.03)+19:.0f}" text-anchor="middle" font-size="12.5" fill="{PACK}">Team second, Chain last</text>')
a(f'<text x="{X(7.0):.0f}" y="{Y(-0.62):.0f}" text-anchor="middle" font-size="16" font-weight="700" fill="{ALERT}">PACK is best — and TEAM is now the WORST</text>')
a(f'<text x="{X(7.0):.0f}" y="{Y(-0.62)+19:.0f}" text-anchor="middle" font-size="12.5" fill="{ALERT}">&#8220;A mob is a Team that chooses the wrong solution to a difficult social problem.&#8221;</text>')

# ---- curve equations -----------------------------------------------------
a(f'<text x="{X(11.75):.0f}" y="{Y(thr(11.75))-11:.0f}" text-anchor="end" font-size="12.5" font-weight="600" fill="{TEAM}">+ ln N / (N &#8722; 1)</text>')
a(f'<text x="{X(11.75):.0f}" y="{Y(-thr(11.75))+21:.0f}" text-anchor="end" font-size="12.5" font-weight="600" fill="{ALERT}">&#8722; ln N / (N &#8722; 1)</text>')

# ---- the magic-3 annotation ---------------------------------------------
a(f'<circle cx="{X(3):.1f}" cy="{Y(thr(3)):.1f}" r="6" fill="#FCFCFB" stroke="{TEAM}" stroke-width="2.6"/>')
a(f'<line x1="{X(3):.1f}" y1="{Y(thr(3))-9:.1f}" x2="{X(3.15):.1f}" y2="{Y(0.74):.1f}" stroke="{MUT}" stroke-width="1"/>')
a(f'<text x="{X(3.3):.0f}" y="{Y(0.755):.0f}" font-size="12.5" font-weight="600" fill="{INK}">N = 3 &#8594; +0.55 logits</text>')
a(f'<text x="{X(3.3):.0f}" y="{Y(0.755)+16:.0f}" font-size="12" fill="{MUT}">what a team of three must average over the</text>')
a(f'<text x="{X(3.3):.0f}" y="{Y(0.755)+31:.0f}" font-size="12" fill="{MUT}">problem just to match a pack of three</text>')

# ---- Wright's worked example --------------------------------------------
a(f'<circle cx="{X(10):.1f}" cy="{Y(-1.0):.1f}" r="7" fill="{ALERT}"/>')
a(f'<circle cx="{X(10):.1f}" cy="{Y(-1.0):.1f}" r="11" fill="none" stroke="{ALERT}" stroke-width="1.6" stroke-opacity="0.45"/>')
a(f'<line x1="{X(10):.1f}" y1="{Y(-1.0)-13:.1f}" x2="{X(9.4):.1f}" y2="{Y(-0.90):.1f}" stroke="{MUT}" stroke-width="1"/>')
a(f'<text x="{X(9.3):.0f}" y="{Y(-0.885):.0f}" text-anchor="end" font-size="12.5" font-weight="600" fill="{INK}">Wright&#8217;s ten people, each 1 logit below the task</text>')
a(f'<text x="{X(9.3):.0f}" y="{Y(-0.885)+16:.0f}" text-anchor="end" font-size="12" fill="{MUT}">as a PACK +1.3 &#183; as a CHAIN &#8722;3.3 &#183; as a TEAM &#8722;10.0</text>')

# ---- axes ----------------------------------------------------------------
a(f'<line x1="{L}" y1="{T}" x2="{L}" y2="{B}" stroke="#9CA3AF" stroke-width="1.4"/>')
a(f'<line x1="{L}" y1="{B}" x2="{R}" y2="{B}" stroke="#9CA3AF" stroke-width="1.4"/>')
a(f'<text x="{(L+R)/2:.0f}" y="{B+50}" text-anchor="middle" font-size="13.5" font-weight="600" fill="{INK}">GROUP SIZE N</text>')
a(f'<text transform="translate(30,{(T+B)/2:.0f}) rotate(-90)" text-anchor="middle" font-size="13.5" font-weight="600" fill="{INK}">GROUP ADVANTAGE OVER PROBLEM (B&#772; &#8722; D), logits</text>')
a(f'<text x="{L}" y="{T-30}" font-size="11.5" fill="{MUT}">&#9650; group more able &#183; problem easier</text>')
a(f'<text x="{L}" y="{B+72}" font-size="11.5" fill="{MUT}">&#9660; group less able &#183; problem harder</text>')

# ---- side panel: the arithmetic -----------------------------------------
px = R + 34
a(f'<text x="{px}" y="{T+4}" font-size="13" font-weight="700" fill="{INK}">THE THRESHOLD</text>')
a(f'<text x="{px}" y="{T+24}" font-size="12" fill="{MUT}">ln N / (N &#8722; 1)</text>')
rows = [(n, thr(n), math.log(n)) for n in (2, 3, 4, 5, 6, 8, 10, 12)]
a(f'<text x="{px}" y="{T+56}" font-size="11" font-weight="600" fill="{MUT}">N</text>')
a(f'<text x="{px+38}" y="{T+56}" font-size="11" font-weight="600" fill="{TEAM}">team</text>')
a(f'<text x="{px+96}" y="{T+56}" font-size="11" font-weight="600" fill="{PACK}">pack</text>')
a(f'<text x="{px+154}" y="{T+56}" font-size="11" font-weight="600" fill="{ALERT}">chain</text>')
a(f'<line x1="{px}" y1="{T+63}" x2="{px+196}" y2="{T+63}" stroke="#D1D5DB" stroke-width="1"/>')
for i, (n, t, g) in enumerate(rows):
    y = T + 82 + i * 22
    bold = ' font-weight="700"' if n in (3, 8) else ''
    a(f'<text x="{px}" y="{y}" font-size="12"{bold} fill="{INK}">{n}</text>')
    a(f'<text x="{px+38}" y="{y}" font-size="12"{bold} fill="{TEAM}">&#177;{t:.2f}</text>')
    a(f'<text x="{px+96}" y="{y}" font-size="12"{bold} fill="{PACK}">+{g:.2f}</text>')
    a(f'<text x="{px+154}" y="{y}" font-size="12"{bold} fill="{ALERT}">&#8722;{g:.2f}</text>')
a(f'<text x="{px}" y="{T+82+len(rows)*22+18}" font-size="11.5" fill="{MUT}">team = how far above the problem</text>')
a(f'<text x="{px}" y="{T+82+len(rows)*22+33}" font-size="11.5" fill="{MUT}">a team must average to beat a pack.</text>')
a(f'<text x="{px}" y="{T+82+len(rows)*22+55}" font-size="11.5" fill="{MUT}">pack / chain = what the Nth member</text>')
a(f'<text x="{px}" y="{T+82+len(rows)*22+70}" font-size="11.5" fill="{MUT}">adds, or takes away, in logits.</text>')

# ---- footer --------------------------------------------------------------
a(f'<text x="{L}" y="{H-22}" font-size="11.5" fill="{MUT}">Benjamin D. Wright, &#8220;Teams, Packs and Chains&#8221;, Rasch Measurement Transactions 1995, 9:2 p.432 &#183; curves computed, not traced</text>')
a('</svg>')

open("/Users/marcpierson/rcn/tools/wright-crossover.svg", "w").write("\n".join(s))
print("wrote tools/wright-crossover.svg")
for n in (2, 3, 4, 5, 6, 8, 10, 12):
    print(f"  N={n:2d}  threshold ±{thr(n):.3f}   ln N = {math.log(n):.3f}")
