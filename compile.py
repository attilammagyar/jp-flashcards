#!/usr/bin/python3

import json

from tokana import to_kana


if __name__ == "__main__":
    with open("cards.raw.js", "r") as f:
        with open("cards.js", "w") as o:
            o.write(
                "Flashcards.initialize({})".format(
                    json.dumps(
                        [[question, to_kana(answer)] for question, answer in json.loads(f.read())]
                    )
                )
            )
