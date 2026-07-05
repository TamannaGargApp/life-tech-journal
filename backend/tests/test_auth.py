import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


@pytest.mark.asyncio
async def test_health(client):
    r = await client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_register_missing_fields(client):
    r = await client.post("/api/v1/auth/register", json={"email": "test@test.com"})
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_login_wrong_credentials(client):
    r = await client.post("/api/v1/auth/login", json={"email": "x@x.com", "password": "Password1"})
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_articles_list_public(client):
    r = await client.get("/api/v1/articles")
    assert r.status_code == 200


@pytest.mark.asyncio
async def test_create_article_unauthorized(client):
    r = await client.post("/api/v1/articles", json={"title": "Test"})
    assert r.status_code == 401
