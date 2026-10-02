/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFDFC',
        charcoal: {
          900: '#181514',
          800: '#272321', // Dark text
          700: '#3D3734',
          600: '#524B47',
          500: '#756B66', // Secondary text
          400: '#9E938D',
          300: '#C7BFB9',
          200: '#EDE3DE', // Border
          100: '#F5EFEB',
          50: '#FAF7F5',
        },
        peach: {
          50: '#FFF8F5',
          100: '#FFF3ED', // Very light peach
          200: '#FCE8DE', // Light peach
          300: '#FAD2C0',
          400: '#F7B596',
          500: '#F4A582', // Primary peach
          600: '#E2865E',
          700: '#C7673D',
          800: '#A14C28',
          900: '#7A3519',
        },
        status: {
          healthy: '#10B981',
          'healthy-light': '#ECFDF5',
          'healthy-border': '#A7F3D0',
          warning: '#D97706',
          'warning-light': '#FFFBEB',
          'warning-border': '#FDE68A',
          critical: '#E05252',
          'critical-light': '#FEF2F2',
          'critical-border': '#FECACA',
          info: '#3B82F6',
          'info-light': '#EFF6FF',
          'info-border': '#BFDBFE',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(39, 35, 33, 0.05), 0 1px 2px 0 rgba(39, 35, 33, 0.03)',
        'card': '0 4px 16px -2px rgba(39, 35, 33, 0.06), 0 2px 6px -1px rgba(39, 35, 33, 0.03)',
        'elevated': '0 12px 32px -4px rgba(39, 35, 33, 0.08), 0 4px 12px -2px rgba(39, 35, 33, 0.04)',
        'peach-glow': '0 4px 20px -2px rgba(244, 165, 130, 0.35)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      }
    },
  },
  plugins: [],
}
