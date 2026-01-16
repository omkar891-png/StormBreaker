import httpx
import asyncio

async def test_ml():
    url = "http://127.0.0.1:8001"
    print(f"Testing connection to {url}...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=5.0)
            print(f"Status: {response.status_code}")
            print(f"Body: {response.json()}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_ml())
