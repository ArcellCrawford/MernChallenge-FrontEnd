import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
//connects tailwind css to vite
import tailwindcss from '@tailwindcss/vite' 
// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
   server: {
    proxy: {
      '/api': {
        //Backend server address
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
