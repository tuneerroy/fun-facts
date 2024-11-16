from fastapi import APIRouter, Security
from pydantic import BaseModel

from models import Item, User
from routes.auth import get_admin_user

router = APIRouter()


class ItemResponse(BaseModel):
    id: str
    content: str
    is_fact: bool


@router.get("/items")
async def get_protected_items(_: User = Security(get_admin_user)) -> list[ItemResponse]:
    items = await Item.find({"is_approved": False}, with_children=True).to_list()
    items = [
        ItemResponse(id=str(item.id), content=item.content, is_fact=item.is_fact)
        for item in items
    ]
    return items


class Approval(BaseModel):
    approve: bool


# TODO: shouldn't be a bool
# should be undecided vs. approved vs. rejected
@router.post("/items/{id}")
async def approve_item(id: str, approval: Approval, _: User = Security(get_admin_user)):
    item = await Item.get(id, with_children=True)
    item.is_approved = approval.approve
    await item.save()
