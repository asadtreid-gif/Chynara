import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        garden: {
          50: '#F7F5F0',
          100: '#E5F0E6',
          200: '#C8E0CB',
          300: '#A8D5BA',
          400: '#6FA876',
          500: '#3D7A47',
          600: '#2E7D4F',
          700: '#1B5E3B',
          800: '#164A2F',
          900: '#0F1F14',
        },
      },
      boxShadow: {
        soft: '0 4px 24px rgba(27, 94, 59, 0.08)',
        card: '0 8px 32px rgba(27, 94, 59, 0.1)',
      },
    },
  },
  plugins: [],
}
export default config
