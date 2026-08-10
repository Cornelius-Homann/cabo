import { rtdb } from './firebase.js';
import { ref, set, update, push, remove, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// DOM Elements
const liveJsonView = document.getElementById('liveJsonView');
const btnCreateRoom = document.getElementById('btnCreateRoom');
const btnUpdateTurn = document.getElementById('btnUpdateTurn');
const btnAddPlayer = document.getElementById('btnAddPlayer');
const btnPushMsg = document.getElementById('btnPushMsg');
const btnTxScore = document.getElementById('btnTxScore');
const btnDeleteRoom = document.getElementById('btnDeleteRoom');
const btnClearAll = document.getElementById('btnClearAll');

// Base reference in RTDB for our playground exercises
const sandboxRef = ref(rtdb, 'sandbox_demo');
const roomRef = ref(rtdb, 'sandbox_demo/rooms/ROOM1');

// ============================================================================
// 1. LIVE READ (SYNC): Listen for changes in real-time
// ============================================================================
onValue(sandboxRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    liveJsonView.textContent = JSON.stringify(data, null, 2);
  } else {
    liveJsonView.textContent = "// sandbox_demo node is currently empty (null)";
  }
});


// ============================================================================
// 2. CREATE / OVERWRITE: set()
// ============================================================================
btnCreateRoom.addEventListener('click', async () => {
  console.log("--> Creating/Overwriting ROOM1...");
  
  const initialRoomData = {
    roomId: "ROOM1",
    status: "waiting",
    turn: 0,
    caboCalled: false,
    players: {
      "player_1": { name: "Alice", score: 0, cards: [4, 7, 2, 9] },
      "player_2": { name: "Bob", score: 0, cards: [1, 10, 5, 3] }
    },
    createdTime: Date.now()
  };

  // set() overwrites the entire node at 'sandbox_demo/rooms/ROOM1'
  await set(roomRef, initialRoomData);
  alert("Room ROOM1 created with set()!");
});


// ============================================================================
// 3. UPDATE SPECIFIC FIELDS: update()
// ============================================================================
btnUpdateTurn.addEventListener('click', async () => {
  console.log("--> Updating turn counter in ROOM1...");
  
  // update() only changes specified keys without touching other player/room properties!
  await update(roomRef, {
    turn: Math.floor(Math.random() * 4),
    status: "in_progress"
  });
});

btnAddPlayer.addEventListener('click', async () => {
  console.log("--> Adding player 3 to ROOM1...");
  
  // Using multi-path update to target a specific player inside the room
  const player3Ref = ref(rtdb, 'sandbox_demo/rooms/ROOM1/players/player_3');
  await set(player3Ref, { name: "Charlie", score: 0, cards: [8, 0, 11, 4] });
});


// ============================================================================
// 4. APPEND TO LIST WITH AUTO-ID: push()
// ============================================================================
btnPushMsg.addEventListener('click', async () => {
  console.log("--> Pushing new chat message...");
  const chatRef = ref(rtdb, 'sandbox_demo/rooms/ROOM1/chat');
  
  // push() generates a unique push-key (e.g. -O9Xk_mZa123...)
  await push(chatRef, {
    sender: "Alice",
    message: `Hello! Time is ${new Date().toLocaleTimeString()}`
  });
});


// ============================================================================
// 5. ATOMIC TRANSACTIONS: runTransaction()
// ============================================================================
btnTxScore.addEventListener('click', async () => {
  console.log("--> Safely incrementing Alice's score with runTransaction...");
  const scoreRef = ref(rtdb, 'sandbox_demo/rooms/ROOM1/players/player_1/score');
  
  // runTransaction ensures that even if 2 players click simultaneously, the score increases accurately
  await runTransaction(scoreRef, (currentScore) => {
    return (currentScore || 0) + 5;
  });
});


// ============================================================================
// 6. DELETE SPECIFIC NODE: remove()
// ============================================================================
btnDeleteRoom.addEventListener('click', async () => {
  console.log("--> Deleting ROOM1...");
  // remove() deletes 'sandbox_demo/rooms/ROOM1'
  await remove(roomRef);
});


// ============================================================================
// 7. CLEAR ALL: set(ref, null)
// ============================================================================
btnClearAll.addEventListener('click', async () => {
  console.log("--> Wiping all sandbox data...");
  await set(sandboxRef, null);
});


// ============================================================================
// 🎯 YOUR PRACTICE EXERCISES (Try writing these functions!)
// ============================================================================

/**
 * TASK 1: Add a 5th card to player_1's cards array.
 * Hint: Use get() or update() on ref(rtdb, 'sandbox_demo/rooms/ROOM1/players/player_1/cards')
 */
export async function addCardToPlayer() {
  // TODO: Your code here!
}

/**
 * TASK 2: Call CABO!
 * Update caboCalled to true and record caboCaller: "Alice" in ROOM1.
 */
export async function callCabo() {
  // TODO: Your code here!
}
