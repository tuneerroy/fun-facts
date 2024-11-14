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
