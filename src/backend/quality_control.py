import random

from utils import dump_data, read_data


def judge_data(_):
    if random.random() < 0.5:
        score = random.randint(1, 10)
        return "approved", score
    else:
        return "rejected", None


moderations = []  # imagine this is a list of moderators

moderations.append(lambda is_fact: judge_data(is_fact))  # currently just random
moderations.append(lambda is_fact: judge_data(is_fact))  # currently just random


def quality_control(data):
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


def main():
    sample_facts = read_data("sample_facts.txt")
    sample_fiction = read_data("sample_fiction.txt")
    data = [(True, fact) for fact in sample_facts] + [
        (False, fiction) for fiction in sample_fiction
    ]

    res = quality_control(data)
    dump_data(res, "sample_qc_output.json")


if __name__ == "__main__":
    main()
