/*
 * Create a list that holds all of your cards
 */

const stars = document.querySelectorAll('.fa-star');

let moves = document.querySelector('.moves');
let timer = document.querySelector('.timer');
let count = 0;

const btnStart = document.querySelector('.start');


let cards = document.querySelectorAll('.card');
let openCards = [];


let matchedCards = document.getElementsByClassName('match');


let deck = document.querySelector('.deck');

const modal = document.querySelector('.modal');

const modalContent = document.querySelector('.modal-content');

const btnRestart = document.querySelector('.btn-retry');
const btnClose = document.querySelector('.btn-close');


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// When page was loaded, function startGame() would be called.
document.body.onload = startGame();

// Main function to start this game from the start to the end
function startGame() {
    initGame();
    btnStart.addEventListener('click', function(){
        initGame();
    });
    cardPlay();
}

// For initialization of this game
function initGame() {
    // to shuffle deck
    cards = [...cards];
    cards = shuffle(cards);
    for (let i=0; i<cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(card){
            deck.appendChild(card);
        });
        //to remove all classes from each card
        cards[i].classList.remove('open', 'show', 'match', 'disable');
    }
    //to initialize moves
    count = 0;
    moves.innerHTML = count;
    //to initialize timer
    clearInterval(interval);
    sec = 0;
    min = 0;
    hour = 0;
    timer.innerHTML = min + ' mins ' + sec + ' secs';
}

//Fuction for the main game
function cardPlay() {
    cards.forEach(function(card) {
        card.addEventListener('click', clickCard);
    });
}

//Function for all the click events to cards
function clickCard() {
    //to put clicked card to an array "openCards"
    openCards.push(this);
    //to make the same card not clicked twice
    openCards[0].classList.add('disable');
    //to open and show the card is after the click
    for (let i=0; i<openCards.length; i++){
        openCards[i].classList.add('show', 'open');
    }
    //after 2 cards opened
    let clickedCards = openCards.length;
    if (clickedCards === 2) {
        let firstIcon = openCards[0].querySelector('i').classList.item(1);
        let secondIcon = openCards[1].querySelector('i').classList.item(1);
        //plus moves
        movesCounter();
        //when 2 cards match
        if (firstIcon === secondIcon){
            match();
        } else {  //when 2 cards don't match  
            unmatch();
        }
    }
    //when all cars match
    if (matchedCards.length === 16){
        modalPop(); 
    }
}

//when 2 cards match, change to 'match' in class list and also disable to make cards not clicked again
function match() {
    openCards[0].classList.add('match', 'disable');
    openCards[0].classList.remove('show', 'open');
    openCards[1].classList.add('match', 'disable');
    openCards[1].classList.remove('show', 'open');
    openCards = [];
}

//when 2 cards don't match, to get cards back to 'not opened' and not clicked more
function unmatch(){
    disableClick();  
    setTimeout(function(){
        openCards.forEach(function(card){
        card.classList.remove('show', 'open'); 
        });
        enableClick();
        openCards = [];
    }, 1000);
}

//to make cards not opened
function disableClick(){
    [].filter.call(cards, function(card){
        card.classList.add('disable');
    });
}

//to click cards and make cards open again
function enableClick(){
    [].filter.call(cards, function(card){
        card.classList.remove('disable');
        for(var i = 0; i < matchedCards.length; i++){
            matchedCards[i].classList.add("disable");
        }
    });
}

//to plus move when 2 cards clicked
function movesCounter() {
    count++;
    moves.innerHTML = count;
    if (count === 1){
        sec = 0;
        min = 0;
        hour = 0;
        setTimer();
    }
    //a standard of score
    if (count === 14){
        stars[2].style.visibility = "collapse";
    }
    else if (count === 18){
        stars[1].style.visibility = "collapse";
    }
}

//To set timer
var sec = 0, min = 0, hour = 0;
var interval;
function setTimer(){
    interval = setInterval(function(){
        timer.innerHTML = min+" mins "+sec+" secs";
        sec++;
        if(sec === 60){
            min++;
            sec=0;
        }
        if(min === 60){
            hour++;
            min = 0;
        }
        //to set a limited time 
        if (min === 10 && sec === 1){
            modalPop();
        }
    }, 1000);
}

//To pop up the modal when game is finished
function modalPop() {
    //to initialize timer
    clearInterval(interval);
    //to make modal pop-up showed up
    modal.classList.add('show-modal');
    //to set the comment depending on the stars and moves
    if(count < 14) {
        document.querySelector('.modal-score').innerHTML = "<strong>Fantastic!</strong>";
    } else if (count > 14 && count < 18) {
        document.querySelector('.modal-score').innerHTML = "<strong>Good Job!</strong>";
    } else {
        document.querySelector('.modal-score').innerHTML = "<strong>Nice Try!</strong>";
    }
    //to show stars users get
    document.querySelector('.modal-rating').innerHTML = document.querySelector('.stars').innerHTML;
    //to show time users used
    document.querySelector('.modal-takenTime').innerHTML = timer.innerHTML;
    //button for retry
    btnRestart.addEventListener('click', function(){
        initGame();
        modal.classList.remove('show-modal');
        cardPlay();
    });
    //button for cancel to see the result and cards
    btnClose.addEventListener('click', function(){
        modal.classList.remove('show-modal');
    });
}