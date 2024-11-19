import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';

// https://vite.dev/config/
export default ({ mode }) => {
  return defineConfig({
    base: './',
    plugins: [
      vue(),
      Components({
        resolvers: [
          PrimeVueResolver()
        ]
      }),
    ],
  })
}
