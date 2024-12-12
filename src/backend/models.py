from typing import Self

from beanie import Document, PydanticObjectId
from pydantic import model_validator


class Item(Document):
    content: str
    rating: float = 0
    is_fact: bool
    is_approved: bool = False
    moderator_responses: list[bool] = []

    @model_validator(mode="after")
    def set_is_approved(self) -> Self:
        self.is_approved = (
            sum(self.moderator_responses) > len(self.moderator_responses) / 2
        )
        return self

    class Settings:
        is_root = True
        validate_on_save = True


class Fact(Item):
    is_fact: bool = True
    sources: list[str] = []


class Fiction(Item):
    is_fact: bool = False
    ai_generated: bool


class User(Document):
    username: str
    password: str
    rating: int = 0
    is_admin: bool = False
    checked_ids: list[PydanticObjectId] = []
