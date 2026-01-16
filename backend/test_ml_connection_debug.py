
import httpx
import asyncio
import sys

async def test_connection():
    urls = ["http://localhost:8001", "http://127.0.0.1:8001"]
    for url in urls:
        print(f"Testing {url}...")
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, timeout=2.0)
                print(f"Success {url}: {resp.status_code}")
        except Exception as e:
            print(f"Failed {url}: {e}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_connection())
