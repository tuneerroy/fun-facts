def judge_data(fact_or_fiction):
    if fact_or_fiction == "fact":
        return "approved", 10
    else:
        return "rejected", None


moderations = []  # imagine this is a list of moderators


def quality_contorl(data):
    res = []
    for is_fact, value in data:
        approval_and_scores = []
        for moderator in moderations:
            approval, score = moderator(is_fact)
            approval_and_scores.append((approval, score))

        res.append(
            {
                "is_fact": is_fact,
                "value": value,
                "approvals_and_scores": approval_and_scores,
            }
        )
    return res


def significant_majority_vote(data, threshold=0.5):
    approved = 0
    total_score = 0
    for item in data:
        approval, score = item
        if approval == "approved":
            approved += 1
            total_score += score
    return approved / len(data) > threshold, (
        (total_score / approved) if approved > 0 else 0
    )


def filter_for_approved_data(data):
    res = []
    for item in data:
        is_approved, score = significant_majority_vote(item["approvals_and_scores"])
        if is_approved:
            res.append(
                {
                    "is_fact": item["is_fact"],
                    "value": item["value"],
                    "score": score,
                }
            )
    return res


def aggregation(data):
    approved_data = filter_for_approved_data(data)
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
