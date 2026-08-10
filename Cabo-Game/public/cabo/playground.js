import { rtdb } from './firebase.js';
// @ts-ignore
import { ref, set, update, push, remove, onValue, runTransaction, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// DOM Elements
const liveJsonView = document.getElementById('liveJsonView');
const btnCreateRoom = document.getElementById('btnCreateRoom');
const btnUpdateTurn = document.getElementById('btnUpdateTurn');
const btnAddPlayer = document.getElementById('btnAddPlayer');
const btnPushMsg = document.getElementById('btnPushMsg');
const btnTxScore = document.getElementById('btnTxScore');
const btnDeleteRoom = document.getElementById('btnDeleteRoom');
const btnClearAll = document.getElementById('btnClearAll');
const btnTest = document.getElementById('btnTest')

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
      "player_1": { name: "Alice", score: 3, cards: [4, 7, 2, 9] },
      "player_2": { name: "Bob", score: 32, cards: [1, 10, 5, 3] }
    },
    createdTime: Date.now()
  };

  // set() overwrites the entire node at 'sandbox_demo/rooms/ROOM1'
  await set(roomRef, initialRoomData);
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
if (btnTest) {
  btnTest.addEventListener('click', async () => {
    console.log("--> Test button clicked");
  });
}

// Wire up Task buttons
document.getElementById('btnRunTask1')?.addEventListener('click', () => addCardToPlayer());
document.getElementById('btnRunTask2')?.addEventListener('click', () => callCabo());
document.getElementById('btnRunTask3')?.addEventListener('click', () => readAliceScore());
document.getElementById('btnRunTask4')?.addEventListener('click', () => calculateTotalScore());
document.getElementById('btnRunTask5')?.addEventListener('click', () => watchCurrentTurn());

// Expose functions to browser window so you can call them in DevTools F12 console
window.addCardToPlayer = addCardToPlayer;
window.callCabo = callCabo;
window.readAliceScore = readAliceScore;
window.calculateTotalScore = calculateTotalScore;
window.watchCurrentTurn = watchCurrentTurn;
/**
 * TASK 1: Add a 5th card to player_1's cards array.
 * Hint: Use get() or update() on ref(rtdb, 'sandbox_demo/rooms/ROOM1/players/player_1/cards')
 */
export async function addCardToPlayer() {
  // TODO: Your code here!
  const cardRef = ref(rtdb, 'sandbox_demo/rooms/ROOM1/players/player_1/cards');
  let newCards = []
  const snapshot = await get(cardRef)
  newCards = snapshot.val() || [];
  newCards[newCards.length] = 100;
  await set(cardRef, newCards)

}

/**
 * TASK 2: Call CABO!
 * Update caboCalled to true and record caboCaller: "Alice" in ROOM1.
 */
export async function callCabo() {
  // TODO: Your code here!
  const room1Ref = ref(rtdb, 'sandbox_demo/rooms/ROOM1')
  await update(room1Ref, {
    caboCaller: 'Alice',
    caboCalled: true
});
}
/**
 * TASK 3: One-Time Read (get)
 * Read Alice's score from 'sandbox_demo/rooms/ROOM1/players/player_1/score'
 * and log "Alice score is: [SCORE]" to the console.
 */
export async function readAliceScore() {
  // TODO: Your code here!
  const aliceScoreRef = ref(rtdb, 'sandbox_demo/rooms/ROOM1/players/player_1/score');
  const scoreSnap = await get(aliceScoreRef);
  if (scoreSnap.exists()) {
    console.log(scoreSnap.val());
  } else {
    console.log("-1");
  }
}

/**
 * TASK 4: Read & Loop (get)
 * Read all players from 'sandbox_demo/rooms/ROOM1/players',
 * loop through them, and calculate the total score of all players.
 */
export async function calculateTotalScore() {
  // TODO: Your code here!
  const playerArrRef = ref(rtdb, 'sandbox_demo/rooms/ROOM1/players');
  const playersSnap = await get(playerArrRef);
  let total = 0;
  playersSnap.forEach(snap => {
    const element = snap.val();
    total += element.score || 0; 
  });
  console.log(total);
}

/**
 * TASK 5: Real-time Listener (onValue)
 * Listen to live turn changes at 'sandbox_demo/rooms/ROOM1/turn'
 * and log "Turn changed to player: [TURN]" whenever it updates.
 */
export function watchCurrentTurn() {
  // TODO: Your code here!
  onValue(ref(rtdb, 'sandbox_demo/rooms/ROOM1/turn'), (turnSnap) => {
    const turnSnapVal = turnSnap.val();
    console.log("Turn changed to: " + turnSnapVal)
  })
}
