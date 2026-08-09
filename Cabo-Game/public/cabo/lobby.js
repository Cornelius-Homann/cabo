import { rtdb } from './firebase.js';
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// DOM Elements
const playerNameInput = document.getElementById('playerNameInput');
const roomCodeInput = document.getElementById('roomCodeInput');
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');

function generateRoomCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return code;
}
function createRoom(name) {
    const rtdbref = rtdb.ref("game_rooms/")
    const code = generateRoomCode();
    const roomObj = {
        roomId: code,
        turn: 0,
        cabopressed: false,
        players: [
            {
                name: name,
                cards: [],
                preview: null,
            }
        ]
    };
    window.location.href = `game.html?room=${code}`;
}
// TODO: Write your Create Room & Join Room JavaScript logic here!
// 1. Listen for clicks on createRoomBtn -> generate room code with generateRoomCode()
createRoomBtn.addEventListener('click', () => {
    if (playerNameInput.value.trim().length != 0) {
        createRoom(playerNameInput.value)
    }
})

// 2. Listen for clicks on joinRoomBtn -> read roomCodeInput.value
joinRoomBtn.addEventListener('click', () => {
    if (playerNameInput.value.trim().length != 0) {
        if(roomCodeInput.value.trim().length == 4) {
                
        }
    }
})
// 3. Save player name and redirect to: game.html?room=CODE

