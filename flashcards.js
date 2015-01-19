(function() {

    // Sorry for the ugly code, most of it was just hacked together in a weekend.

    var Flashcards, $;

    $ = function (id)
    {
        return document.getElementById(id);
    };

    Flashcards = {
        cards: [],
        shuffled_card_indices: [],
        focus: [],
        shuffled_focus: [],
        state: function () {},
        current_card_index: 0,
        all: 0,
        bad: 0,
        digits: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@/",

        random: function (min, max)
        {
            return min + Math.floor(Math.random() * (max - min));
        },

        generateNextCardIndex: function ()
        {
            var fc = Flashcards,
                current_card, next_card;

            next_card = current_card = fc.current_card_index;

            if (fc.shouldChooseFromAll()) {
                next_card = fc.shuffled_card_indices.shift();

                if (fc.shuffled_card_indices.length == 0) {
                    Flashcards.shuffleCards();
                }
            } else {
                next_card = fc.shuffled_focus.shift();

                if (fc.shuffled_focus.length == 0) {
                    Flashcards.shuffleFocus();
                }
            }

            return next_card;
        },

        shouldChooseFromAll: function ()
        {
            var x = Flashcards.focus.length,
                tolerance, focus_probability;

            if (x === 0) {
                return true;
            }

            tolerance = (Flashcards.cards.length / 50) + 1;
            focus_probability = 0.15 + 0.75 * (x / (x + tolerance));

            return Math.random() > focus_probability;
        },

        states: {
            firstQuestion: function ()
            {
                Flashcards.states.question();
            },

            subsequentialQuestion: function()
            {
                Flashcards.all++;
                Flashcards.states.question();
            },

            question: function ()
            {
                Flashcards.hideAnswer();
                Flashcards.hideRateForm();
                Flashcards.updateInfo();
                Flashcards.current_card_index = Flashcards.generateNextCardIndex();

                if (Math.random() > 0.5) {
                    Flashcards.states.japaneseQuestion();
                } else {
                    Flashcards.states.englishQuestion();
                }
            },

            japaneseQuestion: function ()
            {
                var i = Flashcards.current_card_index,
                    question = Flashcards.cards[i][1],
                    answer = Flashcards.cards[i][0],
                    notes = Flashcards.cards[i][2];

                Flashcards.showQuestion(question, answer, notes);

                Flashcards.nextState(
                    Flashcards.hasFurigana()
                        ? Flashcards.states.japaneseQuestionFurigana
                        : Flashcards.states.englishAnswer
                );
            },

            japaneseQuestionFurigana: function ()
            {
                Flashcards.showFurigana();
                Flashcards.nextState(Flashcards.states.englishAnswer);
            },

            englishAnswer: function ()
            {
                Flashcards.showAnswer();
                Flashcards.nextState(Flashcards.states.rate);
            },

            englishQuestion: function ()
            {
                var i = Flashcards.current_card_index,
                    question = Flashcards.cards[i][0],
                    answer = Flashcards.cards[i][1],
                    notes = Flashcards.cards[i][2];

                Flashcards.showQuestion(question, answer, notes);
                Flashcards.nextState(Flashcards.states.japaneseAnswer);
            },

            japaneseAnswer: function()
            {
                Flashcards.showAnswer();
                Flashcards.nextState(
                    Flashcards.hasFurigana()
                        ? Flashcards.states.japaneseAnswerFurigana
                        : Flashcards.states.rate
                );
            },

            japaneseAnswerFurigana: function()
            {
                Flashcards.showFurigana();
                Flashcards.nextState(Flashcards.states.rate);
            },

            rate: function ()
            {
                Flashcards.showRateForm();
                Flashcards.nextState(Flashcards.states.subsequentialQuestion);
            }
        },

        initialize: function (cards)
        {
            var body = document.getElementsByTagName("body")[0],
                focus = String(window.location.href).match(/#(.*)$/),
                matches;

            Flashcards.cards = Flashcards.formatFuriganaInCards(cards);
            Flashcards.shuffleCards();
            Flashcards.nextState(Flashcards.states.firstQuestion);

            if (focus) {
                Flashcards.parseFocus(focus[1]);
                Flashcards.shuffleFocus();
            }

            $("card").onclick = Flashcards.moveToNextState;
            $("rate-bad-add-to-focus").onclick = Flashcards.rateBadAddToFocus;
            $("rate-good-add-to-focus").onclick = Flashcards.rateGoodAddToFocus;
            $("rate-skip").onclick = Flashcards.rateSkip;
            $("rate-remove-from-focus").onclick = Flashcards.rateRemoveFromFocus;
            $("extend-focus").onclick = Flashcards.extendFocus;
            $("cont-input").onclick = function () { $("cont-input").select(); };
            $("rate").onsubmit = function () { return false; };

            Flashcards.moveToNextState();
        },

        shuffleCards: function ()
        {
            Flashcards.shuffled_card_indices = Flashcards.shuffleArray(
                Flashcards.closedRange(0, Flashcards.cards.length - 1)
            );
        },

        shuffleFocus: function ()
        {
            Flashcards.shuffled_focus = Flashcards.shuffleArray(Flashcards.focus);
        },

        shuffleArray: function (original_array)
        {
            var shuffled = [],
                i, j, l;

            // Fisher–Yates shuffle, inside-out

            for (i = 0, l = original_array.length; i < l; ++i) {
                j = Flashcards.random(0, i + 1);

                if (i !== j) {
                    shuffled[i] = shuffled[j];
                }

                shuffled[j] = original_array[i];
            }

            return shuffled;
        },

        formatFuriganaInCards: function (cards)
        {
            var formatted = [],
                i, l, en, jp, notes;

            for (i = 0, l = cards.length; i < l; ++i) {
                en = cards[i][0];
                jp = Flashcards.formatFurigana(cards[i][1]);
                notes = Flashcards.formatFurigana(cards[i][2]);
                formatted.push([en, jp, notes]);
            }

            return formatted;
        },

        formatFurigana: function (text)
        {
            return text.replace(
                /\{([^|}]*)\|([^}]*)\}/g,
                "<ruby>$1<rt>$2</rt></ruby>"
            );
        },

        parseFocus: function (focus_str)
        {
            var count = Flashcards.cards.length,
                focus_indices,
                focus_index,
                focus = [],
                matches,
                min, max,
                i;

            if (matches = focus_str.match(/!([^,]+),([^,]+),([^,]*)$/)) {
                Flashcards.all = Flashcards.decodeInteger(matches[1]);
                Flashcards.bad = Flashcards.decodeInteger(matches[2]);
                focus = Flashcards.decodeArrayOfIntegers(matches[3]);
            } else if (matches = focus_str.match(/^([0-9]+)$/)) {
                min = count - Math.min(count, Number(matches[1]));
                focus = Flashcards.closedRange(min, count - 1);
            } else if (matches = focus_str.match(/^([0-9]+)-([0-9]+)$/)) {
                min = Math.max(1, Number(matches[1]));
                max = Math.min(count, Number(matches[2]));
                focus = Flashcards.closedRange(min - 1, max - 1);
            } else if (matches = focus_str.match(/^([0-9]+(,[0-9]+)+)$/)) {
                focus_indices = matches[1].split(",");

                for (i = 0; i < focus_indices.length; ++i) {
                    focus_index = Number(focus_indices[i]) - 1;

                    if (0 <= focus_index && focus_index < count) {
                        focus.push(focus_index);
                    }
                }
            }

            Flashcards.focus = focus;
        },

        closedRange: function (min, max)
        {
            var r = [],
                i;

            for (i = min; i <= max; ++i) {
                r.push(i);
            }

            return r;
        },

        nextState: function (nextState)
        {
            Flashcards.state = nextState;
        },

        moveToNextState: function ()
        {
            Flashcards.state();
        },

        encodeSortableArrayOfIntegers: function (raw_ints)
        {
            var ints = raw_ints.slice(0),
                encoded = "",
                last_int = 0,
                i, l;

            ints.sort(function (a, b) { return a - b; });

            for (i = 0, l = ints.length; i < l; ++i) {
                encoded += Flashcards.encodeInteger(ints[i] - last_int);
                last_int = ints[i];
            }

            return encoded;
        },

        encodeInteger: function (n)
        {
            var encoded = "",
                base = Flashcards.digits.length,
                remainder, digit;

            while ((encoded === "") || (n > 0)) {
                remainder = n % base;
                digit = Flashcards.digits.substr(remainder, 1);
                encoded = digit + encoded;
                n = (n - remainder) / base;
            }

            switch (encoded.length) {
                case 1: return encoded;
                case 2: return "." + encoded;
                case 3: return ":" + encoded;
                case 4: return "-" + encoded;
                case 5: return "=" + encoded;
            }

            throw "Number too large for encoding";
        },

        decodeArrayOfIntegers: function (encoded)
        {
            var ints = [],
                last_int = 0,
                i, l, tmp;

            for (i = 0, l = encoded.length; i < l;) {
                tmp = Flashcards.decodeFirstIncrement(encoded.substr(i));
                last_int += tmp[0];
                ints.push(last_int);
                i += tmp[1];
            }

            return ints;
        },

        decodeInteger: function (encoded)
        {
            return Flashcards.decodeFirstIncrement(encoded)[0];
        },

        decodeFirstIncrement: function (encoded)
        {
            var lengths = ".:-=",
                length = 1,
                step = 1,
                first_char,
                i;

            if (encoded === "") {
                throw "Invalid encoding: expected at least 1 more characters";
            }

            first_char = encoded.substr(0, 1);
            i = lengths.indexOf(first_char);

            if (i > -1) {
                length = i + 2;
                step = length + 1;
                encoded = encoded.substr(1);
            }

            if (encoded.length < length) {
                throw "Invalid encoding: encoded stream too short";
            }

            return [Flashcards.decodeIncrement(encoded.substr(0, length)), step];
        },

        decodeIncrement: function (encoded)
        {
            var decoded = 0,
                base = Flashcards.digits.length,
                i, l, digit, next_char;

            for (i = 0, l = encoded.length; i < l; ++i) {
                next_char = encoded.substr(i, 1);
                digit = Flashcards.digits.indexOf(next_char);

                if (digit < 0) {
                    throw "Invalid encoding: invalid character: " + next_char;
                }

                decoded = decoded * base + digit;
            }

            return decoded;
        },

        showQuestion: function (question, answer, notes)
        {
            $("index").innerHTML = String(Flashcards.current_card_index + 1) + ".";
            $("question").innerHTML = question;
            $("answer").innerHTML = answer;
            $("notes").innerHTML = notes;
        },

        showFurigana: function ()
        {
            var furigana = Flashcards.findFurigana(),
                i, l;

            for (i = 0, l = furigana.length; i < l; ++i) {
                furigana[i].className = "visible";
            }
        },

        findFurigana: function ()
        {
            return document.getElementsByTagName("ruby");
        },

        hasFurigana: function ()
        {
            return Flashcards.findFurigana().length > 0;
        },

        showAnswer: function ()
        {
            $("answer").className = "";
            $("notes").className = "";
        },

        hideAnswer: function ()
        {
            $("answer").className = "hidden";
            $("notes").className = "hidden";
        },

        showRateForm: function ()
        {
            if (Flashcards.focus.indexOf(Flashcards.current_card_index) > -1) {
                $("rate-skip").innerHTML = "Better!";
                $("rate-good-add-to-focus").className = "hidden";
                $("rate-remove-from-focus").className = "";
            } else {
                $("rate-skip").innerHTML = "Good!";
                $("rate-good-add-to-focus").className = "";
                $("rate-remove-from-focus").className = "hidden";
            }

            $("rate").className = "";
        },

        hideRateForm: function ()
        {
            $("rate").className = "hidden";
        },

        updateInfo: function ()
        {
            var good = Flashcards.all - Flashcards.bad,
                rate = (Flashcards.all > 0) ? Math.round((good * 100) / Flashcards.all) : 0,
                hash, url, title;

            hash = (
                "#!" + Flashcards.encodeInteger(Flashcards.all)
                + "," + Flashcards.encodeInteger(Flashcards.bad)
                + "," + Flashcards.encodeSortableArrayOfIntegers(Flashcards.focus)
            );
            url = window.location.href.replace(/^([^#]*)(#.*)?$/, "$1") + hash;
            title = (
                "Flashcards "
                + String(Flashcards.focus.length) + ", "
                + String(good) + "|" + String(Flashcards.bad)
                + " (" + String(rate) + "%)"
            );

            $("stats-good").innerHTML = good;
            $("stats-bad").innerHTML = Flashcards.bad;
            $("stats-rate").innerHTML = String(rate) + "%";
            $("stats-focus-size").innerHTML = Flashcards.focus.length;
            $("cont-input").value = hash;
            $("cont-link").href = url;

            document.title = title;
            window.history.replaceState({}, title, url);
        },

        rateBadAddToFocus: function ()
        {
            Flashcards.bad++;
            Flashcards.addCurrentCardToFocus();
            Flashcards.moveToNextState();
        },

        rateGoodAddToFocus: function ()
        {
            Flashcards.addCurrentCardToFocus();
            Flashcards.moveToNextState();
        },

        addCurrentCardToFocus: function ()
        {
            if (Flashcards.focus.indexOf(Flashcards.current_card_index) == -1) {
                Flashcards.focus.push(Flashcards.current_card_index);
                Flashcards.shuffleFocus();
            }
        },

        rateSkip: function ()
        {
            Flashcards.moveToNextState();
        },

        rateRemoveFromFocus: function ()
        {
            Flashcards.focus = Flashcards.focus.filter(
                function (i)
                {
                    return i !== Flashcards.current_card_index;
                }
            );
            Flashcards.shuffleFocus();
            Flashcards.moveToNextState();
        },

        extendFocus: function()
        {
            var c = Flashcards.cards.length,
                amount = Number($("extend-focus-amount").value),
                range, i, l;

            range = Flashcards.closedRange(c - Math.min(c, amount), c - 1);

            for (i = 0, l = range.length; i < l; ++i) {
                if (Flashcards.focus.indexOf(range[i]) === -1) {
                    Flashcards.focus.push(range[i]);
                }
            }

            Flashcards.shuffleFocus();
            Flashcards.updateInfo();
        },
    };

    window.Flashcards = Flashcards

})();
