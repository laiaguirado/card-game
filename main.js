const numCards = 56;

class Card {
  constructor(cardName) {
    this.cardName = cardName;
    this.isVisible = false;
  }

  flip() {
    this.isVisible = !this.isVisible;
  }

  showImage(name) { //mostrar la imagen de la carta
    if (this.isVisible == true) {
      return './images/cards/' + name + '.png';
    } else {
      return './images/cards/' + 'uno-reves' + '.png';
    }
  }
}

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
    return (this.cards.length == 0);
  }

  myTurn() {
    for (let card of this.cards) {
      card.flip();
    }
    this.isMyTurn = !this.isMyTurn;
    console.log("--------------------------------------------------------------------------------------");
    console.log(">> Is the turn of : " + this.name);
  }

  pickCard(card) {
    this.cards.push(card);
    console.log("--------------------------------------------------------------------------------------");
    console.log(">> " + this.name + " pick the card:");
    console.log(card);
  }

  throwCard(index) {
    let card = this.cards.splice(index, 1)[0];
    console.log("--------------------------------------------------------------------------------------");
    console.log(">> " + this.name + " throws the card:");
    console.log(card);
    return card;
  }

  showCards() {
    console.log(">> " + this.name + " has " + this.numCards() + " cards:");
    console.log(this.cards);
  }

}


class Table {
  constructor() {
    this.table = [];
    this.cardsInGame = [];
    this.gamers = [];
  }

  startCards() { //inicializar las cartas de juego
    this.table = [];
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '+2', 'Direction', 'Forbbiden'];
    const colors = ['red', 'green', 'blue', 'yellow'];
    const specials = ['multicolor_1', 'multicolor_2', '+4_1', '+4_2'];

