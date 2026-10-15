"""Create or reset the admin account directly in MongoDB.

Run from the backend folder:
    python -m app.set_admin
It asks for an email and password, then makes that account an admin with that
password. Use it when the /admin login says the credentials are invalid.
"""
import asyncio
import getpass
from datetime import datetime
from app.core.config import settings
from app.core.database import connect_db, disconnect_db
from app.core.security import hash_password
from app.models.user import User, UserRole


async def main() -> None:
    print(f"Database: {settings.MONGODB_URI} / {settings.MONGODB_DB}")
    email = input("Admin email: ").strip()
    password = getpass.getpass("New password (typing is hidden): ")
    if not email or not password:
        print("Email and password are both required.")
        return
    if password != getpass.getpass("Repeat password: "):
        print("Passwords do not match.")
        return
    await connect_db()
    try:
        user = await User.find_one({"email": {"$regex": f"^{__import__('re').escape(email)}$", "$options": "i"}})
        if user:
            user.role = UserRole.admin
            user.password_hash = hash_password(password)
            user.is_verified = True
            user.updated_at = datetime.utcnow()
            await user.save()
            print(f"Updated {user.email}: now an admin with the new password.")
        else:
            await User(name=settings.ADMIN_NAME, email=email, password_hash=hash_password(password),
                       role=UserRole.admin, is_verified=True).insert()
            print(f"Created admin account {email}.")
        print("Sign in at /admin with this email and password.")
    finally:
        await disconnect_db()


if __name__ == "__main__":
    asyncio.run(main())
