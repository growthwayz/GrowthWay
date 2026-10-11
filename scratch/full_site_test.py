import urllib.request
import urllib.parse
import json
import re
import sys

BASE_FRONTEND_5173 = "http://localhost:5173"
BASE_FRONTEND_5174 = "http://localhost:5174"
BASE_BACKEND = "http://localhost:8000"

results = {
    "server_health": [],
    "frontend_routes": [],
    "backend_apis": [],
    "admin_auth_flow": [],
    "pipeline_telemetry": []
}

def test_url(url, label, method="GET", data=None, headers=None, expected_status=200):
    try:
        req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.getcode()
            body = response.read().decode('utf-8', errors='ignore')
            success = (status == expected_status)
            return {
                "label": label,
                "url": url,
                "status": status,
                "success": success,
                "body_len": len(body),
                "error": None,
                "body": body
            }
    except Exception as e:
        return {
            "label": label,
            "url": url,
            "status": getattr(e, "code", 0),
            "success": False,
            "body_len": 0,
            "error": str(e),
            "body": ""
        }

print("=== STARTING FULL SCRATCHPAD TESTING ===")

# 1. Test Server Connectivity
print("[1/5] Testing Dev Servers & Backend API...")
res_5173 = test_url(f"{BASE_FRONTEND_5173}/", "Vite Server 5173")
results["server_health"].append(res_5173)

res_5174 = test_url(f"{BASE_FRONTEND_5174}/", "Vite Server 5174")
results["server_health"].append(res_5174)

res_backend = test_url(f"{BASE_BACKEND}/", "FastAPI Root")
results["server_health"].append(res_backend)

# 2. Test Frontend Routes on Primary Server (5173)
print("[2/5] Testing Frontend Routes...")
frontend_routes = [
    ("/", "Homepage / Landing Page"),
    ("/work", "Portfolio Showcase (/work)"),
    ("/contact", "Lead Intake & Contact Page (/contact)"),
    ("/admin", "Admin Login Portal (/admin)"),
    ("/admin/dashboard", "Admin Analytics Dashboard (/admin/dashboard)"),
]

for path, desc in frontend_routes:
    res = test_url(f"{BASE_FRONTEND_5173}{path}", desc)
    # Check if essential bundles and tags are in the returned HTML
    has_root = '<div id="root">' in res["body"]
    has_script = '/src/main.jsx' in res["body"]
    res["html_valid"] = has_root and has_script
    results["frontend_routes"].append(res)

# 3. Test Public Backend APIs
print("[3/5] Testing Public Backend APIs...")
public_apis = [
    ("/api/industries", "Public Industries API"),
    ("/api/services", "Public Services API"),
    ("/api/projects", "Public Projects API"),
    ("/api/clients", "Public Clients API"),
    ("/api/testimonials", "Public Testimonials API"),
    ("/api/team", "Public Team API"),
    ("/api/site-settings", "Public Studio Settings API"),
]

for path, desc in public_apis:
    res = test_url(f"{BASE_BACKEND}{path}", desc)
    try:
        data = json.loads(res["body"]) if res["body"] else None
        res["item_count"] = len(data) if isinstance(data, list) else (1 if isinstance(data, dict) else 0)
    except:
        res["item_count"] = 0
    results["backend_apis"].append(res)

# 4. Test Lead Submission API (Form Flow)
print("[4/5] Testing Lead Submission API (/api/leads)...")
lead_payload = json.dumps({
    "name": "Alex Mercer",
    "brand": "Prism Dynamics",
    "email": "alex@prism.design",
    "phone": "+1 415 555 0199",
    "businessType": "startup",
    "servicesNeeded": ["brand-strategy", "web-design-dev"],
    "budgetRange": "10k-25k",
    "timeline": "1-2-months",
    "projectDescription": "Scratchpad automated audit test submission.",
    "consent": True
}).encode('utf-8')

lead_res = test_url(
    f"{BASE_BACKEND}/api/leads",
    "Public Lead Submission",
    method="POST",
    data=lead_payload,
    headers={"Content-Type": "application/json"},
    expected_status=200
)
results["backend_apis"].append(lead_res)

# 5. Test Admin Login and Analytics Dashboard
print("[5/5] Testing Admin Authentication & Analytics Telemetry...")
login_data = urllib.parse.urlencode({"username": "admin", "password": "password"}).encode('utf-8')
login_res = test_url(
    f"{BASE_BACKEND}/api/admin/login",
    "Admin Login (OAuth2 Form)",
    method="POST",
    data=login_data,
    headers={"Content-Type": "application/x-www-form-urlencoded"}
)
results["admin_auth_flow"].append(login_res)

admin_token = None
if login_res["success"]:
    try:
        login_json = json.loads(login_res["body"])
        admin_token = login_json.get("access_token")
    except:
        pass

if admin_token:
    auth_header = {"Authorization": f"Bearer {admin_token}"}
    
    analytics_res = test_url(f"{BASE_BACKEND}/api/admin/analytics", "Admin Analytics Telemetry", headers=auth_header)
    results["pipeline_telemetry"].append(analytics_res)
    
    if analytics_res["success"]:
        analytics_data = json.loads(analytics_res["body"])
        summary = analytics_data.get("summary", {})
        stages = analytics_data.get("pipelineStages", {})
        recent_leads = analytics_data.get("recentLeads", [])
        
        print(f"   [OK] Active Pipeline: ${summary.get('pipelineValue', 0):,}")
        print(f"   [OK] Total Inquiries: {summary.get('totalLeads', 0)}")
        print(f"   [OK] Conversion Rate: {summary.get('conversionRate', 0)}%")
        print(f"   [OK] Pipeline Stages: {stages}")
        print(f"   [OK] Inquiries in Table: {len(recent_leads)}")

# Summary output
print("\n=== SCRATCHPAD TEST SUMMARY ===")
all_tests = (
    results["server_health"] +
    results["frontend_routes"] +
    results["backend_apis"] +
    results["admin_auth_flow"] +
    results["pipeline_telemetry"]
)

passed = sum(1 for t in all_tests if t["success"])
failed = sum(1 for t in all_tests if not t["success"])
print(f"TOTAL TESTS: {len(all_tests)} | PASSED: {passed} | FAILED: {failed}")

with open("scratch/test_results.json", "w") as f:
    json.dump(results, f, indent=2)

print("Results written to scratch/test_results.json")
