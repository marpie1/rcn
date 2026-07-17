"""
Record demo videos of tools with live patient data, convert to .mp4, embed in PPTX.

Pipeline:
  1. Playwright controls a real Chromium browser (headless) and records .webm video
     while performing scripted interactions (select person, click problem, scroll frame).
  2. avconvert (macOS built-in AVFoundation tool) converts .webm → .mp4.
     PowerPoint on Mac requires .mp4 — it will not play .webm.
  3. python-pptx's shapes.add_movie() embeds the .mp4 directly in the slide.
     The screenshot for that slide becomes the poster frame (shown before play).

Why Playwright and not just a screen recorder?
  - Headless: no visible window, runs in the background, reproducible.
  - Scriptable: we can select the right patient, wait for AI frame render,
    slow down interactions so the video reads clearly, scroll at a controlled pace.
  - The result is a deterministic demo video, not a one-time screen capture.

Run:  python3 docs/record_videos.py
Requires: pip install playwright (already done)
          python3 -m playwright install chromium (already done)
          avconvert: built into macOS, no install needed
          coupler-proxy.py running on port 8766
"""

from playwright.sync_api import sync_playwright
import os, subprocess, glob

BASE    = os.path.dirname(os.path.abspath(__file__))
VIDEOS  = os.path.join(BASE, 'videos')
SCREENS = os.path.join(BASE, 'screenshots')
os.makedirs(VIDEOS, exist_ok=True)


# ── Conversion helper ─────────────────────────────────────────────────────────

def webm_to_mp4(webm_path, mp4_path):
    """
    Convert .webm → .mp4 using ffmpeg.

    avconvert (macOS built-in) cannot read WebM — AVFoundation doesn't support
    that container. ffmpeg handles it cleanly.

    Key flags:
      -c:v libx264    — encode video as H.264, which PowerPoint on Mac plays natively
      -pix_fmt yuv420p — pixel format required for broad compatibility (some
                         players reject 4:4:4 or 4:2:2 chroma subsampling)
      -movflags +faststart — move the MP4 index to the start of the file so
                             PowerPoint can begin playing before fully reading it
      -an             — strip audio (Playwright records silent video; this avoids
                         an empty audio track that can confuse some players)
    """
    print(f'  Converting {os.path.basename(webm_path)} → {os.path.basename(mp4_path)}')
    result = subprocess.run([
        'ffmpeg', '-y',              # -y = overwrite output without asking
        '-i', webm_path,
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-an',
        mp4_path,
    ], capture_output=True, text=True)

    if result.returncode != 0:
        print(f'  ffmpeg failed: {result.stderr[-300:]}')
        return False
    print(f'  ✓ {mp4_path}')
    return True


# ── Recording helpers ─────────────────────────────────────────────────────────

def slow_scroll(page, steps=6, delta=180, pause_ms=500):
    """Scroll down in small steps with pauses — makes the video readable."""
    for _ in range(steps):
        page.mouse.wheel(0, delta)
        page.wait_for_timeout(pause_ms)


# ── Video 1: My Health Picture — Alex Rivera, Hypertension ───────────────────

def record_health_picture(p):
    """
    Playwright records everything that happens in the browser context to .webm.
    record_video_dir tells it where to put the file.
    record_video_size sets the pixel dimensions (must match viewport).
    slow_mo=400 adds 400ms between every Playwright action — slows the demo
    so a viewer can read what's happening.
    """
    print('\nRecording My Health Picture...')

    browser = p.chromium.launch(headless=True, slow_mo=400)
    context = browser.new_context(
        viewport={'width': 1280, 'height': 800},
        record_video_dir=VIDEOS,
        record_video_size={'width': 1280, 'height': 800},
    )
    page = context.new_page()

    # Navigate and wait for the app to fully load
    page.goto('http://localhost:8766', wait_until='networkidle')
    page.wait_for_timeout(1200)

    # Select Alex Rivera from the person dropdown
    # select_option triggers the onchange → loadPerson() API call
    page.select_option('#person-select', 'sample-person')
    page.wait_for_timeout(1800)   # wait for problem list to populate

    # Click the first problem (Hypertension, stage 1 untreated)
    # This triggers loadProblem() → API call → renderFrame()
    page.locator('.problem-item').first.click()
    page.wait_for_timeout(5000)   # frame takes a moment to load from proxy

    # Scroll slowly through the rendered SOAP frame so the viewer sees the data
    slow_scroll(page, steps=7, delta=160, pause_ms=550)
    page.wait_for_timeout(1200)

    # page.video.path() is only valid after the page is closed
    video_ref = page.video
    page.close()
    context.close()
    browser.close()

    webm_path = video_ref.path()
    mp4_path  = os.path.join(VIDEOS, 'my-health-picture.mp4')
    if webm_to_mp4(webm_path, mp4_path):
        os.remove(webm_path)
        return mp4_path
    return None


# ── Video 2: My Health Choices — AF anticoagulation fact box ─────────────────

def record_health_choices(p):
    """
    Health Choices loads the AF fact box immediately — no interaction needed
    to get data on screen. We just let it render, then scroll slowly so the
    viewer sees the dot display and the two option columns.
    """
    print('\nRecording My Health Choices...')

    browser = p.chromium.launch(headless=True, slow_mo=300)
    context = browser.new_context(
        viewport={'width': 1280, 'height': 800},
        record_video_dir=VIDEOS,
        record_video_size={'width': 1280, 'height': 800},
    )
    page = context.new_page()

    page.goto('http://localhost:8770', wait_until='networkidle')
    page.wait_for_timeout(2000)   # let the dot display render fully

    # Scroll slowly to reveal both option columns and the dot arrays
    slow_scroll(page, steps=5, delta=200, pause_ms=700)
    page.wait_for_timeout(1500)

    video_ref = page.video
    page.close()
    context.close()
    browser.close()

    webm_path = video_ref.path()
    mp4_path  = os.path.join(VIDEOS, 'my-health-choices.mp4')
    if webm_to_mp4(webm_path, mp4_path):
        os.remove(webm_path)
        return mp4_path
    return None


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    with sync_playwright() as p:
        hp  = record_health_picture(p)
        hc  = record_health_choices(p)

    print('\nDone.')
    print(f'  Health Picture  → {hp}')
    print(f'  Health Choices  → {hc}')
    print()
    print('Next step: run python3 docs/make_phs_intro_pptx.py to embed these in the deck.')
