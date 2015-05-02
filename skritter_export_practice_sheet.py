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
        width: 4cm;
    }

    table.cards th:nth-child(2) {
        width: 3cm;
    }

    table.cards,
    table.cards tbody,
    table.cards td,
    table.cards th,
    table.cards th div {
        break-inside: avoid;
        page-break-inside: avoid;
        -webkit-column-break-inside: avoid;
    }

    table.cards tbody {
        border: solid 2px black;
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
        font-size: 0.35cm;
    }

    .print {
        font-family: serif;
        font-size: 0.25cm;
    }

    .meaning {
        font-family: Verdana, sans-serif;
        font-size: 0.25cm;
        text-align: right;
    }
    </style>
</head>
<body>
    <table class="cards">
%s
    </table>
</body>
</html>
"""

cards_html = ""
cells = "".join(["<td></td>" for i in range(1, 11)])

with open("skritter.txt") as f:
    cards = []
    count = 0

    for line in f:
        kanji, kana, meaning = line.strip().split("\t")

        if kanji != kana:
            cards.append((kanji, kana, meaning))

    for kanji, kana, meaning in cards:
        count += 1
        cards_html += '''\
            <tbody>
                <tr>
                    <th rowspan="2">
                        <div>
                            <div><span class="brush">{kanji}</span></div>
                            <div><span class="print">{kanji}</span></div>
                            <div><span class="print">{kana}</span></div>
                        </div>
                    </th>
                    <th rowspan="2">
                        <div class="meaning">{meaning}</div>
                    </th>
                    {cells}
                </tr>
                <tr>{cells}</tr>
            </tbody>
            '''.format(kanji=kanji, kana=kana, meaning=meaning, cells=cells)

        if count % 10 == 0:
            cards_html += "</table><table class=\"cards\">"

print(HTML % cards_html)
