from beanie import Document


class User(Document):
    username: str
    password: str
    rating: int = 0
    is_admin: bool = False


class Item(Document):
    content: str
    rating: int = 0
    is_fact: bool
    is_approved: bool = False
    moderator_responses: list[bool] = []

    class Settings:
        is_root = True


class Fact(Item):
    is_fact: bool = True
    sources: list[str] = []


class Fiction(Item):
    is_fact: bool = False
    ai_generated: bool
