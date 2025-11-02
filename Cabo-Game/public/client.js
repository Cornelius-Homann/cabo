import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const player = prompt("Dein Spielername:")

const cardsContainer = document.createElement("div")
cardsContainer.style.fontSize = "40px"
cardsContainer.style.display = "flex"
cardsContainer.style.gap = "10px"
document.body.appendChild(cardsContainer)

const drawBtn = document.createElement("button")
drawBtn.textContent = "🃏 Karte ziehen"
drawBtn.onclick = async () => {
  const { data } = await supabase
    .from('cards')
    .select('*')
    .eq('drawn', false)
    .limit(1)

  if (data.length === 0) return alert("Keine Karten mehr 😢")

  const card = data[0]
  await supabase
    .from('cards')
    .update({ drawn: true, owner: player })
    .eq('id', card.id)
}
document.body.appendChild(drawBtn)

async function loadCards() {
  const { data } = await supabase.from('cards').select('*')
  renderCards(data)
}

function renderCards(cards) {
  cardsContainer.innerHTML = ''
  for (const card of cards) {
    const el = document.createElement("div")
    el.textContent = card.value
    el.style.opacity = card.drawn ? 0.3 : 1
    el.title = card.owner ? `Gezogen von ${card.owner}` : "Noch im Stapel"
    cardsContainer.appendChild(el)
  }
}

// Realtime subscription
supabase
  .channel('realtime:cards')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, (payload) => {
    console.log("Kartenänderung erkannt:", payload)
    loadCards()
  })
  .subscribe()

loadCards()
