import websockets
import asyncio

async def handler(websocket):
    print(dir(websocket))
    while True:
        async for message in websocket:
            print(message)
            await websocket.send("OK")


async def main():
    async with websockets.serve(handler, "", 9999):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
