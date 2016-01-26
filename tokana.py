import sys
import re
import romkan
import unittest


def to_kana(text):
    formatted = ""
    text = text.strip()
    is_katakana = False
    is_roman = False

    for part in re.split("([_*])", text):
        if part == "_":
            is_katakana = not is_katakana
            continue

        if part == "*":
            is_roman = not is_roman
            continue

        conversion = romkan.to_hiragana

        if is_roman:
            conversion = lambda s: s

        elif is_katakana:
            conversion = romkan.to_katakana
            part = (
                part.replace("aa", "aー")
                    .replace("ii", "iー")
                    .replace("uu", "uー")
                    .replace("ee", "eー")
                    .replace("oo", "oー")
                    .replace(" ", "・")
            )

        else:
            part = (
                part.replace(" wa ", " ha ")
                    .replace(" wa,", " ha,")
                    .replace(" wa?", " ha?")
            )

        formatted += conversion(part).replace(" ", "")

    return formatted.replace(",", "、").replace("...", "…").replace(".", "。").replace("?", "？")


class _TestToKana(unittest.TestCase):
    def test_to_kana(self):
        self.assertEqual(
            "ごしゅっしんはどこですか。",
            to_kana("goshusshin wa doko desu ka.")
        )
        self.assertEqual(
            "ごしゅっしんはどこ？",
            to_kana("goshusshin wa doko?")
        )
        self.assertEqual(
            "きょうはクロード・モネのてんらんかいです。",
            to_kana("kyou wa _kuroodo mone_ no tenrankai desu.")
        )
        self.assertEqual(
            "わたしはコーヒーをのみます、それからわたしたちはいっしょ"
            "にロマンチックなえいがをみます。",
            to_kana(
                "watashi wa _koohii_ wo nomimasu, "
                "sorekara watashitachi wa isshoni _romanchikku_ na "
                "eiga wo mimasu."
            )
        )
        self.assertEqual(
            "じつは、わたしはスポーツをみませんし、しません…",
            to_kana(
                "jitsu wa, watashi wa _supootsu_ wo mimasen shi, shimasen..."
            )
        )
        self.assertEqual(
            "ニュー・ジーランド",
            to_kana("_nyuu jiirando_")
        )
        self.assertEqual(
            "コンピューターでeメールをだします",
            to_kana("_konpyuutaa_ de *e*_meeru_ wo dashimasu")
        )
        self.assertEqual("ほかには？", to_kana("hoka ni wa?"))


if __name__ == "__main__":
    unittest.main()
#    if len(sys.argv) > 1 and sys.argv[1] == "--test":
#        unittest.main()
#    else:
#        for line in sys.stdin:
#            print(to_kana(line))
