import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' permite publicar el build en GitHub Pages o abrirlo desde cualquier carpeta
export default defineConfig({
  plugins: [react()],
  base: './',
});
