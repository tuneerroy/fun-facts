import random

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from models import Fact, Fiction, Item, User
from routes.auth import get_current_user

router = APIRouter()


class FactFictonResponse(BaseModel):
    id: str
    content: str


@router.get("/random")
async def get_random_item() -> FactFictonResponse:
    items = await Item.find({"is_approved": True}, with_children=True).to_list()
    if not items:
        print("WTF")
        raise HTTPException(status_code=404, detail="No items found")
    item = random.choice(items)
    return FactFictonResponse(id=str(item.id), content=item.content)


class ItemEntry(BaseModel):
    type: str
    content: str
    sources: list[str]


@router.post("/")
async def post_item(
    item: ItemEntry,
    _: User = Depends(get_current_user),  # just make sure the user is logged in
):
    content = item.content
    sources = item.sources
    if item.type != "fact" and item.type != "fiction":
        raise HTTPException(
            status_code=400, detail="Invalid type: must be 'fact' or 'fiction'"
        )

    sources = [source.strip() for source in sources]
    sources = [source for source in sources if source]
    if item.type == "fact" and not sources:
        raise HTTPException(status_code=400, detail="Sources are required for facts")

    # check for duplicates
    if await Item.find_one({"content": content}, with_children=True):
        raise HTTPException(status_code=400, detail="Item already exists")

    if item.type == "fact":
        item = Fact(content=content, sources=sources)
    else:
        item = Fiction(content=content, ai_generated=False)

    await item.insert()
    # intentionally don't return the item id
    return {"success": True}


class Guess(BaseModel):
    guess: str
    ai_generated: bool | None


@router.post("/{id}")
async def post_guess(id: str, guess: Guess, user: User = Depends(get_current_user)):
    item = await Item.get(id, with_children=True)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    if isinstance(item, Fact):
        user.rating += 1 if guess.guess == "fact" else -1
    elif isinstance(item, Fiction):
        user.rating += 1 if guess.guess == "fiction" else -1
        if guess.ai_generated == item.ai_generated:
            user.rating += 1
    else:
        raise HTTPException(status_code=500, detail="Unknown item type")

    await user.save()
    return {"success": True}
