//Predefine poker Hands possible values
var pokerHands = {
  "bust": "Bust",
  "one_pair": "One pair",
  "two_pair": "Two pair",
  "three_kind": "Three of a kind",
  "four_kind": "Four of a kind",
  "straight": "Straight",
  "flush": "Flush",
  "straight_flush": "Straight flush",
  "royal_flush": "Royal flush",
  "full_house": "Full house"
};

/**
 * Page main js functionality
 * @param
 * @return
 **/
var main = function() {

  //initialize hand for testing
  var hand = [{
      "rank": "king",
      "suit": "spades"
    },
    {
      "rank": "ten",
      "suit": "spades"
    },
    {
      "rank": "king",
      "suit": "spades"
    },
    {
      "rank": "king",
      "suit": "spades"
    },
    {
      "rank": "ten",
      "suit": "spades"
    },
  ];

  //Set a new different color for each child $(.relevant p) jquery object
  var result = handAssessor(hand);
}


$(document).ready(main);
/**
 * Recieves a set of 5 cards, validates each comparing to a predefined deck, and finds the matching poker hands
 * Prints the hand recieved and the result
 * @param hand - an array of objects - 5 “cards” (i.e. [{"rank": "king","suit": "spades"},... ])
 * @return result - an array of strings that contains the matching poker hands
 **/
var handAssessor = function(hand) {
  //set variable result initial value to false
  var result = [];

  //Print initial hand
  console.log(hand);

  //validate hand
  var validatedHand = validateHand(hand);
  if (!validatedHand) {
    var $p = $('<p>').text("Hand cards are not valid.");
    $(".hand-result").append($p);
    return;
  }

  //print unsorted hand
  var handString = "";
  hand.forEach(function(card, index) {
    if (index != 0) {
      handString += ", ";
    }
    handString += card.rank + " (" + card.suit + ")";
  });
  var $handP = $("<p>").text(handString);
  $(".hand").append($handP);
  $(".hand").append("------------------------------------------------------------------------------------------------------------------------------------");

  //Add another json propery rankIndex - this shows the ranking index by nubmber 0-12 (two - ace), helps for sorting
  hand = addRankIndexes(hand);

  //sort hand using the rankIndex
  hand.sort(compare);


  //Check if hand category is Flush
  var flush = isFlush(hand);
  if (flush) {
    result.push(pokerHands.flush);
  }

  //Check if hand category is Straight
  var straight = isStraight(hand);
  if (straight) {
    result.push(pokerHands.straight);
  }


  //map array to a new array of ranks
  var handRanks = hand.map(function(card) {
    return card.rank;
  });
  //check if hand category is Pair (count=1), Two Pair, Three of a kind (count=3), Four of a kind (count==4)
  //using containsNTimes helper function
  handRanks.forEach(function(rank, index) {
    var countRanks = containsNTimes(handRanks,
      rank);

    if (countRanks > 1) {
      handRanks.splice(index, 1);
      handRanks.splice(handRanks.indexOf(rank), 1);

      //Check if hand matches One Pair, if it's not the first time it's matching One Pair, then add Two Pair and remove One Pair
      if (result.indexOf(pokerHands.one_pair) > -1 || result.indexOf(pokerHands.two_pair) > -1) {
        result.push(pokerHands.two_pair);
        result.splice(result.indexOf(pokerHands.one_pair), 1);
      } else {
        result.push(pokerHands.one_pair);
      }

      //Check if the hand contains the same item three times, add Three of the same kind
      if (countRanks == 3) {
        result.push(pokerHands.three_kind);
        handRanks.splice(handRanks.indexOf(rank), 1);
      }
      //Check if the hand contains the same item four times, add Four of the same kind
      if (countRanks == 4) {
        result.push(pokerHands.four_kind);
        handRanks.splice(handRanks.indexOf(rank), 1);
      }
    }
  });

  //Check if hand category is Full House=
  if (result.indexOf(pokerHands.two_pair) > -1 && result.indexOf(pokerHands.three_kind) > -1) {
    result.push(pokerHands.full_house);
  }

  //Check if hand category is Straight Flush
  if (result.indexOf(pokerHands.straight) > -1 && result.indexOf(pokerHands.flush) > -1) {
    result.push(pokerHands.straight_flush);
    result.splice(result.indexOf(pokerHands.straight), 1);
    result.splice(result.indexOf(pokerHands.flush), 1);
  }
  //Check if hand category is Royal Flush
  if (result.indexOf(pokerHands.straight_flush) > -1 && hand[4].rankIndex == 12) {
    result.push(pokerHands.royal_flush);
    result.splice(result.indexOf(pokerHands.straight_flush), 1);
  }

  //If no matching hand are found, print "Bust"
  if (result.length == 0) {
    result.push(pokerHands.bust);
  }

  result.forEach(function(value, index) {
    var $p = $('<p>').text(value);
    $(".hand-result").append($p);
  });
  $(".hand-result").append("------------------------------------------------------------------------------------------------------------------------------------" );

  return result;
}

