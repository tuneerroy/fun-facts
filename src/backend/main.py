import os

from beanie import init_beanie
from dotenv import load_dotenv
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from models import Fact, Fiction, Item, User
from routes import accounts, items, leaderboard, protected

load_dotenv()


async def db_lifespan(_: FastAPI):
    CONNECTION_STRING = os.environ["MONGODB_URI"]
    client = AsyncIOMotorClient(CONNECTION_STRING)
    database = client["database"]
    await init_beanie(database=database, document_models=[User, Item, Fact, Fiction])
    yield

    client.close()


app: FastAPI = FastAPI(lifespan=db_lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "ok"}


app.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
app.include_router(
    leaderboard.router,
    prefix="/leaderboard",
    tags=["leaderboard"],
)
app.include_router(
    items.router,
    prefix="/items",
    tags=["items"],
)
app.include_router(
    protected.router,
    prefix="/protected",
    tags=["protected"],
    dependencies=[Depends(accounts.get_current_user)],
)
