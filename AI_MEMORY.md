# CABO Game — Project Memory & AI Knowledge Transfer

## Project Overview
Multiplayer web implementation of the card game **CABO** for 2 to 4 players.

## Technology Stack
- **Frontend**: Vanilla HTML5, CSS3 (Responsive Grid/Flexbox), ES6 JavaScript Modules.
- **Backend / Database**: Firebase Realtime Database (`rtdb`).
- **Future Considerations**: Potential refactor to React once core RTDB state synchronization & game rules are established.

## File Structure & Organization
- **Root Overview**: `Cabo-Game/public/` (Contains general portfolio / overview index files).
- **CABO Project Subfolder**: `Cabo-Game/public/cabo/` (Contains all CABO specific game & lobby files).

```
cabo/
├── AI_MEMORY.md                             # AI Context & Knowledge Transfer
├── package.json                             # Project metadata & start scripts
├── Cabo-Game/
│   └── public/
│       ├── index.html                       # General Overview page (Link to cabo/lobby.html)
│       ├── index.js                         # General Overview JS
│       ├── style.css                        # General Overview CSS
│       └── cabo/                            # CABO GAME PROJECT FOLDER
│           ├── firebase.js                  # Firebase Initialization (Exports `rtdb`)
│           ├── lobby.html                   # CABO Lobby (Name Input, Create/Join 4-Letter Room Code)
│           ├── lobby.js                     # CABO Lobby JS Logic (User Editable)
│           ├── game.html                    # CABO Game Board Table (4-Player Card Layout)
│           ├── client.js                    # Game Board Script & Database Sync
│           └── cabostyle.css                # CABO Game & Lobby Styles
```

## Navigation Architecture
1. **`index.html` (Projects Overview)**:
   - Simple link button to `cabo/lobby.html`.
2. **`cabo/lobby.html` (CABO Game Lobby)**:
   - Step 1: Enter Player Name.
   - Step 2: Create New Room OR Join 4-Letter Room Code.
   - Redirects to `game.html?room=CODE`.
3. **`cabo/game.html` (CABO Game Table)**:
   - Responsive 4-player cardinal card game board.

## Card Layout Architecture
- **Standard Cards**: The first 4 cards (indices 0..3) are rendered inside `.grid-2x2` (a 2-by-2 grid).
- **Extra Cards**: Any additional cards beyond index 3 are dynamically appended to `.extra-cards` located to the right of `.grid-2x2`.
- **Flex Layout**: `.extra-cards` uses vertical flex-wrap with a max-height matching `.grid-2x2`, creating clean 2-row columns that expand horizontally to the right for any number of extra cards.
- **Rendering Logic**: `renderPlayerCards(playerSlot, cardsArray, isFaceUp)` in [`client.js`](file:///C:/Users/neush/Documents/cabo/cabo/Cabo-Game/public/cabo/client.js) handles UI card synchronization.

