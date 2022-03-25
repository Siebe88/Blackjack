let gamesPlayer = 0;
let gamesHouse = 0;

let ScorePlayer = 0;
let ScoreHouse = 0;

let playerCards = [];
let houseCards = [];

// These codes are used to get the correct images for cards
const courts = ['0', 'J', 'Q', 'K', 'A'];
const suits = ['H', 'C', 'D', 'S'];
const cardImgSource = "https://deckofcardsapi.com/static/img/"


function removeCards(who) {
    // soure: https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/#:~:text=Child%20nodes%20can%20be%20removed,which%20produces%20the%20same%20output.
    var removeCards = document.getElementById(who)
    var child = removeCards.lastElementChild;
    while (child) {
        removeCards.removeChild(child);
        child = removeCards.lastElementChild;
    }
}

function dealCards() {
    playerCards = [];
    houseCards = [];

    ScoreHouse = 0;
    document.getElementById("ScoreHouse").innerHTML = 'The house: ';

    removeCards("playerCards");
    removeCards("houseCards");

    document.getElementById("deal-button").className = "disabled"
    document.getElementById("hit-button").className = "enabled"
    document.getElementById("stand-button").className = "enabled"

    getCard('houseCards');
    getCard('houseCards');
    getCard('playerCards');
    getCard('playerCards');
}

function getCardPlayer() {
    getCard('playerCards');
}

function getCard(who) {
    let suit = suits[getRdmNumb(0, 3)];
    let cardValue = getRdmNumb(2, 14);
    let card = suit + cardValue;

    // Somehow de ace of diamonds is not working
    // And ofcours we can't have double cards
    while (playerCards.includes(card) == true || houseCards.includes(card) || card == 'D14') {
        suit = suits[getRdmNumb(0, 3)];
        cardValue = getRdmNumb(2, 14);
        card = suit + cardValue;
    }

    if (who == 'playerCards') {
        playerCards.push(card);
    } else {
        houseCards.push(card)
    }

    let cardImg = "img/closedCard1.png";

    if (houseCards.length != 1) {
        cardImg = getCardImage(card);
    }

    $("<img>")
        .attr("src", cardImg)
        .appendTo("#" + who)
        // .hide()
        // .slideDown(1000);

}

function getScoresPlayer() {
    ScorePlayer = 0;
    let ScoresPlayer = [0];
    for (let i = 0; i < playerCards.length; i++) {
        let cardValue = parseInt(playerCards[i].substr(1));

        let j = 0;
        while (j < ScoresPlayer.length) {
            if (cardValue == 14) {
                ScoresPlayer.push(ScoresPlayer[j] + 1);
                ScoresPlayer[j] += 11;
                j++;
            } else if (cardValue > 10) {
                ScoresPlayer[j] += 10;
            } else {
                ScoresPlayer[j] += cardValue
            }
            j++;
        }
    }

    //filter out all scores above 21 (results in busted) and get max value from the filtered array
    ScoresPlayer = ScoresPlayer.filter(function(value, index, arr) { return value < 22; });
    ScorePlayer = Math.max(...ScoresPlayer);

    if (ScoresPlayer.length == 0 && playerCards.length != 0) {
        ScorePlayer = "busted";
        gamesHouse++;
        gameOver("The house");

    } else if (ScorePlayer == 21) {
        ScorePlayer = "21 (automatic winner!!!)";
        gamesPlayer++;
        gameOver("The Player");
    }
    document.getElementById("ScorePlayer").innerHTML = `The player: ${ScorePlayer}`;
}

function getScoresHouse() {
    ScoreHouse = 0;
    let ScoresHouse = [0];
    for (let i = 0; i < houseCards.length; i++) {
        let cardValue = parseInt(houseCards[i].substr(1));

        let j = 0;
        while (j < ScoresHouse.length) {
            if (cardValue == 14) {
                ScoresHouse.push(ScoresHouse[j] + 1);
                ScoresHouse[j] += 11;
                j++;
            } else if (cardValue > 10) {
                ScoresHouse[j] += 10;
            } else {
                ScoresHouse[j] += cardValue
            }
            j++;
        }
    }

    //filter out all scores above 21 (results in busted) and get max value from the filtered array
    ScoresHouse = ScoresHouse.filter(function(value, index, arr) { return value < 22; });
    ScoreHouse = Math.max(...ScoresHouse);

    document.getElementById("ScoreHouse").innerHTML = `The house: ${ScoreHouse}`;

    if (ScoreHouse > ScorePlayer) {
        gamesHouse++;
        gameOver("The house");
    } else if (ScoreHouse == ScorePlayer) {
        gameOver("Nobody (scores are equal)");
    } else if (ScoresHouse.length == 0 && houseCards.length != 0) {
        ScoreHouse = "busted";
        document.getElementById("ScoreHouse").innerHTML = `The house: ${ScoreHouse}`;
        gamesPlayer++;
        gameOver("The Player");

    } else if (ScoreHouse < ScorePlayer) {
        getCard('houseCards');
        getScoresHouse();
    }
}

function gameOver(winner) {
    $("#winnerText").hide()
        .text("The game has been won by: " + winner)
        .fadeIn();
    $("#hit-button").attr("class", "disabled");
    $("#stand-button").attr("class", "disabled");
    $("#deal-button").attr("class", "enabled");
    $("#gamesHouse").text("The house has won: " + gamesHouse);
    $("#gamesPlayer").text("The house has won: " + gamesPlayer);
}

function getRdmNumb(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function stand() {
    removeCards("houseCards");

    for (let i = 0; i < houseCards.length; i++) {
        var img = new Image();
        img.src = getCardImage(houseCards[i]);
        document.getElementById("houseCards").appendChild(img);
    }
    getScoresHouse()
}

function getCardImage(card) {
    let cardValue = parseInt(card.substring(1));
    let suit = card[0];
    let cardImg = cardImgSource;

    if (cardValue > 9) {
        cardImg = cardImg + courts[cardValue - 10] + suit;
    } else {
        cardImg = cardImg + cardValue + suit;
    }
    return cardImg + ".png";
}