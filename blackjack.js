document.addEventListener("DOMContentLoaded", () => {
    let hands = {};
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suit = ['C', 'D', 'H', 'S']

    // creates a 'hand' object
    function Hand(name) {
        this.values = [];
        this.total = 0;
        this.id = name;
        this.outcome = () => {
            let value = 0;
            if (this.total > 21) {
                value = 1; // bust
            } else if (this.total === 21 && this.values.length === 2) {
                value = 2; // blackjack - win
            }
            return value;
        }
    }
    
    function generateCard(hand) {
        const RNGValue = Math.round(Math.random() * 12);
        const RNGSuit = Math.round(Math.random() * 3);
        
        // get the selected card image
        const newValue = values[RNGValue];
        const newSuit = suit[RNGSuit];
        let img = document.createElement('img');
        img.src = `./assets/images/${newValue + newSuit + '.png'}`;
        document.querySelector(`div.row.${hand.id} > div.col.cards`).appendChild(img); 
        
        // calculate and display totals - don't like the way functions are nested
        calculateTotal(newValue, hand);
        displayTotal(hand);
    }

    function calculateTotal(value, hand) {
        let currentTotal = hand.total;
        hand.values.push(value);
        if (value === 'A') {
            currentTotal += (currentTotal < 11 ? 11 : 1);
        } else if (['J', 'Q', 'K'].includes(value)) {
            currentTotal += 10;
        } else {
            currentTotal += Number(value);
        }
        hand.total = currentTotal;
    }

    // calculates hand value, displays bust or blackjack
    function displayTotal (hand) {
        let message = hand.total;
        let outcome = hand.outcome();
        if (outcome === 1) message = 'Bust';
        else if (outcome === 2) message = 'Blackjack';
        document.querySelector(`div.row.${hand.id} > div.total > p.total`).innerHTML = message;
        if (outcome !== 0) {
            endgame(hand, outcome);
        }
    }

    // checks if player won
    function endgame(hand=null, outcome=0) {
        toggleButtons(false);
        let endMessage = ''
        if (hand && outcome !== 0) {
            if (hand.id == 'player' && outcome === 2 || hand.id == 'dealer' && outcome === 1) {
                endMessage = 'You won :)';
            } else endMessage = 'You lost :(';
        } else {
            const difference = hands.player.total - hands.dealer.total;
            if (difference > 0) endMessage = 'You won :)';
            else if (difference < 0) endMessage = 'You lost :(';
            else endMessage = 'It was a draw :|'
        }
        document.querySelector('div.winner > .large').innerHTML = endMessage;
    }

    // disables hit me and stand buttons
    function toggleButtons(bool) {
        for (element of document.querySelectorAll('button.ingame')) {
            element.disabled = !bool;
        }
    }

    // resets hands and card hands
    function resetHands() {
        hands = {};
        for (el of document.querySelectorAll('div.cards')) {
            el.innerHTML = '';
        }
        for (el of document.querySelectorAll('p.total')) {
            el.innerHTML = '';
        }
        document.querySelector('div.winner > .large').innerHTML = '';
        hands.player = new Hand('player');
        hands.dealer = new Hand('dealer');
    }
    
    document.querySelector("#btn-newgame").addEventListener("click", () => {
        resetHands();
        toggleButtons(true);
        generateCard(hands.player);
        generateCard(hands.player);
        generateCard(hands.dealer);
    });

    document.querySelector('#btn-hit').addEventListener("click", () => {
        generateCard(hands.player);
    });

    document.querySelector('#btn-stand').addEventListener("click", () => {
        while (hands.dealer.total < 17) {
            generateCard(hands.dealer);
        }
        if (hands.dealer.outcome() === 0) endgame();
    });
});
