from fastapi import APIRouter, Depends, HTTPException, Response, status
from jose import jwt
from pydantic import BaseModel

from models import User
from routes.auth import (
    ALGORITHM,
    SECRET_KEY,
    build_response,
    get_current_user,
    hash_password,
    verify_password,
)

router = APIRouter()


class UserEntry(BaseModel):
    username: str
    password: str


@router.get("/")
async def get_user(user: User = Depends(get_current_user)):
    return {"is_admin": user.is_admin}


def get_token(username: str):
    return jwt.encode({"sub": username}, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/signup")
async def signup(user: UserEntry):
    if not user.username or not user.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required",
        )

    if await User.find_one({"username": user.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )

    hashed_password = hash_password(user.password)
    user = User(username=user.username, password=hashed_password)
    await user.insert()

    return build_response(user.username)


@router.post("/login")
async def login(user: UserEntry):
    if not user.username or not user.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required",
        )

    db_user = await User.find_one({"username": user.username})
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    hashed_password = db_user.password
    if not verify_password(user.password, hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    return build_response(user.username)


@router.post("/logout")
async def logout():
    response = Response()
    response.delete_cookie(key="access_token")
    return response
