#!/usr/bin/python3

import re
import json
import sys

from tokana import to_kana


def compile_card(card):
    english, japanese, notes = card

    return (english, to_kana(japanese), format_notes(notes))


def format_notes(notes):
    formatted = []

    for part in notes.split("{"):
        formatted_part = ""
        matches = re.match(r"^([^|}]*)\|([^}]*)\}", part)

        if matches is not None:
            kanji = to_kana(matches.group(1))
            reading = to_kana(matches.group(2))
            formatted_part += kanji + "|" + reading + "}" + part[part.find("}") + 1:]
        else:
            formatted_part += part

        formatted.append(formatted_part)

    return "{".join(formatted)



def main(argv):
    if len(argv) != 3:
        print("Usage: {} input_json_file output_json_file".format(argv[0]))

        return 1

    input_json_file = argv[1]
    output_json_file = argv[2]

    with open(input_json_file, "r") as i:
        with open(output_json_file, "w") as o:
            cards_json = i.read().strip()

            if cards_json.startswith("Flashcards.initialize("):
                cards_json = cards_json[22:]

            if cards_json.endswith(")"):
                cards_json = cards_json[:-1]

            o.write(
                "Flashcards.initialize({})".format(
                    json.dumps(
                        [compile_card(card) for card in json.loads(cards_json)],
                        indent=4
                    )
                )
            )

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
