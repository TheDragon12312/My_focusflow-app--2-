import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // pas 'src' aan als jouw bronmap anders heet
    },
  },
  // andere configuraties
});