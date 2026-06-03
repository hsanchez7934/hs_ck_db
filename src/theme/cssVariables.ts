import {ThemeMode, ThemeTokens, themeTokens} from './tokens'

const cssVarMap: Record<keyof ThemeTokens, string> = {
	bgPrimary: '--bg-primary',
	bgSecondary: '--bg-secondary',
	bgSurface: '--bg-surface',
	bgElevated: '--bg-elevated',
	textPrimary: '--text-primary',
	textSecondary: '--text-secondary',
	textMuted: '--text-muted',
	accent: '--accent',
	accentHover: '--accent-hover',
	accentMuted: '--accent-muted',
	border: '--border',
	borderSubtle: '--border-subtle',
	shadow: '--shadow',
	shadowGlow: '--shadow-glow',
	overlay: '--overlay',
	appBar: '--app-bar',
	drawer: '--drawer-gradient',
	gradientFrom: '--gradient-from',
	gradientTo: '--gradient-to',
	glassBg: '--glass-bg',
	glassBorder: '--glass-border',
	success: '--success',
	error: '--error'
}

export function applyThemeToDocument(mode: ThemeMode): void {
	const tokens = themeTokens[mode]
	const root = document.documentElement

	root.setAttribute('data-theme', mode)
	root.style.colorScheme = mode

	Object.entries(cssVarMap).forEach(([tokenKey, cssVar]) => {
		root.style.setProperty(cssVar, tokens[tokenKey as keyof ThemeTokens])
	})

	const metaThemeColor = document.querySelector('meta[name="theme-color"]')
	if (metaThemeColor) {
		metaThemeColor.setAttribute('content', tokens.bgPrimary)
	}
}

export function getInitialThemeMode(): ThemeMode {
	if (typeof window === 'undefined') {
		return 'dark'
	}

	const stored = localStorage.getItem('cocktail-explorer-theme')
	if (stored === 'light' || stored === 'dark') {
		return stored
	}

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
