import os

from beanie import init_beanie
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
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
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


api_router = APIRouter()

api_router.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(
    leaderboard.router,
    prefix="/leaderboard",
    tags=["leaderboard"],
)
api_router.include_router(
    items.router,
    prefix="/items",
    tags=["items"],
)
api_router.include_router(
    protected.router,
    prefix="/protected",
    tags=["protected"],
)

app.include_router(api_router, prefix="/api", tags=["api"])

app.mount("/static", StaticFiles(directory="frontend/static"), name="static")
templates = Jinja2Templates(directory="frontend")


@app.get("/{full_path:path}")
async def index(request: Request, full_path: str):
    return templates.TemplateResponse("index.html", {"request": request})
