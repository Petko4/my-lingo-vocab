from datetime import datetime, timezone

from app.dependencies import get_db
from app.models.token_model import RefreshToken


async def cleanup_expired_tokens():
    db = next(get_db())
    try:
        db.query(RefreshToken).filter(
            (RefreshToken.expires_at < datetime.now(timezone.utc)) |
            (RefreshToken.revoked == True)
        ).delete()
        db.commit()
    except Exception as e:
        print(f"Error during token cleanup: {e}")
