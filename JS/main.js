/*----- constants -----*/
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♣', '♦'];

/*----- state variables -----*/
let dealerHand;
let playerHand;
let dealerScore;
let playerScore;
let handResult;
let deck = [];

/*----- cached elements  -----*/
let dealersMsg = document.getElementById('dealers-message');
let playersMsg = document.getElementById('players-message');
let dealersCards = document.getElementById('dealers-cards');
let playersCards = document.getElementById('players-cards');
const dealBtn = document.getElementById('deal-btn');
const hitBtn = document.getElementById('hit-btn');
const stayBtn = document.getElementById('stay-btn');

/*----- event listeners -----*/
dealBtn.addEventListener('click', deal);
hitBtn.addEventListener('click', hit);
stayBtn.addEventListener('click', stay);
document.getElementById('reset-btn').addEventListener('click', init)

/*----- functions -----*/
init();

function init() {
    deck = createDeck();
    shuffleDeck(deck);
    dealerHand = [];
    playerHand = [];
    dealerScore = 0;
    playerScore = 0;
    handResult = null;
    dealBtn.classList.remove('disabled');
    dealBtn.disabled = false;
    dealersMsg.innerHTML = 'DEALER';
    disableBtns()
    render()
}

function createDeck() {
    deck = [];
    SUITS.forEach(suit => {
        VALUES.forEach(value => {
            deck.push(value + suit);
        });
    });
    return deck;
}

function shuffleDeck(deck) {
    for (let i = 0; i < 52; i++) {
        let tempCard = deck[i];
        let randomCard = Math.floor(Math.random() * deck.length);
        deck[i] = deck[randomCard];
        deck[randomCard] = tempCard;
    }
}

function deal() {
    // deal two cards to the dealer
    dealerHand.push(...deck.splice(0, 2));
    // deal two cards to the player
    playerHand.push(...deck.splice(0, 2));

    // disable the deal button
    dealBtn.classList.add('disabled');
    dealBtn.disabled = true;

    // enable hit & stay buttons after dealing
    hitBtn.classList.remove('disabled');
    hitBtn.disabled = false;
    stayBtn.classList.remove('disabled');
    stayBtn.disabled = false;
    render()
}

function render() {
    renderCards();
    calculatePlayerScore();
}

function renderCards() {

    dealersCards.innerHTML = '';
    playersCards.innerHTML = '';

    dealerHand.forEach((card, idx) => {
        const cardEl = document.createElement('img');
        if (idx === 0 && handResult === null) {
            cardEl.src = './images/cards/BACK.png';
        } else {
            cardEl.src = `./images/cards/${card}.png`;
        }
        cardEl.classList.add('cards')
        dealersCards.appendChild(cardEl)
    });

    playerHand.forEach(card => {
        const cardEl = document.createElement('img')
        cardEl.src = `./images/cards/${card}.png`
        cardEl.classList.add('cards')
        playersCards.appendChild(cardEl)
    });
}

function hit() {
    const drawnCard = deck.splice(0, 1)[0]
    playerHand.push(drawnCard)
    calculatePlayerScore()
    render()

    if (playerScore > 21 || playerHand.length === 5) {
        disableBtns()
        revealDealerCard()
        calculateDealerScore()
        checkWin()
        renderResult()
    }
}

function stay() {
    disableBtns()
    revealDealerCard()
    while (dealerScore < 17) {
        dealerHand.push(deck.splice(0, 1)[0])
        calculateDealerScore()
    }
    checkWin()
    render()
}

function calculatePlayerScore() {
    playerScore = 0;

    for (let card of playerHand) {
        const value = card.slice(0, -1)
        if (['J', 'Q', 'K'].includes(value)) {
            playerScore += 10
        } else if (value === 'A') {
            playerScore += 11
        } else {
            playerScore += parseInt(value, 10)
        }
    }
    // check for aces and adjust players score
    for (let card of playerHand) {
        const value = card.slice(0, -1)
        if (value === 'A' && playerScore > 21) {
            playerScore -= 10
        }
    }
    playersMsg.innerText = `PLAYER HAS: ${playerScore}`
}

function calculateDealerScore() {
    dealerScore = 0
    for (let card of dealerHand) {
        const value = card.slice(0, -1)
        if (['J', 'Q', 'K'].includes(value)) {
            dealerScore += 10
        } else if (value === 'A') {
            dealerScore += 11
        } else {
            dealerScore += parseInt(value, 10)
        }
    }
    // check for aces and adjust dealers score
    for (let card of dealerHand) {
        const value = card.slice(0, -1)
        if (value === 'A' && dealerScore > 21) {
            dealerScore -= 10
        }
    }
}

function revealDealerCard() {
    dealersCards.innerHTML = ''
    dealerHand.forEach((card, idx) => {
        const cardEl = document.createElement('img')
        cardEl.src = `./images/cards/${card}.png`
        cardEl.classList.add('cards')
        dealersCards.appendChild(cardEl)
    })
}

function checkWin() {
    if (playerScore === 21) {
        handResult = `PLAYER WINS! ${playerScore}`
    } else if (playerScore > 21) {
        handResult = `PLAYER BUSTS! (${playerScore}) DEALER WINS!`;
    } else if (dealerScore > 21) {
        handResult = `DEALER BUSTS! (${dealerScore}) PLAYER WINS!`;
    } else if (playerScore > dealerScore) {
        handResult = `PLAYER WINS! ${playerScore}`;
    } else if (dealerScore > playerScore) {
        handResult = `DEALER HAS ${dealerScore}! DEALER WINS!`;
    } else {
        handResult = `ITS A TIE! PLAYER HAS ${playerScore} DEALER HAS ${dealerScore}`;
    }
    renderResult()
}

function renderResult() {
    dealersMsg.innerText = handResult
}

function disableBtns() {
    hitBtn.classList.add('disabled')
    hitBtn.disabled = true

    stayBtn.classList.add('disabled')
    stayBtn.disabled = true
}