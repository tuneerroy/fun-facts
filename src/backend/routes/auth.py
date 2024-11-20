from fastapi import HTTPException, Request, Response, status
from jose import JWTError, jwt

from models import User
import bcrypt


SECRET_KEY = "crowdsourcing"
ALGORITHM = "HS256"


async def get_current_user(request: Request):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # cut off the "Bearer " prefix
        token = token.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )

        user = await User.find_one({"username": username})
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
            )
        return user

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )


async def get_admin_user(request: Request):
    user = await get_current_user(request)
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )
    return user


def get_token(username: str):
    return jwt.encode({"sub": username}, SECRET_KEY, algorithm=ALGORITHM)


def build_response(username: str):
    token = get_token(username)
    response = Response()
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        samesite="Lax",
        secure=False,
    )
    return response


def hash_password(password):
    pwd_utf8 = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_utf8, salt)


def verify_password(plain_password, hashed_password):
    password_utf8 = plain_password.encode("utf-8")
    hashed_password_utf8 = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_utf8, hashed_password_utf8)
