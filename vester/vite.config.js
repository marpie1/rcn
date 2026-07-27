import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Served from a subpath, not a domain root: sofi-proxy maps /vester/ to
  // vester/dist/, and the nginx plan routes /vester/ the same way. Without
  // this the built asset URLs are absolute /assets/... and 404 there.
  base: '/vester/',
  plugins: [react()],
})
