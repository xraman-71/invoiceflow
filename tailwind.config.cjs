/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        'primary-dark': '#4F46E5',
        'violet-soft': '#8B5CF6',
        'bg-main': '#f8fafc',
        'bg-section': '#ffffff',
        'bg-tint': '#f1f5f9',
        'text-primary': '#111827',
        'text-secondary': '#374151',
        'text-muted': '#6B7280',
        'border-light': '#E5E7EB',
        'border-input': '#D1D5DB',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