    //añadimos cartas de colores
    for (let color in colors) {
      for (let value in values) {
        this.table.push(new Card(colors[color] + "" + values[value]));
      }
    }
    //añadimos 2 multicolor, 2 plus4
    for (let special in specials) {
      for (let i = 0; i < 1; i++) {
        this.table.push(new Card(specials[special]));
      }
    }
    this.table.sort(function () { return Math.random() - 0.5 })
  }

  dealCards() { //Repartir 7 cartas random a cada jugador
    for (let gamer of this.gamers) {
      for (let i = 0; i < 7; i++) {
        let randomNum = getRandomNumber(0, this.tableLength());
        let card = this.table.splice(randomNum, 1)[0];
        gamer.pickCard(card);
      }
      console.log(">> Dealing " + gamer.numCards() + " cards to : " + gamer.name);
      console.log(gamer.cards);
    }
  }

  cardToStart() {
    console.log("--------------------------------------------------------------------------------------");
    let randomNum = getRandomNumber(0, this.tableLength());
    let startCard = this.table.splice(randomNum, 1)[0]; //quitamos carta de la tabla
    while (startCard.cardName.includes('multicolor') || startCard.cardName.includes('+4') || startCard.cardName.includes('+2') || startCard.cardName.includes('Forbbiden') || startCard.cardName.includes('Direction')) {
      this.table.splice(randomNum, 0, startCard); //volvemos a añadir la carta en la tabla
      randomNum = getRandomNumber(0, this.tableLength());
      startCard = this.table.splice(randomNum, 1)[0];//sacamos otra
    }
    console.log(">> Start card: ");
    console.log(startCard);
    startCard.flip(); //cambiar la visibilidad a: visible
    this.cardsInGame.push(startCard);
  }

  pickGamer(name) {
    return this.gamers.filter(gamer => gamer.name == name)[0];
  }

  addGamer(gamer) {
    this.gamers.push(gamer);
  }

  pickCard(gamer) { //jugador coge una carta del monton de robar
    let card = this.table.pop();
    card.flip();
    gamer.pickCard(card);

    return card;
  }

  throwCard(card, gamer, i) { //jugador tira una carta al monton de jugar
    if (gamer.isMyTurn == true) {
      gamer.throwCard(i); //quita la carta de las cartas del jugador
      this.cardsInGame.push(card); //pone la carta en cardsInGame
    } else {
      console.log("No es mi turno, por eso no puedo tirar")
    }
  }

  tableLength() {
    return this.table.length;
  }

  cardsInGameLength() {
    return this.cardsInGame.length;
  }

  showTable() {
    console.log("--------------------------------------------------------------------------------------");
    console.log("Deck of cards to take: ")
    console.log(this.table);
  }

  showCardsInGame() {
    console.log("--------------------------------------------------------------------------------------");
    console.log("Cards in game: ")
    console.log(this.cardsInGame);
  }

  showCards() {
    console.log("--------------------------------------------------------------------------------------");
    for (let gamer of this.gamers) {
      gamer.showCards();
    }
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function startGame(gamers) {
  let t = new Table();

  //Iniciar la mesa con (const)numCards cartas disponibles
  t.startCards();
  if (t.tableLength() == numCards) {
    console.log("--------------------------------------------------------------------------------------");
    console.log(">> The table are ready");
  } else {
    console.log("--------------------------------------------------------------------------------------");
    console.log(">> The table doesn't have " + numCards + " dealCards")
  }

  console.log("--------------------------------------------------------------------------------------");
  console.log(">> Number of cards in game: " + t.tableLength())
  console.log(">> Number of gamers: " + gamers.length)
  console.log("--------------------------------------------------------------------------------------");

  //añadir gamers a la table
  for (let gamer of gamers) {
    t.addGamer(gamer);
  }
  //Repartir 7 cartas random a cada jugador
  t.dealCards();

  //Cogemos una carta para empezar a jugar
  t.cardToStart();

  return t;
}

function score(t) { //comprobar si alguien ha ganado
  let ganador = false;
  for (let gamer of t.gamers) {
    if (gamer.isEmpty()) {
      ganador = true;
      let divInfo = document.getElementById('info');
      let pGanador = document.createElement('p');
      pGanador.setAttribute("id", "ganador")
      pGanador.textContent = gamer.name + " wins the game!!"

      divInfo.appendChild(pGanador);
      console.log("--------------------------------------------------------------------------------------");
      console.log(">> " + gamer.name + " wins!!!!!!!!!!")
    }
  }
  return ganador;
}

function createGamer(gamers) {
  const input = document.querySelector('input');
  let g;
  if (input.value !== "") {
    g = new Gamer(gamers.length, input.value);
    console.log(">> Gamer " + gamers.length + " :");
    console.log(g)
    input.value = ""; //borrar el input del form una vez creado el jugador
    gamers.push(g); //poner el gamer en el array gamers
    return gamers;
  }
}

function asegurarPlayers() {
  const inputNumPlayers = document.querySelector('input');
  let numPlayers = inputNumPlayers.value;
  console.log("--------------------------------------------------------------------------------------");
  console.log("Number of players: " + numPlayers)

  let info = document.getElementById("info");
  let pNumPlayers = document.createElement('p');
  pNumPlayers.textContent = "Number of players: " + numPlayers;
  info.appendChild(pNumPlayers);

  document.querySelector('form').remove();

  const formPlayer = document.createElement('form');
  const buttonPlayer = document.createElement('button');
  const inputPlayer = document.createElement('input');

  buttonPlayer.innerText = "Add";
  inputPlayer.type = "text";
  inputPlayer.name = "player";
  inputPlayer.placeholder = " Type your username....";
  inputPlayer.autofocus = "true"

  mainElement.appendChild(formPlayer);
  formPlayer.appendChild(inputPlayer);
  formPlayer.appendChild(buttonPlayer);

  return numPlayers;
}

function createStartButton() { //creamos el boton: start game!
  const startButton = document.createElement('button');
  startButton.setAttribute('id', 'start-game');
  startButton.textContent = "Start game!"

  return startButton;
}

function displayPlayers(gamers) {
  const players = document.getElementById('players');
  players.textContent = "";
  for (let gamer of gamers) {
    const li = document.createElement('li');
    const p = document.createElement('p');
    p.textContent = "Player " + gamer.gamerNum + " : " + gamer.name;
    players.appendChild(li);
    li.append(p);
    li.setAttribute('player', gamer.gamerNum);
    for (let i = 0; i < gamer.numCards(); i++) {
      const img = document.createElement('img');
      img.src = gamer.cards[i].showImage(gamer.cards[i].cardName);
      img.setAttribute("class", gamer.cards[i].cardName);
      li.append(img);
    }
  }
}

function displayFullTableCards(cardsInGame, nameCardsInGame, table, nameTable) {
  const divFullTable = document.getElementById('fullTable');
  divFullTable.textContent = "";
  const divCardsInGame = document.createElement('div');
  const divTable = document.createElement('div');
  divCardsInGame.setAttribute('id', 'cardsInGame');
  divTable.setAttribute('id', 'table');

  const imgCardsInGame = document.createElement('img');
  const imgTable = document.createElement('img');
  const pCardsInGame = document.createElement('p');
  const pTable = document.createElement('p');
  imgCardsInGame.src = cardsInGame[cardsInGame.length - 1].showImage(cardsInGame[cardsInGame.length - 1].cardName);
  imgTable.setAttribute("class", cardsInGame[cardsInGame.length - 1].cardName);
  imgTable.src = table[table.length - 1].showImage(table[table.length - 1].cardName);
  imgTable.setAttribute("class", table[table.length - 1].cardName);
  pCardsInGame.textContent = nameCardsInGame;
  pTable.textContent = nameTable;

  divCardsInGame.append(pCardsInGame);
  divTable.append(pTable);
  divCardsInGame.append(imgCardsInGame);
  divTable.append(imgTable);

  divFullTable.appendChild(divCardsInGame);
  divFullTable.appendChild(divTable);
  mainElement.appendChild(divFullTable);
}

function updateCardInGame(cardPreGame, cardGame) { //muestra la ultima carta que se acaba de tirar a cardsInGame
  let divTable = document.getElementById('cardsInGame');
  divTable.replaceChild(cardGame, cardPreGame);
}

function updateDeskCard(cardsPreGame, card) {
  let divTable = document.getElementById('table');
  const imgCardGame = document.createElement('img');
  imgCardGame.src = card.showImage(card.cardName);
  imgCardGame.setAttribute("class", card.cardName);
  divTable.replaceChild(imgCardGame, cardsPreGame);
}

function displayFirstTurn(t) {
  const turnDiv = document.createElement('div');
  turnDiv.setAttribute("id", "turn-info");
  const turnp = document.createElement('p');
  turnp.textContent = 'Is your turn: ';
  const turnButton = document.createElement('button');
  turnButton.textContent = t.gamers[0].name;
  turnButton.setAttribute("id", "turnButton");

  const info = document.getElementById("info");
  info.appendChild(turnDiv);
  turnDiv.appendChild(turnp);
  turnDiv.appendChild(turnButton);

  t.gamers[0].myTurn();

  return turnButton;
}

function updateTurn(t, turn, numPlayers) {
  t.gamers[turn].myTurn();
  turn = (turn + 1) % numPlayers;

  let turnButton = document.getElementById("turnButton");
  turnButton.textContent = t.gamers[turn].name;

  t.gamers[turn].myTurn();
  return turn;
}

function updatePickup() {

}

//program....
let turn = 0;
let t;
let isGameStart = false;
const mainElement = document.querySelector('main');

//form: Numero de jugadores
const formNumPlayers = document.querySelector('form');
formNumPlayers.addEventListener('submit', (event) => {
  event.preventDefault();
  let numPlayers = asegurarPlayers(); //arreglar que si no poses res no et deixi avançar

  let gamers = [];
  //form: Nombre de jugadores
  const formPlayer = document.querySelector('form');
  formPlayer.addEventListener('submit', (event) => {
    event.preventDefault();
    gamers = createGamer(gamers);
    displayPlayers(gamers); //mostrar el nombre de los gamers en pantalla

    if (gamers.length != numPlayers) {
      console.log("Waiting for players...");
    } else {
      let startButton = createStartButton(); //create the button: start game
      mainElement.appendChild(startButton); //afegir el button:start game
      formPlayer.remove(); //eliminar el form para no añadir más jugadores
      //button: Start Game
      startButton.addEventListener('click', (event) => {
        event.preventDefault();
        startButton.remove(); //eliminar el boton: start game!
        t = startGame(gamers); //poner los datos para empezar el juego
        displayPlayers(t.gamers); //mostrar las cartas de todos los jugadores
        displayFullTableCards(t.cardsInGame, "Card in game:", t.table, "Deck of cards to take:"); //mostrar la carta en juego
        console.log(t)

        //button: turnButton
        let turnButton = displayFirstTurn(t); //dar el turno al primer gamer
        turnButton.addEventListener('click', (event) => {
          let ganador = score(t);
          if (ganador == false) {
            displayPlayers(t.gamers);

            //card: detectar si un jugador quiere tirar una carta
            let cardImages = document.getElementById('players').querySelectorAll('img');
            for (let i = 0; i < cardImages.length; i++) {
              cardImages[i].addEventListener('click', (event) => {
                let gamerTurn = t.gamers[turn];
                for (let j = 0; j < gamerTurn.numCards(); j++) {
                  if (gamerTurn.cards[j].cardName == cardImages[i].className) {
                    t.throwCard(t.gamers[turn].cards[i], t.gamers[turn], j); //un jugador tira una carta
                    displayPlayers(t.gamers); //actualizar los jugadores

                    //actualizar las cartas de cardsInGame(monton de cartas en jugada)
                    let cardPreGame = document.getElementById('cardsInGame').querySelector('img');
                    updateCardInGame(cardPreGame, cardImages[i]);

                    turn = updateTurn(t, turn, numPlayers); //actualizamos para que le toque al siguiente cuando ha tirado el anterior

                    //displayPlayers(t.gamers); //actualizar los jugadores
                    console.log(t)
                    turnButton.removeEventListener('click', (event) => { });
                  }
                }
              });
            } //card: detectar si un jugador quiere tirar una carta

            //card: detectar si alguien quiere robar una carta
            let pickCards = document.getElementById('table').querySelector('img');
            pickCards.addEventListener('click', (event) => {
              let gamerTurn = t.gamers[turn];
              if (t.table[t.table.length - 1].cardName == pickCards.className) {
                t.pickCard(gamerTurn); //un jugador roba una carta
                displayPlayers(t.gamers); //actualizar  los jugadores
                updateDeskCard(pickCards, t.table[t.table.length - 1]); //actualizar las cartas de table (el monton de robar)

                //hacer que cambie de turno o pueda tirar carta despues de robar

                console.log(t);
              }
            });//card: detectar si alguien quiere robar una carta
            ganador = score(t);
            console.log("Ganador:" + ganador)
          } //while: ganador
        });//button: turnButton

      });//button: Start Game
    } // if else: hay suficientes jugadores
  }); //form: Nombre de jugadores
}); //form: Numero de jugadores
