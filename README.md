Flashcards
==========

My quick and dirty flashcards for my recently started Japanese studies.

Bootstrap
---------

    $ virtualenv -p python3 py3
    $ source py3/bin/activate
    $ pip install romkan

Editing cards
-------------

    $ vim cards.raw.js      # Edit the English-Japanese pairs in the JSON
    $ ./compile.sh          # Generate cards.js from cards.raw.js

The following conversions are applied to the Japanese parts of `cards.raw.js`:

    roomaji         --> hiragana
    _roomaji_       --> katakana
    {kanji|roomaji} --> kanji with furigana
