(function() {

    var Flashcards, $;

    $ = function (id)
    {
        return document.getElementById(id);
    };

    Flashcards = {
        cards: [],
        state: function () {},

        states: {
            showQuestion: function ()
            {
                var l = Flashcards.cards.length,
                    i = Math.min(
                            l - 1,
                            Math.floor(
                                Math.sin(Math.random() * Math.PI / 2) * l
                            )
                        ),
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
            var body = document.getElementsByTagName("body")[0];

            Flashcards.cards = cards;
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
