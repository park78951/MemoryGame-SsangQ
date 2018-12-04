/*
 * Create a list that holds all of your cards
 */

//Rating Stars
const stars = document.querySelectorAll('.fa-star');

//Count and Timer
let moves = document.querySelector('.moves');
let timer = document.querySelector('.timer');
let count = 0;

//Start and Restart Button
const btnStart = document.querySelector('.start');

//Deck and List of Cards in the Deck
let deck = document.querySelector('.deck');
let cards = document.querySelectorAll('.card');
//Temporary Array for Cards when Click
let openCards = [];

//Element where match class was added when 2 cards match
let matchedCards = document.getElementsByClassName('match');

//Modal Pop-up and relevant elements
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
    //to initialize star rating
    stars[2].style.visibility = "visible";
    stars[1].style.visibility = "visible";
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
            stars[2].style.visibility = "collapse";
            stars[1].style.visibility = "collapse";
            count = 99
            modalPop();
        }
    }, 1000);
}

//Set variables only to use in function relevant to Modal Pop-up
let modalScore = document.querySelector('.modal-score');
let modalRating = document.querySelector('.modal-rating');
let modalTakenTime = document.querySelector('.modal-takenTime');

//To pop up the modal when game is finished
function modalPop() {
    //to initialize timer
    clearInterval(interval);
    //to make modal pop-up showed up
    modal.classList.add('show-modal');
    //to set the comment depending on the stars and moves
    if(count < 14) {
        modalScore.innerHTML = "<strong>Fantastic!</strong>";
    } else if (count >= 14 && count < 18) {
        modalScore.innerHTML = "<strong>Good Job!</strong>";
    } else {
        modalScore.innerHTML = "<strong>Nice Try!</strong>";
    }
    //to show stars users get
    modalRating.innerHTML = document.querySelector('.stars').innerHTML;
    //to show time users used
    modalTakenTime.innerHTML = timer.innerHTML;
    //button for retry
    btnRestart.addEventListener('click', function(){
        initGame();
        initModal();
        cardPlay();
    });
    //button for cancel to see the result and cards
    btnClose.addEventListener('click', function(){
        initModal();
    });
}

// To initialize Modal Pop-up (remove class and contents)
function initModal() {
    modal.classList.remove('show-modal');
    modalScore.innerHTML = "";
    modalRating.innerHTML = "";
    modalTakenTime.innerHTML = "";
}