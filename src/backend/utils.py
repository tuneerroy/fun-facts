import json


def read_data(filename):
    res = []
    with open(filename, "r") as f:
        for line in f:
            value = line.strip()
            res.append(value)
    return res


def dump_data(data, filename):
    with open(filename, "w") as f:
        json.dump(data, f)
