#!/usr/bin/python3

import re
import json

from tokana import to_kana


def compile_card(card):
    english, japanese = card

    return (english, compile_furigana(to_kana(japanese)))


def compile_furigana(text):
    return re.sub(
        r"\{([^|}]*)\|([^}]*)\}",
        "<ruby>\\1<rt>\\2</rt></ruby>",
        text
    )


if __name__ == "__main__":
    with open("cards.raw.js", "r") as f:
        with open("cards.js", "w") as o:
            o.write(
                "Flashcards.initialize({})".format(
                    json.dumps(
                        [compile_card(card) for card in json.loads(f.read())]
                    )
                )
            )
