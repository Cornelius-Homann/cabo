import { rtdb } from './firebase.js';
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// DOM Elements on Landing Page (index.html)
const playerNameInput = document.getElementById('playerNameInput');
const roomCodeInput = document.getElementById('roomCodeInput');
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');

// TODO: Write your Create Room & Join Room logic here!
// When room is created or joined -> redirect to: lobby.html?room=CODE
