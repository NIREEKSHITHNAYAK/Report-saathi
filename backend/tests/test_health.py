from app.main import health_check

def test_health():
    res = health_check()
    assert res.status == "ok"
    assert "ReportSaathi" in res.app
    print("Health check function passed:", res.model_dump())

if __name__ == "__main__":
    test_health()
