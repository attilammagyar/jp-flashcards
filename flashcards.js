(function() {

    var Flashcards, $;

    $ = function (id)
    {
        return document.getElementById(id);
    };

    Flashcards = {
        cards: [],
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
                    i = Flashcards.random(Flashcards.min, Flashcards.max),
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
                limit = String(window.location.href).match(/#([0-9]+)$/),
                count = cards.length;

            Flashcards.cards = cards;
            Flashcards.max = count;

            if (limit) {
                Flashcards.min = count - Math.min(count, Number(limit[1]));
            }

            Flashcards.setState(Flashcards.states.showQuestion);

            $("card").onclick = Flashcards.applyState;
            body.onkeypress = Flashcards.applyState;
            Flashcards.applyState();
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