/**
 * Checks if array (hand) contains a pair of cards (two of the same rank)
 *
 * @param hand - an array of items (i.e. ("spades", "hearts","spades","diamonds","hearts"))
 * @return result - true if all items are the same; false if at least one is different
 *
 **/
var isFlush = function(hand) {
  //set variable result initial value to true
  var result = true;

  //map array to a new array of suits
  var handSuits = hand.map(function(card) {
    return card.suit;
  });

  var firstValue = handSuits[0];
  handSuits.forEach(function(value, index) {
    if (value !== firstValue) {
      result = false;
    }
  });

  return result;
}


/**
 * Checks if array (hand) contains n same items
 *
 * @param array - array i.e. ['ten','two','ace','three','ten']
 * @return count - the number of times the item was found, 0 if not found
 *
 **/
var containsNTimes = function(array, item) {
  //iterates every time the item = item n is found
  var count = 0;
  //check each array element if that is equal to item, if yes then iterate counter
  array.forEach(function(value, index) {
    if (value == item) {
      count++;
    }
  });

  return count;

}

/**
 * Checks if array (hand) makes a Straight - sorts items and checks if each next item is equal to previous item + 1
 *
 * @param handRanks - array containing ranks of cards i.e. ['ten','two','ace','three','ten']
 * @return count - the number of times the item was found, 0 if not found
 *
 **/
var isStraight = function(hand, item) {

  //set variable result initial value to true
  var result = true;

  //map array to a new array of ranks indexes
  var handRanks = hand.map(function(card) {
    return card.rankIndex;
  });

  //If fourth element is rankIndex 3 (five), then check if the fifth rankIndex is 12 (ace)
  //and if so, set ace rank to 0 (low ace)
  if (handRanks[3] == 3) {
    if (handRanks[4] == 12) {
      handRanks[4] = 0;
    }
  }

  //check each handRanks element, find its index from the sorted cards deck
  handRanks.forEach(function(cardRankIndex, index) {
    var cardRankIndexNext;

    if (index < handRanks.length - 1) {
      cardRankIndexNext = handRanks[index + 1];
      if (cardRankIndexNext != (cardRankIndex + 1)) {
        result = false;
      }
    }
  });

  return result;

}

/**
 * Validates hand cards using a predefined deck of cards
 *
 * @param hand - array of json objects containing hand of cards i.e. [("rank":"ten", "suit":"hearts"),{...},...]
 * @return count - the number of times the item was found, 0 if not found
 *
 **/
var validateHand = function(hand) {
  //set initial result value to true
  var result = true;

  //Deck ranks in order
  var deckValidRanks = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"];
  var deckValidSuits = ["spades", "hearts", "diamonds", "clubs"];

  //check each card rank and suit and search that rank/suit in the predefined arrays deckValidRanks,deckValidSuits
  hand.forEach(function(card, index) {
    if (deckValidRanks.indexOf(card.rank) === -1 || deckValidSuits.indexOf(card.suit) === -1) {
      result = false;
    }
  });

  return result;
}

/**
 * Add an order index for each card - uses a predefined deckRanks to get the rankIndex
 *
 * @param hand - array of json objects containing hand of cards i.e. [("rank":"ten", "suit":"hearts"),{...},...]
 * @return count - the number of times the item was found, 0 if not found
 *
 **/
var addRankIndexes = function(hand) {

  //Deck ranks in order
  var deckRanks = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"];

  //add deckRanksIndex by searching the cards index on the deckRanks array
  var handRanked = hand.map(function(card) {
    var deckRanksIndex = deckRanks.indexOf(card.rank);
    return {
      "rankIndex": deckRanksIndex,
      "rank": card.rank,
      "suit": card.suit
    };
  });

  return handRanked;
}

/**
 * used in the sort method - to sort an array
 * @param a - current array element
 * @param b - next array element
 * @return a.rankIndex-b.rankIndex - negative if b rank is higher tha a's, and viceversa
 */
function compare(a, b) {
  return a.rankIndex - b.rankIndex;
}
