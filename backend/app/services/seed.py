"""
Seed script — populates the database with canonical records for GrowthWay.
Run: python -m app.services.seed
"""

import asyncio
from app.db.mongodb import connect_db, get_db, close_db
from app.db.seeds import seed_database


async def seed():
    await connect_db()
    db = get_db()
    print("[*] Running database seed...")
    result = await seed_database(db, force=True)
    print("[OK] Seed completed successfully:")
    for key, count in result["counts"].items():
        print(f"  + {key}: {count} records")
    if result["indexes_verified"]:
        print("  + Database indexes verified")
    await close_db()
    print("\n[OK] Ready for deployment!")


if __name__ == "__main__":
    asyncio.run(seed())
