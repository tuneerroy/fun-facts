def judge_data(fact_or_fiction):
    if fact_or_fiction == "fact":
        return "approved", 10
    else:
        return "rejected", None


def quality_contorl(data):
    res = []
    for is_fact, value in data:
        approval, score = judge_data(is_fact)
        res.append(
            {"is_fact": is_fact, "value": value, "approval": approval, "score": score}
        )
    return res


def aggregation(data):
    approved_data = [item for item in data if item["approval"] == "approved"]
    facts = [
        {"fact": item["value"], "score": item["score"]}
        for item in approved_data
        if item["is_fact"]
    ]
    fiction = [
        {"fiction": item["value"], "score": item["score"]}
        for item in approved_data
        if not item["is_fact"]
    ]
    return {
        "facts": facts,
        "fiction": fiction,
    }
