Flashcards
==========

My quick and dirty flashcards app for learning Japanese.

(Sorry for the ugly code, most of it was just hacked together in a weekend.)

Usage
-----

 * Practice random cards: [index.html][a]
 * Focus on the last few cards (e.g. last 15): [index.html#15][f]
 * Focus on a range of cards (e.g. 10-20): [index.html#10-20][r]
 * Focus on a selection of cards (e.g. 1st, 2nd and 4th): [index.html#1,2,4][s]
 * Continue from where you have left last time, using the hash code that the
   app generated (e.g. `#!.3a,9,z2.149/A2`): [index.html#!.3a,9,z2.149/A2][h]
 * List all cards: [all.html][l]

  [a]: http://attilammagyar.github.io/jp-flashcards/index.html
  [f]: http://attilammagyar.github.io/jp-flashcards/index.html#15
  [r]: http://attilammagyar.github.io/jp-flashcards/index.html#10-20
  [s]: http://attilammagyar.github.io/jp-flashcards/index.html#1,2,4
  [h]: http://attilammagyar.github.io/jp-flashcards/index.html#!.3a,9,z2.149/A2
  [l]: http://attilammagyar.github.io/jp-flashcards/all.html

Click anywhere to reveal the correct answer, the furigana, to rate your answer
to the current card, or to jump to the next card. If you rate your answer
*Bad!* then the card will be added to the focus group of cards. To remove a
card from the focus group, rate your answer *Good!*. If the answer to a focused
card is rated *Better!*, then it is counted as a good answer, but the card is
kept in the focus group. The more cards in the focus group, the better the
chance to get one from them.

You may use the app with my cards online from GitHub using the above links, or
download it to your phone, tablet, or any device that can run a modern browser,
and then customize the cards or use it offline.

You can start learning on one of your device, and continue on another using the
hash codes that are displayed after each card.

**Note**: even when some cards are selected to be focused on, a random card
from the whole deck will be shown from time to time.

Editing cards
-------------

### Obtain the source code

Download it as a ZIP file from
[https://github.com/attilammagyar/jp-flashcards][g] or use the following
command on a typical Linux/Unix system:

  [g]: https://github.com/attilammagyar/jp-flashcards

    $ git clone https://github.com/attilammagyar/jp-flashcards.git

### Edit `cards.roomaji.js` or `cards.js`

For easier editing, cards can be specified in *roomaji* which then can be
converted according to a simple syntax into kana using a small Python3 program
which unfortunately requires a little bit of setup. This is not so complicated
on a typical Linux/Unix system, but anyways, if you don't feel like it, you may
simply edit `cards.js` directly.

#### Editing `cards.js`

The cards must be specified in the following format:

    Flashcards.initialize([
        ["English text #1",     "Japanese translation #1",      "notes #1"],
        ["English text #2",     "Japanese translation #2",      "notes #2"],
        ["meaning",             "{kanji|readings}",             "notes #3"],
        ...
        ["English text #..." ,  "Japanese translation #...",    "notes #..."]
    ])

To create kanji with furigana, use the following format anywhere inside the
Japanese translation or the notes, once or more:

    {kanji characters|furigana}

Example `cards.js`:

    Flashcards.initialize([
     [
      "I'm going to the supermarket with my son.",
      "むすことスーパーにいきます。",
      ""
     ],
     [
      "If you study every day, your Japanese will get skilled.",
      "{毎日|まいにち}べんきょうすると{日本語|にほんご}がじょうずになります。",
      "A-dictionary-form とB = if A then B"
     ]
    ])

#### Editing `cards.roomaji.js`

##### Bootstrap python3 environment

Bootstrap using `virtualenv` on a typical Linux/Unix system:

    $ virtualenv -p python3 py3
    $ source py3/bin/activate
    $ pip install romkan

##### Editing `cards.roomaji.js` and generating `cards.js`:

    $ vim cards.roomaji.js  # Edit the English-Japanese pairs in the JSON
    $ ./compile.sh          # Generate cards.js from cards.roomaji.js

##### Syntax:

The following conversions are applied to the Japanese parts of the cards:

    roomaji         --> hiragana            # done by compile.sh
    _roomaji_       --> katakana            # done by compile.sh
    {kanji|roomaji} --> kanji + furigana    # done by flashcards.js

Additionally, `{roomaji kanji roomaji|roomaji}` is also converted if appears
inside the notes.

The cards must be specified in the following format in `cards.roomaji.js`:

    Flashcards.initialize([
      ["English text #1",    "Japanese in roomaji #1",      "notes #1"],
      ["English text #2",    "Japanese in roomaji #2",      "notes #2"],
      ["meaning",            "{kanji|readings in roomaji}", "notes #3"],
      ...
      ["English text #..." , "Japanese in roomaji #...",    "notes #..."]
    ])

Example `cards.roomaji.js`:

    Flashcards.initialize([
     [
      "I'm going to the supermarket with my son.",
      "musuko to _suupaa_ ni ikimasu.",
      ""
     ],
     [
      "If you study every day, your Japanese will get skilled.",
      "{毎日|mai nichi} benkyou suru to {日本語|nihongo} ga jouzuni narimasu.",
      "A-dictionary-form とB = if A then B"
     ]
    ])
