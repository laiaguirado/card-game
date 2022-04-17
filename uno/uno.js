const NUMCARDS = 56;
const NUMCARDS_GAMER = 7;

class Card {
  constructor(cardName) {
    this.cardName = cardName;
    this.isVisible = false;
  }

  flip() {
    this.isVisible = !this.isVisible;
  }

  showImage(name) {
    //mostrar la imagen de la carta (solo las que sean visibles)
    if (this.isVisible == true) {
      return "./images/cards/" + name + ".png";
    } else {
      return "./images/cards/" + "uno-reves" + ".png";
    }
  }
} //end Card

class Gamer {
  constructor(gamerNum, name) {
    this.name = name;
    this.gamerNum = gamerNum;
    this.cards = [];
    this.isMyTurn = false;
  }

  numCards() {
    return this.cards.length;
  }

  isEmpty() {
    return this.cards.length == 0;
  }

  myTurn() {
    for (let card of this.cards) {
      card.flip();
    }
    this.isMyTurn = !this.isMyTurn;
    if (this.isMyTurn == true) {
      console.log(">> It's the turn of " + this.name);
    }
  }

  pickCard(card) {
    this.cards.push(card);
    console.log(">> " + this.name + " pick the card: " + card.cardName);
  }

  throwCard(index) {
    let card = this.cards.splice(index, 1)[0];
    console.log(">> " + this.name + " throws the card: " + card.cardName);
    return card;
  }

  printCards() {
    console.log(">> " + this.name + " has " + this.numCards() + " cards:");
    console.log(this.cards);
  }
} //end Gamer

class Table {
  constructor() {
    this.table = [];
    this.cardsInGame = [];
    this.gamers = [];
  }

  startCards() {
    //inicializar las cartas de juego
    this.table = [];
    const values = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "+2",
      "Direction",
      "Forbbiden",
    ];
    const colors = ["red", "green", "blue", "yellow"];
    const specials = ["multicolor_1", "multicolor_2", "+4_1", "+4_2"];

    //añadimos cartas de colores
    for (let color in colors) {
      for (let value in values) {
        this.table.push(new Card(colors[color] + "" + values[value]));
      }
    }
    //añadimos 2 multicolor, 2 plus4
    for (let special in specials) {
      //for (let i = 0; i < 1; i++) {
      this.table.push(new Card(specials[special]));
      //}
    }
    this.table.sort(function () {
      return Math.random() - 0.5;
    });
  }

  dealCards() {
    //Repartir 7 cartas random a cada jugador
    for (let gamer of this.gamers) {
      console.log(">> Dealing " + NUMCARDS_GAMER + " cards to " + gamer.name);
      for (let i = 0; i < NUMCARDS_GAMER; i++) {
        let randomNum = getRandomNumber(0, this.tableLength());
        let card = this.table.splice(randomNum, 1)[0];
        gamer.cards.push(card); //gamer.pickCard(card);
      }
      console.log(gamer.cards);
    }
  }

  cardToStart() {
    let randomNum = getRandomNumber(0, this.tableLength());
    let startCard = this.table.splice(randomNum, 1)[0]; //quitamos carta de la tabla
    while (
      startCard.cardName.includes("multicolor") ||
      startCard.cardName.includes("+4") ||
      startCard.cardName.includes("+2") ||
      startCard.cardName.includes("Forbbiden") ||
      startCard.cardName.includes("Direction")
    ) {
      this.table.splice(randomNum, 0, startCard); //volvemos a añadir la carta en la tabla
      randomNum = getRandomNumber(0, this.tableLength());
      startCard = this.table.splice(randomNum, 1)[0]; //sacamos otra carta
    }
    startCard.flip(); //cambiar la visibilidad de la carta a: visible
    this.cardsInGame.push(startCard);
    console.log(">> Start card: " + startCard.cardName);
  }

  addGamer(gamer) {
    this.gamers.push(gamer);
  }

  pickCard(gamer) {
    //jugador coge una carta del monton de robar
    let card = this.table.pop(); //quitar la carta de la table
    card.flip(); //cambiar la visibilidad de la carta a: visible
    gamer.pickCard(card); //poner la carta en el jugador
    return card;
  }

  throwCard(card, gamer, i) {
    //jugador tira una carta al monton de jugar
    if (gamer.isMyTurn == true) {
      gamer.throwCard(i); //quita la carta de las cartas del jugador
      this.cardsInGame.push(card); //pone la carta en cardsInGame
    } else {
      console.log(">> No es mi turno, por eso no puedo tirar");
    }
  }

  tableLength() {
    return this.table.length;
  }

  cardsInGameLength() {
    return this.cardsInGame.length;
  }

  printTable() {
    console.log("Deck of cards to take: ");
    console.log(this.table);
  }

  printCardsInGame() {
    console.log("Cards in game: ");
    console.log(this.cardsInGame);
  }

  printPlayersCards() {
    for (let gamer of this.gamers) {
      gamer.printCards();
    }
  }
} //end Table

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function startGame(gamers) {
  let t = new Table();

  //Iniciar la mesa con NUMCARDS cartas disponibles
  t.startCards();
  if (t.tableLength() == NUMCARDS) {
    console.log(">> The table are ready");
  } else {
    console.log(">> The table doesn't have " + NUMCARDS + " dealCards");
  }
  console.log(">> Number of cards in game: " + t.tableLength());
  console.log(">> Number of gamers: " + gamers.length);

  //Añadir gamers a la table
  for (let gamer of gamers) {
    t.addGamer(gamer);
  }
  //Repartir 7 cartas random a cada jugador
  t.dealCards();

  //Coger una carta para empezar a jugar
  t.cardToStart();

  return t;
}

function createGamer(gamers, input) {
  //crear jugador y ponerlo en el array gamers
  let g;
  if (input.value !== "") {
    g = new Gamer(gamers.length, input.value);
    console.log(">> Player " + gamers.length + " : " + g.name);
    input.value = ""; //borrar el input del form una vez creado el jugador
    gamers.push(g);
    return gamers;
  }
}

export {
  startGame,
  createGamer
};

