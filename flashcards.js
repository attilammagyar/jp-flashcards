(function() {

    var Flashcards, $;

    $ = function (id)
    {
        return document.getElementById(id);
    };

    Flashcards = {
        cards: [],
        selection: null,
        state: function () {},
        min: 0,
        max: 0,

        random: function (min, max)
        {
            return min + Math.floor(Math.random() * (max - min));
        },

        randomCardIndex: function ()
        {
            var fc = Flashcards,
                s = Flashcards.selection;

            if (Math.random() < 0.25) {
                return fc.random(0, fc.cards.length);
            }

            return s ? s[fc.random(0, s.length)] : fc.random(fc.min, fc.max);
        },

        states: {
            question: function ()
            {
                if (Math.random() > 0.5) {
                    Flashcards.states.japaneseQuestion();
                } else {
                    Flashcards.states.englishQuestion();
                }
            },

            japaneseQuestion: function ()
            {
                var i = Flashcards.randomCardIndex(),
                    question = Flashcards.cards[i][1],
                    answer = Flashcards.cards[i][0];

                Flashcards.hideAnswer();
                Flashcards.showQuestion(i, question, answer);

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
                Flashcards.nextState(Flashcards.states.question);
            },

            englishQuestion: function ()
            {
                var i = Flashcards.randomCardIndex(),
                    question = Flashcards.cards[i][0],
                    answer = Flashcards.cards[i][1];

                Flashcards.hideAnswer();
                Flashcards.showQuestion(i, question, answer);
                Flashcards.nextState(Flashcards.states.japaneseAnswer);
            },

            japaneseAnswer: function()
            {
                Flashcards.showAnswer();
                Flashcards.nextState(
                    Flashcards.hasFurigana()
                        ? Flashcards.states.japaneseAnswerFurigana
                        : Flashcards.states.question
                );
            },

            japaneseAnswerFurigana: function()
            {
                Flashcards.showFurigana();
                Flashcards.nextState(Flashcards.states.question);
            }
        },

        initialize: function (cards)
        {
            var body = document.getElementsByTagName("body")[0],
                limits = String(window.location.href).match(/#(.*)$/),
                selected_cards,
                matches;

            Flashcards.cards = cards;
            Flashcards.max = Flashcards.cards.length;

            if (limits) {
                Flashcards.parseLimits(limits[1]);
            }

            Flashcards.nextState(Flashcards.states.question);

            $("card").onclick = Flashcards.moveToNextState;
            body.onkeypress = Flashcards.moveToNextState;
            Flashcards.moveToNextState();
        },

        parseLimits: function (limits)
        {
            var count = Flashcards.cards.length,
                selected_indices,
                selected_index,
                selection = [],
                matches,
                i;

            if (matches = limits.match(/^([0-9]+)$/)) {
                Flashcards.min = count - Math.min(count, Number(matches[1]));
            } else if (matches = limits.match(/^([0-9]+)-([0-9]+)$/)) {
                Flashcards.min = Math.max(0, Number(matches[1]) - 1);
                Flashcards.max = Math.min(count, Number(matches[2]));
            } else if (matches = limits.match(/^([0-9]+(,[0-9]+)+)$/)) {
                selected_indices = matches[1].split(",");

                for (i = 0; i < selected_indices.length; ++i) {
                    selected_index = Number(selected_indices[i]) - 1;

                    if (0 <= selected_index && selected_index < count) {
                        selection[selection.length] = selected_index;
                    }
                }

                if (selection.length > 0) {
                    Flashcards.selection = selection;
                }
            }
        },

        nextState: function (nextState)
        {
            Flashcards.state = nextState;
        },

        moveToNextState: function ()
        {
            Flashcards.state();
        },

        showQuestion: function (index, question, answer)
        {
            $("index").innerHTML = String(index + 1) + ".";
            $("question").innerHTML = question;
            $("answer").innerHTML = answer;
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
        },

        hideAnswer: function ()
        {
            $("answer").className = "hidden";
        }
    };

    window.Flashcards = Flashcards

})();
