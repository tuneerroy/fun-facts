from fastapi import APIRouter, Depends

from models import User
from routes.auth import get_current_user

router = APIRouter()


@router.get("/")
async def get_leaderboard(_: User = Depends(get_current_user)):
    # TODO: show user rankings
    # get top 10
    users = await User.find().sort("-rating").limit(10).to_list()
    return [{"username": user.username, "rating": user.rating} for user in users]
