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
async def get_protected_items(
    user: User = Security(get_admin_user),
) -> list[ItemResponse]:
    items = await Item.find(
        {"_id": {"$nin": user.checked_ids}}, with_children=True
    ).to_list()
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
async def approve_item(
    id: str, approval: Approval, user: User = Security(get_admin_user)
):
    item = await Item.get(id, with_children=True)
    item.moderator_responses.append(approval.approve)
    await item.save()

    # add id to user's checked_ids
    user.checked_ids.append(item.id)
    await user.save()
