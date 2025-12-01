import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  // Относительные пути нужны, чтобы прод-сборка корректно работала из подкаталога
  // при размещении мини-приложения на статиках или в Telegram WebApp контейнере.
  base: "./",
  plugins: [react()],
})
