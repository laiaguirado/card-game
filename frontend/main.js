import * as uno from "uno";

//functions
function asegurarPlayers() {
  //asegurar que haya el num de jugadores indicado
  const mainElement = document.querySelector("main");
  const inputNumPlayers = document.querySelector("input");
  let numPlayers = inputNumPlayers.value;
  console.log("Number of players: " + numPlayers);

  let info = document.getElementById("info");
  let pNumPlayers = document.createElement("p");
  pNumPlayers.textContent = "Number of players: " + numPlayers;
  info.appendChild(pNumPlayers);

  document.querySelector("form").remove();

  const formPlayer = document.createElement("form");
  const buttonPlayer = document.createElement("button");
  const inputPlayer = document.createElement("input");

  buttonPlayer.innerText = "Add";
  inputPlayer.type = "text";
  inputPlayer.name = "player";
  inputPlayer.placeholder = " Type your username....";
  inputPlayer.autofocus = "true";

  mainElement.appendChild(formPlayer);
  formPlayer.appendChild(inputPlayer);
  formPlayer.appendChild(buttonPlayer);

  return numPlayers;
}

function createStartButton() {
  //creamos el boton: start game!
  const startButton = document.createElement("button");
  startButton.setAttribute("id", "start-game");
  startButton.textContent = "Start game!";

  return startButton;
}

function displayPlayers(gamers, turn) {
  //mostrar por pantalla los jugadores y sus cartas
  const players = document.getElementById("players");
  players.textContent = "";
  for (let gamer of gamers) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = "Player " + gamer.gamerNum + " : " + gamer.name;
    players.appendChild(li);
    li.append(p);
    li.setAttribute("player", gamer.gamerNum);
    for (let i = 0; i < gamer.numCards(); i++) {
      const img = document.createElement("img");
      img.src = gamer.cards[i].showImage(gamer.cards[i].cardName);
      img.setAttribute("class", gamer.cards[i].cardName);
      li.append(img);
    }
  }
  showUnoButton(turn, gamers);
}

