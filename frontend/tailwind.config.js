// tailwind.config.js
import forms from '@tailwindcss/forms'

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--primary)",      // #1976d2
          primary2: "var(--primary-2)",   // #42a5f5
          accent: "var(--accent)",        // #2e7d32
          bg: "var(--bg)",
          surface: "var(--surface)",
          text: "var(--text)",
          muted: "var(--muted)",
          border: "var(--border)",
        },
      },
      boxShadow: { card: "0 8px 24px rgba(2,6,23,.06)" },
      borderRadius: { xl2: "14px" },
    },
  },
  plugins: [forms()],
}