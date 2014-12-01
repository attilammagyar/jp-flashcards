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

        states: {
            showQuestion: function ()
            {
                var l = Flashcards.cards.length,
                    i = Flashcards.selection
                        ? Flashcards.selection[
                            Flashcards.random(0, Flashcards.selection.length)
                        ]
                        : Flashcards.random(Flashcards.min, Flashcards.max),
                    question = Flashcards.cards[i][0],
                    answer = Flashcards.cards[i][1],
                    index = String(i + 1) + ".",
                    tmp;

                if (Math.random() > 0.5) {
                    tmp = answer;
                    answer = question;
                    question = tmp;
                }

                $("index").innerHTML = index;
                $("question").innerHTML = question;
                $("answer").innerHTML = answer;
                $("answer").className = "hidden";

                Flashcards.setState(Flashcards.states.showAnswer);
            },

            showAnswer: function ()
            {
                $("answer").className = "";
                Flashcards.setState(Flashcards.states.showQuestion);
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

            Flashcards.setState(Flashcards.states.showQuestion);

            $("card").onclick = Flashcards.applyState;
            body.onkeypress = Flashcards.applyState;
            Flashcards.applyState();
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

        setState: function (nextState)
        {
            Flashcards.state = nextState;
        },

        applyState: function ()
        {
            Flashcards.state();
        }
    };

    window.Flashcards = Flashcards

})();
