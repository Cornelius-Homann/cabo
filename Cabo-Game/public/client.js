import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Platzhalter – später fügen wir hier deine Supabase-Schlüssel ein:
const SUPABASE_URL = 'https://dein-projekt.supabase.co';
const SUPABASE_ANON_KEY = 'DEIN_PUBLIC_ANON_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

let myId = crypto.randomUUID();
let players = {};

async function init() {
  // Verbinde Realtime-Channel
  const channel = supabase.channel('public:players')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        players[payload.new.id] = payload.new;
      } else if (payload.eventType === 'DELETE') {
        delete players[payload.old.id];
      }
      draw();
    });
  await channel.subscribe();

  // Füge eigenen Spieler hinzu
  const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  players[myId] = { id: myId, x: 100, y: 100, color };
  await supabase.from('players').upsert(players[myId]);

  // Steuerung
  window.addEventListener('keydown', async (e) => {
    const p = players[myId];
    if (!p) return;
    if (e.key === 'ArrowUp') p.y -= 10;
    if (e.key === 'ArrowDown') p.y += 10;
    if (e.key === 'ArrowLeft') p.x -= 10;
    if (e.key === 'ArrowRight') p.x += 10;
    await supabase.from('players').upsert(p);
    draw();
  });

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const id in players) {
    const p = players[id];
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 20, 20);
  }
  status.textContent = `Spieler: ${Object.keys(players).length}`;
}

init();
