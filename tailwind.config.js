module.exports = {
  content: [
    './*.html',    // Scan HTML files for Tailwind classes
    './assets/styles.css'  // Scan styles.css for @apply and other directives
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}