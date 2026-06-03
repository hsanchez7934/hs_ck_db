/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--bg-primary)',
				secondary: 'var(--bg-secondary)',
				surface: 'var(--bg-surface)',
				elevated: 'var(--bg-elevated)',
				foreground: 'var(--text-primary)',
				muted: 'var(--text-muted)',
				accent: 'var(--accent)',
				'accent-hover': 'var(--accent-hover)',
				border: 'var(--border)'
			},
			boxShadow: {
				glow: 'var(--shadow-glow)',
				theme: 'var(--shadow)'
			},
			backgroundImage: {
				'app-gradient': 'linear-gradient(180deg, var(--gradient-from) 0%, var(--gradient-to) 100%)'
			}
		}
	},
	plugins: []
}
