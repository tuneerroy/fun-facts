from fastapi import APIRouter, HTTPException, Security
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
    rating: int | None = None


# TODO: shouldn't be a bool
# should be undecided vs. approved vs. rejected
@router.post("/items/{id}")
async def approve_item(
    id: str, approval: Approval, user: User = Security(get_admin_user)
):
    if approval.approve and approval.rating is None:
        raise HTTPException(status_code=400, detail="Rating is required for approval")

    # update item rating if provided
    item = await Item.get(id, with_children=True)
    item.moderator_responses.append(approval.approve)

    if approval.approve:
        # rolling average
        number_approvals = sum(item.moderator_responses) - 1
        item.rating = (item.rating * number_approvals + approval.rating) / (
            number_approvals + 1
        )

    await item.save()

    # add id to user's checked_ids
    user.checked_ids.append(item.id)
    await user.save()
