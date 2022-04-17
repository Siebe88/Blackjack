let cards = {
  ScorePlayer: 0,
  ScoreHouse: 0,
  playerCards: [],
  houseCards: [],
  // These codes are used to get the correct images for cards
  courts: ['0', 'J', 'Q', 'K', 'A'],
  suits: ['H', 'C', 'D', 'S'],
  cardImgSource: "https://deckofcardsapi.com/static/img/",

  // Functions
  removeCards: function (who) {
    // soure: https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/#:~:text=Child%20nodes%20can%20be%20removed,which%20produces%20the%20same%20output.
    var removeCards = document.getElementById(who)
    var child = removeCards.lastElementChild;
    while (child) {
      removeCards.removeChild(child);
      child = removeCards.lastElementChild;
    }
  },

  dealCards: function () {
    cards.playerCards = [];
    cards.houseCards = [];

    cards.ScoreHouse = 0;
    document.getElementById("ScoreHouse").innerHTML = 'The house: ';

    cards.removeCards("playerCards");
    cards.removeCards("houseCards");

    document.getElementById("deal-button").className = "disabled"
    document.getElementById("hit-button").className = "enabled"
    document.getElementById("stand-button").className = "enabled"

    getCard('houseCards');
    getCard('houseCards');
    getCard('playerCards');
    getCard('playerCards');
  }

}

let games = {
  gamesPlayer: 0,
  gamesHouse: 0,

  //functions
  gameOver: function (winner) {
    $("#winnerText").hide()
      .text("The game has been won by: " + winner)
      .fadeIn();
    $("#hit-button").attr("class", "disabled");
    $("#stand-button").attr("class", "disabled");
    $("#deal-button").attr("class", "enabled");
    $("#gamesHouse").text("The house has won: " + games.gamesHouse);
    $("#gamesPlayer").text("The player has won: " + games.gamesPlayer);
  }
}



function getCard(who) {
  let suit = cards.suits[getRdmNumb(0, 3)];
  let cardValue = getRdmNumb(2, 14);
  let card = suit + cardValue;

  // Somehow de ace of diamonds is not working
  // And ofcours we can't have double cards
  while (cards.playerCards.includes(card) == true || cards.houseCards.includes(card) || card == 'D14') {
    suit = cards.suits[getRdmNumb(0, 3)];
    cardValue = getRdmNumb(2, 14);
    card = suit + cardValue;
  }

  cards[who].push(card);

  let cardImg = "img/closedCard1.png";
  if (cards.houseCards.length != 1) {
    cardImg = getCardImage(card);
  }

  $("<img>")
    .attr("src", cardImg)
    .appendTo("#" + who)
}

function getScoresPlayer() {
  cards.ScorePlayer = 0;
  let ScoresPlayer = [0];
  for (let i = 0; i < cards.playerCards.length; i++) {
    let cardValue = parseInt(cards.playerCards[i].substr(1));

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
  ScoresPlayer = ScoresPlayer.filter(function (value, index, arr) { return value < 22; });
  cards.ScorePlayer = Math.max(...ScoresPlayer);

  if (ScoresPlayer.length == 0 && cards.playerCards.length != 0) {
    cards.ScorePlayer = "busted";
    games.gamesHouse++;
    games.gameOver("The house");

  } else if (cards.ScorePlayer == 21) {
    cards.ScorePlayer = "21 (automatic winner!!!)";
    games.gamesPlayer++;
    games.gameOver("The Player");
  }
  document.getElementById("ScorePlayer").innerHTML = `The player: ${cards.ScorePlayer}`;
}

function getScoresHouse() {
  cards.ScoreHouse = 0;
  let ScoresHouse = [0];
  for (let i = 0; i < cards.houseCards.length; i++) {
    let cardValue = parseInt(cards.houseCards[i].substr(1));

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
  ScoresHouse = ScoresHouse.filter(function (value, index, arr) { return value < 22; });
  cards.ScoreHouse = Math.max(...ScoresHouse);

  document.getElementById("ScoreHouse").innerHTML = `The house: ${cards.ScoreHouse}`;

  if (cards.ScoreHouse > cards.ScorePlayer) {
    games.gamesHouse++;
    games.gameOver("The house");
  } else if (cards.ScoreHouse == cards.ScorePlayer) {
    games.gameOver("Nobody (scores are equal)");
  } else if (ScoresHouse.length == 0 && cards.houseCards.length != 0) {
    cards.ScoreHouse = "busted";
    document.getElementById("ScoreHouse").innerHTML = `The house: ${cards.ScoreHouse}`;
    games.gamesPlayer++;
    games.gameOver("The Player");

  } else if (cards.ScoreHouse < cards.ScorePlayer) {
    getCard('houseCards');
    getScoresHouse();
  }
}

function getRdmNumb(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function stand() {
  cards.removeCards("houseCards");

  for (let i = 0; i < cards.houseCards.length; i++) {
    var img = new Image();
    img.src = getCardImage(cards.houseCards[i]);
    document.getElementById("houseCards").appendChild(img);
  }
  getScoresHouse()
}

function getCardImage(card) {
  let cardValue = parseInt(card.substring(1));
  let suit = card[0];
  let cardImg = cards.cardImgSource;

  if (cardValue > 9) {
    cardImg = cardImg + cards.courts[cardValue - 10] + suit;
  } else {
    cardImg = cardImg + cardValue + suit;
  }
  return cardImg + ".png";
}