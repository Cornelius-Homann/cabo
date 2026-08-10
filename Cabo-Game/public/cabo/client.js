import { rtdb } from './firebase.js';
import { ref, set, push, update, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// DOM Elements
const caboBtn = document.getElementById('caboBtn');
const drawPile = document.getElementById('drawPile');
const discardPile = document.getElementById('discardPile');
const drawnCardSlot = document.getElementById('drawnCardSlot');

/**
 * 1. CREATE A NEW GAME ROOM IN FIREBASE
 * @param {string} roomId - e.g. "room_101" or a 4-letter room code like "CABO"
 * @param {string} hostName - Name of the player creating the room
 */
export async function createGameRoom(roomId, hostName = "Host Player") {
  const roomRef = ref(rtdb, `game_rooms/${roomId}`);

  const initialRoomState = {
    roomId: roomId,
    status: "waiting", // 'waiting' | 'playing' | 'ended'
    createdAt: Date.now(),
    currentTurn: "south",
    caboCalledBy: null,
    drawnCard: null,
    drawPile: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // CABO cards
    discardPile: [],
    players: {
      south: {
        name: hostName,
        cards: [5, 2, 8, 1], // Initial 4 cards
        penaltyCards: [],
        score: 0
      }
    }
  };

  try {
    await set(roomRef, initialRoomState);
    console.log(`Room "${roomId}" created successfully in Firebase!`);
  } catch (error) {
    console.error("Error creating room:", error);
  }
}

/**
 * 2. HELPER TO RENDER A CARD VALUE ON ANY CARD SLOT
 */
export function setCardValue(slotElement, value, isFaceUp = true) {
  if (!slotElement) return;

  if (value === null || value === undefined) {
    slotElement.textContent = "";
    delete slotElement.dataset.value;
    slotElement.classList.remove('has-card', 'active-card');
  } else if (!isFaceUp) {
    slotElement.textContent = "🂠";
    slotElement.dataset.value = "facedown";
    slotElement.classList.add('has-card');
  } else {
    slotElement.textContent = value;
    slotElement.dataset.value = value; // Stores card value (e.g. 7) for image rendering
    slotElement.classList.add('has-card');
  }
}

/**
 * 3. RENDER ALL CARDS FOR A PLAYER
 * - Standard 4 cards (indices 0..3) render into .grid-2x2
 * - Any extra cards (indices 4+) render into .extra-cards to the right
 * 
 * @param {string|HTMLElement} playerSlotElementOrId - e.g. 'player-south' or DOM element
 * @param {Array<number|string>} cardsArray - Array of card values, e.g. [5, 2, 8, 1, 9, 3]
 * @param {boolean|Array<boolean>} isFaceUp - Face-up status
 */
export function renderPlayerCards(playerSlotElementOrId, cardsArray = [], isFaceUp = false) {
  const container = typeof playerSlotElementOrId === 'string'
    ? document.getElementById(playerSlotElementOrId)
    : playerSlotElementOrId;

  if (!container) return;

  const grid2x2 = container.querySelector('.grid-2x2');
  let extraCardsContainer = container.querySelector('.extra-cards');

  if (!extraCardsContainer) {
    const cardsLayout = container.querySelector('.cards-layout');
    if (cardsLayout) {
      extraCardsContainer = document.createElement('div');
      extraCardsContainer.className = 'extra-cards';
      cardsLayout.appendChild(extraCardsContainer);
    }
  }

  // A. Standard 4 Cards (Indices 0..3) inside .grid-2x2
  if (grid2x2) {
    const standardSlots = grid2x2.querySelectorAll('.card-slot');
    for (let i = 0; i < 4; i++) {
      const slot = standardSlots[i];
      if (!slot) continue;

      if (i < cardsArray.length) {
        const faceUp = Array.isArray(isFaceUp) ? !!isFaceUp[i] : !!isFaceUp;
        setCardValue(slot, cardsArray[i], faceUp);
      } else {
        setCardValue(slot, null);
      }
    }
  }

  // B. Extra Cards (Indices 4+) inside .extra-cards (to the right)
  if (extraCardsContainer) {
    extraCardsContainer.innerHTML = ''; // Reset extra cards container
    for (let i = 4; i < cardsArray.length; i++) {
      const extraSlot = document.createElement('div');
      extraSlot.className = 'card-slot has-card';
      extraSlot.dataset.slot = i;

      const faceUp = Array.isArray(isFaceUp) ? !!isFaceUp[i] : !!isFaceUp;
      setCardValue(extraSlot, cardsArray[i], faceUp);

      extraCardsContainer.appendChild(extraSlot);
    }
  }
}

// Expose renderPlayerCards globally for DevTools / window calls
// @ts-ignore
window.renderPlayerCards = renderPlayerCards;

// Attach live listener to 'room_demo'
const gameStateRef = ref(rtdb, 'game_rooms/room_demo');

onValue(gameStateRef, (snapshot) => {
  const gameState = snapshot.val();
  if (gameState) {
    console.log("Live Game State Updated from RTDB:", gameState);

    if (gameState.players) {
      Object.keys(gameState.players).forEach((position) => {
        const player = gameState.players[position];
        if (player && Array.isArray(player.cards)) {
          renderPlayerCards(`player-${position}`, player.cards, player.isFaceUp || false);
        }
      });
    }
  }
});
