import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // Scan all of src so class names referenced outside components/app
    // (e.g. the avatar gradient palette in src/lib/format.ts) aren't purged.
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
