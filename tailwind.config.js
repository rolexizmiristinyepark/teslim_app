/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Custom colors for the application
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Custom gray scale for better consistency
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Brand colors for animated buttons
        'rolex-green': '#145c3a',
        'rolex-blue': '#003057',
        'tudor-red': '#be0300',
        'gold': '#ffc506',
        // Main text color override
        'text-main': '#243C4C',
        // App specific colors
        'mint': {
          50: '#F4FCFB',
          100: '#e6f7ff',
          200: '#b3e5ff',
          300: '#80d4ff',
          400: '#4dc3ff',
          500: '#1ab2ff',
          600: '#0099e6',
          700: '#0080cc',
          800: '#0066b3',
          900: '#004d99',
        },
        'border-gray': '#ACBCBF',
      },
      // Override default text colors to use our main color
      textColor: {
        'black': '#243C4C',
        'gray-900': '#243C4C',
        'gray-800': '#243C4C',
        'gray-700': '#243C4C',
        'gray-600': '#243C4C',
        'gray-500': '#243C4C',
        'gray-400': '#243C4C',
        'slate-900': '#243C4C',
        'slate-800': '#243C4C',
        'slate-700': '#243C4C',
        'slate-600': '#243C4C',
        'blue-600': '#243C4C',
        'blue-700': '#243C4C',
        'blue-800': '#243C4C',
        'green-600': '#243C4C',
        'green-700': '#243C4C',
        'green-800': '#243C4C',
        DEFAULT: '#243C4C',
      },
      // Custom spacing values
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Custom font families (if needed)
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['ui-serif', 'Georgia'],
        'mono': ['ui-monospace', 'SFMono-Regular'],
      },
      // Custom border radius values
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      // Custom box shadows
      boxShadow: {
        'soft': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
        'strong': '0 8px 16px 0 rgba(0, 0, 0, 0.15)',
      },
      // Custom animation
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [
    // Forms plugin for better form styling
    require('@tailwindcss/forms')({
      strategy: 'class', // Only add form styles to elements with .form-input, .form-select, etc.
    }),
    // Typography plugin for rich text
    require('@tailwindcss/typography'),
    // Aspect ratio plugin for responsive embeds
    require('@tailwindcss/aspect-ratio'),
  ],
  // Enable dark mode (optional)
  darkMode: 'class', // or 'media' for system preference
}
