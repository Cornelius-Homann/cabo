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

// Attach live listener to 'room_demo'
const gameStateRef = ref(rtdb, 'game_rooms/room_demo');

onValue(gameStateRef, (snapshot) => {
  const gameState = snapshot.val();
  if (gameState) {
    console.log("Live Game State Updated from RTDB:", gameState);
  }
});
