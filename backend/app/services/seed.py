import asyncio
from app.db.mongodb import connect_db, close_db
async def seed():
    try:
        await connect_db()
        print('Indexes and non-destructive defaults are ready. No sample projects, social proof or enquiries were added.')
    finally: await close_db()
if __name__ == '__main__': asyncio.run(seed())
