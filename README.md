Flashcards
==========

My quick and dirty flashcards for learning Japanese.

Usage
-----

 * Practice random cards: [index.html][a]
 * Focus on the last few cards (e.g. last 15): [index.html#15][f]
 * Focus on a range of cards (e.g. 10-20): [index.html#10-20][r]
 * Focus on a selection of cards (e.g. 1st, 2nd and 4th): [index.html#1,2,4][s]
 * List all cards: [all.html][l]

  [a]: http://attilammagyar.github.io/jp-flashcards/index.html
  [f]: http://attilammagyar.github.io/jp-flashcards/index.html#15
  [r]: http://attilammagyar.github.io/jp-flashcards/index.html#10-20
  [s]: http://attilammagyar.github.io/jp-flashcards/index.html#1,2,4
  [l]: http://attilammagyar.github.io/jp-flashcards/all.html

Press a key or click anywhere to reveal the correct answer, the furigana or to
jump to the next card.

**Note**: even when some cards are selected to be focused on, a random card
from the whole deck will be shown.

Editing cards
-------------

### Bootstrap python3 environment

For easier editing, cards can be specified in *roomaji* which then is converted
according to a simple syntax into kana using a small Python3 program which
requires a little bit of setup:

    $ virtualenv -p python3 py3
    $ source py3/bin/activate
    $ pip install romkan

### Editing the cards:

    $ vim cards.raw.js      # Edit the English-Japanese pairs in the JSON
    $ ./compile.sh          # Generate cards.js from cards.raw.js

### Syntax:

The following conversions are applied to the Japanese parts of `cards.raw.js`:

    roomaji         --> hiragana
    _roomaji_       --> katakana
    {kanji|roomaji} --> kanji with furigana

Example `cards.raw.js`:

    [
     [
      "I'm going to the supermarket with my son.",
      "musuko to _suupaa_ ni ikimasu."
     ],
     [
      "If you study every day, your Japanese will get skilled.",
      "{毎日|mai nichi} benkyou suru to {日本語|nihongo} ga jouzu ni narimasu."
     ]
    ]
