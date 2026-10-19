"""
Deployment Smoke Test Suite for GrowthWay API.
Run against local server or staging/production URL:
    python smoke_test.py
    python smoke_test.py --url https://api.growthway.in
"""

import sys
import json
import urllib.request
import urllib.error

DEFAULT_URL = "http://localhost:8000"


def run_test(name: str, path: str, base_url: str, method: str = "GET", payload: dict = None) -> bool:
    url = f"{base_url}{path}"
    print(f"[*] Testing {name} -> {url} ...", end=" ")
    try:
        data = json.dumps(payload).encode("utf-8") if payload else None
        headers = {"Content-Type": "application/json"} if payload else {}
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            body = json.loads(resp.read().decode("utf-8"))
            if status in (200, 201):
                print(f"[PASS] ({status})")
                return True
            else:
                print(f"[FAIL] ({status}) -> {body}")
                return False
    except urllib.error.HTTPError as e:
        print(f"[FAIL] HTTP {e.code}: {e.read().decode('utf-8', errors='ignore')}")
        return False
    except Exception as e:
        print(f"[ERROR] {e}")
        return False


def main():
    base_url = DEFAULT_URL
    for i, arg in enumerate(sys.argv):
        if arg == "--url" and i + 1 < len(sys.argv):
            base_url = sys.argv[i + 1].rstrip("/")
        elif arg.startswith("http"):
            base_url = arg.rstrip("/")

    print("=" * 60)
    print(f"GROWTHWAY API DEPLOYMENT SMOKE TEST: {base_url}")
    print("=" * 60)

    tests = [
        ("Root Route", "/", "GET"),
        ("Basic Health", "/health", "GET"),
        ("Service Ping (Probe)", "/api/service/ping", "GET"),
        ("Service Health (Readiness)", "/api/service/health", "GET"),
        ("Service Deployment Info", "/api/service/info", "GET"),
        ("Public Services", "/api/services", "GET"),
        ("Public Industries", "/api/industries", "GET"),
        ("Public Projects", "/api/projects", "GET"),
        ("Public Clients", "/api/clients", "GET"),
        ("Public Testimonials", "/api/testimonials", "GET"),
        ("Public Team", "/api/team", "GET"),
        ("Public Site Settings", "/api/site-settings", "GET"),
    ]

    passed = 0
    for name, path, method in tests:
        if run_test(name, path, base_url, method=method):
            passed += 1

    print("=" * 60)
    print(f"Results: {passed}/{len(tests)} passed.")
    if passed == len(tests):
        print("[SUCCESS] All deployment smoke tests passed cleanly!")
        sys.exit(0)
    else:
        print("[WARNING] Some tests did not pass. Check server logs.")
        sys.exit(1)


if __name__ == "__main__":
    main()
