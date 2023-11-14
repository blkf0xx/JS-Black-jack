/*----- constants -----*/
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const SUITS = ['♠', '♥', '♣', '♦']
const deck = [];

/*----- state variables -----*/
const dealerHand = [];
const playerHand = [];
let dealerScore = 0;
let playerScore = 0;
let handResult = null;

/*----- cached elements  -----*/


/*----- event listeners -----*/


/*----- functions -----*/
init()

function init() {

}

// Create a deck of cards
SUITS.forEach(function(suit) {
    VALUES.forEach(function(value) {
        deck.push(suit + value)
    })
})

console.log(deck)