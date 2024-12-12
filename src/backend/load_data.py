import asyncio
import math

import pandas as pd
from tqdm import tqdm

from main import db_lifespan
from models import Fact, Fiction


async def load_data_into_db(filepath):
    lifespan = db_lifespan(None)
    await anext(lifespan)

    data = pd.read_csv(
        filepath,
        sep="|",
        converters={
            "Answer.factSource": lambda x: x.strip("[]").replace("'", "").split(", "),
            "Answer.is_fact.fact": lambda x: x.strip("[]").replace("'", "").split(", "),
            "Answer.is_myth.myth": lambda x: x.strip("[]").replace("'", "").split(", "),
        },
    )
    data["Answer.factSource"] = data["Answer.factSource"].apply(
        lambda x: [] if x == [""] else x
    )
    data["Answer.is_fact.fact"] = data["Answer.is_fact.fact"].apply(
        lambda x: [] if x == [""] else x
    )
    data["Answer.is_myth.myth"] = data["Answer.is_myth.myth"].apply(
        lambda x: [] if x == [""] else x
    )

    # iterate through each row
    for _, row in tqdm(list(data.iterrows())):
        content = row["Answer.sentence"]
        rating = float(row["Answer.interest"])
        rating = 0 if math.isnan(rating) else rating
        if row["Answer.Fact.fact"]:
            moderator_responses = row["Answer.is_fact.fact"]
            sources = list(row["Answer.factSource"])
            item = Fact(
                content=content,
                rating=rating,
                is_fact=True,
                moderator_responses=moderator_responses,
                sources=sources,
            )
        else:
            moderator_responses = row["Answer.is_myth.myth"]
            ai_generated = type(row["Answer.aiName"]) == str
            if type(row["Answer.aiName"]) != str:
                ai_generated = False
            else:
                lower = row["Answer.aiName"].lower()
                if (
                    "chatgpt" not in lower
                    and "chatpgt" not in lower
                    and "claude" not in lower
                    and "gemini" not in lower
                ):
                    ai_generated = False
                else:
                    ai_generated = True
            item = Fiction(
                content=content,
                rating=rating,
                is_fact=False,
                moderator_responses=moderator_responses,
                ai_generated=ai_generated,
            )

        await item.insert()


if __name__ == "__main__":
    import sys

    if len(sys.argv) == 2:
        filepath = sys.argv[1]
    else:
        filepath = input("Enter the path to the data file: ")

    asyncio.run(load_data_into_db(filepath))
