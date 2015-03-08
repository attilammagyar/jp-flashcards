HTML = """\
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Skritter</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta charset="utf-8" />
    <style>
    div.card {
        width: 200px;
        height: 120px;
        border: solid 2px black;
        border-radius: 7px;
        margin: 3px;
        padding: 3px;
        text-align: center;
        float: left;
        display: table;
        break-inside: avoid;
        page-break-inside: avoid;
        -webkit-column-break-inside: avoid;
    }

    div.card div.content {
        vertical-align: middle;
        display: table-cell;
    }

    div.card div.kanji_brush {
        font-family: nagayama_kai;
        font-size: 25px;
    }

    div.card div.kanji_print {
        font-family: serif;
        font-size: 17px;
    }

    div.card div.kana {
        font-family: serif;
        font-size: 12px;
    }

    div.card div.meaning {
        font-family: Verdana, sans-serif;
        font-size: 10px;
    }
    </style>
</head>
<body>
    <div id="cards">
%s
    </div>
</body>
</html>
"""

cards_html = ""

with open("skritter.txt") as f:
    cards = []

    for line in f:
        kanji, kana, meaning = line.strip().split("\t")

        if kanji != kana:
            cards.append((kanji, kana, meaning))

    cards = sorted(cards, key=lambda card: card[0])

    for kanji, kana, meaning in cards:
        cards_html += '''\
            <div class="card"><div class="content">
                <div class="kanji_brush">{kanji}</div>
                <div class="kanji_print">{kanji}</div>
                <div class="kana">{kana}</div>
                <div class="meaning">{meaning}</div>
            </div></div>\n'''.format(kanji=kanji, kana=kana, meaning=meaning)

print(HTML % cards_html)
