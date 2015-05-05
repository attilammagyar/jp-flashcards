# turn vocab lists exported from skritter.com into printable practice sheet

HTML = """\
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Skritter</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta charset="utf-8" />
    <style>
    table.cards,
    table.cards th,
    table.cards td {
        border-collapse: collapse;
    }

    table.cards {
        margin-top: -2px;
        border: solid 2px black;
    }

    table.cards th,
    table.cards td {
        border: solid 1px black;
        font-weight: normal;
    }

    table.cards td {
        width: 1cm;
        height: 1cm;
        border-color: #ccc;
    }

    table.cards th {
        height: 1cm;
        border-right: solid 2px black;
    }

    table.cards th:nth-child(1) {
        width: 3.5cm;
    }

    table.cards th:nth-child(2) {
        width: 3.5cm;
    }

    table.cards,
    table.cards td,
    table.cards th,
    table.cards th div {
        break-inside: avoid;
        page-break-inside: avoid;
        -webkit-column-break-inside: avoid;
    }

    .brush,
    .print {
        border: solid 1px #ccc;
        padding: 0.1cm;
    }

    table.cards div {
        margin: 0.1cm;
    }

    .brush {
        font-family: nagayama_kai;
        font-size: 0.45cm;
    }

    .print {
        font-family: serif;
        font-size: 0.35cm;
    }

    .meaning {
        font-family: Verdana, sans-serif;
        font-size: 0.3cm;
        text-align: right;
    }
    </style>
</head>
<body>
    %s
</body>
</html>
"""

cards_html = ""
cells = "".join(["<td></td>" for i in range(1, 11)])

with open("skritter.txt") as f:
    cards = []

    for line in f:
        kanji, kana, meaning = line.strip().split("\t")

        if kanji != kana:
            cards.append((kanji, kana, meaning))

    for kanji, kana, meaning in cards:
        extra_rows = max(1, int((len(kanji.strip()) * 7) / 10))
        cards_html += '''\
            <table class="cards">
                <tr>
                    <th rowspan="{rowspan}">
                        <div>
                            <div><span class="brush">{kanji}</span></div>
                            <div><span class="print">{kanji}</span></div>
                            <div><span class="print">{kana}</span></div>
                        </div>
                    </th>
                    <th rowspan="{rowspan}">
                        <div class="meaning">{meaning}</div>
                    </th>
                    {cells}
                </tr>
                {rows}
            </table>
            '''.format(
                kanji=kanji,
                kana=kana,
                meaning=meaning,
                cells=cells,
                rows="</tr><tr>".join(cells for i in range(0, extra_rows)),
                rowspan=extra_rows + 1
            )

print(HTML % cards_html)
