
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from contextlib import asynccontextmanager

from app.routers import auth_router, vocabulary_router
from app.core.database import Base, engine
from app.tasks import cleanup_expired_tokens


def init_db():
    Base.metadata.create_all(bind=engine)


scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(
        cleanup_expired_tokens,
        CronTrigger(
            hour=0,
            minute=0,
            timezone="UTC"
        ),
        id="cleanup_tokens",
        name="Cleanup expired refresh token",
        replace_existing=True
    )
    await cleanup_expired_tokens()

    scheduler.start()

    yield

    scheduler.shutdown()

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

app = FastAPI(lifespan=lifespan, debug=True, redirect_slashes=False)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router.router)
app.include_router(vocabulary_router.router)

init_db()

# cleanup revoked token on start
