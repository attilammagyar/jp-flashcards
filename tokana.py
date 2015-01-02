import romkan
import unittest


def to_kana(text):
    formatted = ""
    text = text.strip()
    conversions = [romkan.to_hiragana, romkan.to_katakana]
    kana_type = 0

    for part in text.split("_"):
        conversion = conversions[kana_type]

        if conversion == romkan.to_katakana:
            part = (
                part.replace("aa", "aー")
                    .replace("ii", "iー")
                    .replace("uu", "uー")
                    .replace("ee", "eー")
                    .replace("oo", "oー")
                    .replace(" ", "・")
            )
        else:
            part = part.replace(" wa ", " ha ").replace(" wa,", " ha,")

        formatted += conversion(part).replace(" ", "")
        kana_type = kana_type ^ 1

    return formatted.replace(",", "、").replace(".", "。")


class _TestToKana(unittest.TestCase):
    def test_to_kana(self):
        self.assertEqual(
            "ごしゅっしんはどこですか。",
            to_kana("goshusshin wa doko desu ka.")
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
            "じつは、わたしはスポーツをみませんし、しません。",
            to_kana(
                "jitsu wa, watashi wa _supootsu_ wo mimasen shi, shimasen."
            )
        )


if __name__ == "__main__":
    unittest.main()