function displayFullTableCards(cardsInGame, nameCardsInGame, table, nameTable) {
  //mostrar las cartas de cardsInGame y table
  const mainElement = document.querySelector("main");
  const divFullTable = document.getElementById("fullTable");
  divFullTable.textContent = "";
  const divCardsInGame = document.createElement("div");
  const divTable = document.createElement("div");
  divCardsInGame.setAttribute("id", "cardsInGame");
  divTable.setAttribute("id", "table");

  const imgCardsInGame = document.createElement("img");
  const imgTable = document.createElement("img");
  const pCardsInGame = document.createElement("p");
  const pTable = document.createElement("p");
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

function updateCardInGame(cardPreGame, cardGame) {
  //actualizar: muestra la ultima carta que se acaba de tirar a cardsInGame
  let divTable = document.getElementById("cardsInGame");
  divTable.replaceChild(cardGame, cardPreGame);
}

function updateDeskCard(t,cardsPreGame, card) {
  //actualizar: muestra la siguiente carta del monton de robar
  let divTable = document.getElementById("table");
  const imgCardGame = document.createElement("img");
  imgCardGame.src = card.showImage(card.cardName);
  imgCardGame.setAttribute("class", card.cardName);
  divTable.replaceChild(imgCardGame, cardsPreGame);
}

function displayFirstTurn(t) {
  //dar el turno al primer jugador
  const turnDiv = document.createElement("div");
  turnDiv.setAttribute("id", "turn-info");
  const turnp = document.createElement("p");
  turnp.textContent = "It's your turn: ";
  const turnButton = document.createElement("button");
  turnButton.textContent = t.gamers[0].name;
  turnButton.setAttribute("id", "turnButton");

  const info = document.getElementById("info");
  info.appendChild(turnDiv);
  turnDiv.appendChild(turnp);
  turnDiv.appendChild(turnButton);

  t.gamers[0].myTurn();

  return turnButton;
}

function updateTurn(t, turn, numPlayers, direction) {
  //actualizar: dar el turno al siguiente jugador
  t.gamers[turn].myTurn();
  if(direction==false){
    turn = (turn + 1) % numPlayers;
  }else{
    if(turn == 0){
      turn = numPlayers-1;
    }else{
      turn = Math.abs((turn -1)) % numPlayers;
    }
  }

  let turnButton = document.getElementById("turnButton");
  turnButton.textContent = t.gamers[turn].name;

  t.gamers[turn].myTurn();
  return turn;
}

function showUnoButton(turn, gamers) {
  //mostrar el boton de Uno
  let pUno = document.getElementById("playerUno_" + gamers[turn].name);
  if (gamers[turn].numCards() == 2 && pUno != undefined) {
    pUno.remove();
  }
  if (gamers[turn].numCards() == 2) {
    let player = document.getElementsByTagName("li")[turn];

    let p = document.createElement("p");
    p.setAttribute("id", "uno");
    let buttonUno = document.createElement("button");
    buttonUno.textContent = "UNO";
    p.append(buttonUno);
    player.append(p);

    buttonUno.addEventListener("click", (event) => {
      let divUno = document.getElementById("unoPlayers");
      console.log(">> A " + gamers[turn].name + " le queda UNO!");
      if (divUno == null) {
        let divUno = document.createElement("div");
        divUno.setAttribute("id", "unoPlayers");
        let info = document.getElementById("info");
        let p = document.createElement("p");
        p.setAttribute("id", "playerUno_" + gamers[turn].name);
        p.textContent = gamers[turn].name + " has said UNO!";
        divUno.appendChild(p);
        info.appendChild(divUno);
      } else {
        let p = document.createElement("p");
        p.setAttribute("id", "playerUno_" + gamers[turn].name);
        p.textContent = gamers[turn].name + " has said UNO!";
        divUno.appendChild(p);
      }
    });
  }
}

function score(t) {
  //comprobar si alguien ha ganado
  let ganador = false;
  for (let gamer of t.gamers) {
    if (gamer.isEmpty()) {
      ganador = true;
      let divInfo = document.getElementById("info");
      let pGanador = document.createElement("p");
      pGanador.setAttribute("id", "ganador");
      pGanador.textContent = gamer.name + " wins the game!!";

      divInfo.appendChild(pGanador);
      console.log(">> " + gamer.name + " wins the game!!");
    }
  }
  return ganador;
}

//program...
let turn = 0;
let pickUp=false, direction=false;
const mainElement = document.querySelector("main");

//form: Numero de jugadores
const formNumPlayers = document.querySelector("form");
formNumPlayers.addEventListener("submit", (event) => {
  event.preventDefault();
  let numPlayers = asegurarPlayers();

  let gamers = [];
  //form: Nombre de jugadores
  const formPlayer = document.querySelector("form");
  formPlayer.addEventListener("submit", (event) => {
    event.preventDefault();
    let input = document.querySelector("input");
    gamers = uno.createGamer(gamers, input);
    displayPlayers(gamers, turn); 

    if (gamers.length != numPlayers) {
      console.log(">> Waiting for players...");
    } else {
      let startButton = createStartButton(); 
      mainElement.appendChild(startButton); 
      formPlayer.remove(); //eliminar el form para que no se pueda añadir más jugadores
      //button: Start Game
      startButton.addEventListener("click", (event) => {
        event.preventDefault();
        startButton.remove(); //eliminar el boton: start game!

        let t = uno.startGame(gamers); //poner los datos para empezar el juego
        displayPlayers(t.gamers, turn);
        displayFullTableCards(t.cardsInGame,"Card in game:",t.table,"Deck of cards to take:"); 
        console.log(">> The initial table is:");
        console.log(t);

        //button: turnButton
        let turnButton = displayFirstTurn(t); 
        turnButton.addEventListener("click", (event) => {
          displayPlayers(t.gamers, turn);

          //card: comprovar si la ultima carta que hay en CardsInGame (la que acaban de tirar) es especial (+4, +2)
          if (pickUp==true) {
            turn = specialCards(t,turn);
            pickUp=false;
          } else {
            //card: detectar si el jugador quiere tirar una carta
            let cardImages = document.getElementById("players").querySelectorAll("img");
            for (let i = 0; i < cardImages.length; i++) {
              cardImages[i].addEventListener("click", (event) => {
                pickUp = touchCard(t, cardImages, i, pickUp);
              });
            }
            //card: detectar si el jugador quiere robar una carta
            let pickCards = document.getElementById("table").querySelector("img");
            pickCards.addEventListener("click", (event) => {
              pickUp = touchInGameCard(t, pickCards, pickUp);
            }); //card: detectar si alguien quiere robar una carta
          }
        }); //button: turnButton
      }); //button: Start Game
    } // if else: hay suficientes jugadores
  }); //form: Nombre de jugadores
}); //form: Numero de jugadores

//event functions
function touchCard(t, cardImages, i, pickUp) {
  let gamerTurn = t.gamers[turn];
  for (let j = 0; j < gamerTurn.numCards(); j++) {
    if (gamerTurn.cards[j].cardName == cardImages[i].className) {
      t.throwCard(gamerTurn.cards[j], t.gamers[turn], j); //un jugador tira una carta
      
      //actualizar las cartas de cardsInGame(monton de cartas en jugada)
      let cardPreGame = document.getElementById("cardsInGame").querySelector("img");
      updateCardInGame(cardPreGame, cardImages[i]);
      
      //comprovar si hay ha tirado una carta especial
      if(t.cardsInGame[t.cardsInGameLength() - 1].cardName.includes("+4") ||
      t.cardsInGame[t.cardsInGameLength() - 1].cardName.includes("+2") ){
        console.log("he entrado")
        pickUp = true;
      }
      if(t.cardsInGame[t.cardsInGameLength() - 1].cardName.includes("Direction")){
        direction=!direction;
      }
      if(t.cardsInGame[t.cardsInGameLength() - 1].cardName.includes("Forbbiden")){
        turn = updateTurn(t, turn, t.gamers.length, direction);
      }

      //comprovar si hay un ganador
      let ganador = score(t);
      if (ganador == true) {
        let turnInfo = document.getElementById("turn-info");
        turnInfo.remove();
        let divUnoPlayers = document.getElementById("unoPlayers");
        if (divUnoPlayers != null) {
          divUnoPlayers.remove();
        }
        console.log(t);
      } else {
        turn = updateTurn(t, turn, t.gamers.length, direction);
      }
    }
  }
  return pickUp;
} //end touchCard

function touchInGameCard(t, pickCards, pickUp) {
  let gamerTurn = t.gamers[turn];
  if (t.table[t.table.length - 1].cardName == pickCards.className) {
    t.pickCard(gamerTurn); //un jugador roba una carta
    displayPlayers(t.gamers, turn); 
    updateDeskCard(t, pickCards, t.table[t.table.length - 1]); //actualizar las cartas de table (el monton de robar)

    //card: detectar si un jugador quiere tirar una carta
    let cardImages = document.getElementById("players").querySelectorAll("img");
    for (let i = 0; i < cardImages.length; i++) {
      cardImages[i].addEventListener("click", (event) => {
        pickUp = touchCard(t, cardImages, i, pickUp);
      });
    }

    //button: detectar si un jugador quiere pasar de turno porque no tiene cartas y ya ha robado
    let player = document.getElementsByTagName("li")[turn];
    let p = document.createElement("p");
    p.setAttribute("id", "skip");
    let pasarButton = document.createElement("button"); //boton para despues de robar, poder pasar
    pasarButton.textContent = "SKIP";
    p.append(pasarButton);
    player.append(p);
    pasarButton.addEventListener("click", (event) => {
      console.log(">> " + gamerTurn.name + " passes the turn");
      turn = updateTurn(t, turn, t.gamers.length, direction); //actualizamos para que le toque al siguiente cuando ha tirado el anterior
    });
  }
  return pickUp;
} //end touchInGameCard


function specialCards(t,turn){
  if (t.cardsInGame[t.cardsInGameLength() - 1].cardName.includes("+4")) {
    console.log(">> The special card +4️⃣ has been thrown");
    for (let i = 0; i < 4; i++) {
      t.pickCard(t.gamers[turn]); //un jugador roba una carta
      displayPlayers(t.gamers, turn); 
      let pick4Cards = document.getElementById("table").querySelector("img");
      updateDeskCard(t, pick4Cards, t.table[t.table.length - 1]); //actualizar las cartas de table (el monton de robar)
    }
    turn = updateTurn(t, turn, t.gamers.length, direction);
  } else if (t.cardsInGame[t.cardsInGameLength() - 1].cardName.includes("+2")) {
    console.log(">> The special card +2️⃣ has been thrown");
    for (let i = 0; i < 2; i++) {
      t.pickCard(t.gamers[turn]); //un jugador roba una carta
      displayPlayers(t.gamers, turn); 
      let pick4Cards = document.getElementById("table").querySelector("img");
      updateDeskCard(t, pick4Cards, t.table[t.table.length - 1]); //actualizar las cartas de table (el monton de robar)
    }
    turn = updateTurn(t, turn, t.gamers.length, direction);
  }
  return turn;
}