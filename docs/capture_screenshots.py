"""
Capture live screenshots of tool UIs with actual patient data.
Run after starting: python3 coupler-proxy.py
"""
from playwright.sync_api import sync_playwright
import os

SCREENS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'screenshots')

def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # ── 1. My Health Picture — Alex Rivera, Problem 1 (Hypertension) ──────
        print('Capturing My Health Picture with live data...')
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto('http://localhost:8766', wait_until='networkidle')
        page.wait_for_timeout(1000)

        # Select Alex Rivera
        page.select_option('#person-select', 'sample-person')
        page.wait_for_timeout(1500)

        # Click first problem (hypertension)
        page.locator('.problem-item').first.click()
        page.wait_for_timeout(4000)   # wait for frame to render from proxy

        page.screenshot(path=os.path.join(SCREENS, 'my-health-picture.png'), full_page=False)
        print(f'  → my-health-picture.png')
        page.close()

        # ── 2. My Health Choices — AF anticoagulation fact box (already loads) ─
        print('Capturing My Health Choices...')
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto('http://localhost:8770', wait_until='networkidle')
        page.wait_for_timeout(1500)
        page.screenshot(path=os.path.join(SCREENS, 'my-health-choices.png'), full_page=False)
        print(f'  → my-health-choices.png')
        page.close()

        # ── 3. My Shared Care Plan — FedWiki Medications page ────────────────
        print('Capturing My Shared Care Plan (FedWiki)...')
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto('http://localhost:3000/medications.html', wait_until='networkidle')
        page.wait_for_timeout(2000)
        page.screenshot(path=os.path.join(SCREENS, 'my-shared-care-plan.png'), full_page=False)
        print(f'  → my-shared-care-plan.png')

        # Also try diagnoses page
        page.goto('http://localhost:3000/diagnoses.html', wait_until='networkidle')
        page.wait_for_timeout(2000)
        page.screenshot(path=os.path.join(SCREENS, 'scp-diagnoses.png'), full_page=False)
        print(f'  → scp-diagnoses.png')
        page.close()

        # ── 4. My Support Network ─────────────────────────────────────────────
        print('Capturing My Support Network...')
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto('file:///Users/marcpierson/rcn/tools/my-support-network.html',
                  wait_until='networkidle')
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(SCREENS, 'my-support-network.png'), full_page=False)
        print(f'  → my-support-network.png')
        page.close()

        # ── 5. SODOTO issuer ──────────────────────────────────────────────────
        print('Capturing SODOTO issuer...')
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto('file:///Users/marcpierson/rcn/tools/sodoto-issuer.html',
                  wait_until='networkidle')
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(SCREENS, 'sodoto-issuer.png'), full_page=False)
        print(f'  → sodoto-issuer.png')
        page.close()

        browser.close()
    print('Done.')

if __name__ == '__main__':
    capture()
