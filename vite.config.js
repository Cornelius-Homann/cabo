import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'Cabo-Game/public',
  envDir: '../../',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'Cabo-Game/public/index.html'),
        lobby: resolve(import.meta.dirname, 'Cabo-Game/public/cabo/lobby.html'),
        game: resolve(import.meta.dirname, 'Cabo-Game/public/cabo/game.html'),
      },
    },
  },
});
