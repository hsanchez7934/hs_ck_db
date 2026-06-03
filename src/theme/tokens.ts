export type ThemeMode = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'cocktail-explorer-theme'

export type ThemeTokens = {
	bgPrimary: string
	bgSecondary: string
	bgSurface: string
	bgElevated: string
	textPrimary: string
	textSecondary: string
	textMuted: string
	accent: string
	accentHover: string
	accentMuted: string
	border: string
	borderSubtle: string
	shadow: string
	shadowGlow: string
	overlay: string
	appBar: string
	drawer: string
	gradientFrom: string
	gradientTo: string
	glassBg: string
	glassBorder: string
	success: string
	error: string
}

export const lightTokens: ThemeTokens = {
	bgPrimary: '#f4f6fb',
	bgSecondary: '#e8ecf4',
	bgSurface: '#ffffff',
	bgElevated: '#ffffff',
	textPrimary: '#12141c',
	textSecondary: '#3d4455',
	textMuted: '#6b7280',
	accent: '#0891b2',
	accentHover: '#0e7490',
	accentMuted: 'rgba(8, 145, 178, 0.12)',
	border: 'rgba(18, 20, 28, 0.12)',
	borderSubtle: 'rgba(18, 20, 28, 0.06)',
	shadow: '0 8px 32px rgba(18, 20, 28, 0.08)',
	shadowGlow: '0 0 24px rgba(8, 145, 178, 0.15)',
	overlay: 'rgba(18, 20, 28, 0.45)',
	appBar: 'rgba(255, 255, 255, 0.82)',
	drawer: 'linear-gradient(180deg, #ffffff 0%, #eef2f8 100%)',
	gradientFrom: '#eef2f8',
	gradientTo: '#f4f6fb',
	glassBg: 'rgba(255, 255, 255, 0.72)',
	glassBorder: 'rgba(18, 20, 28, 0.08)',
	success: '#059669',
	error: '#dc2626'
}

export const darkTokens: ThemeTokens = {
	bgPrimary: '#0b0d12',
	bgSecondary: '#12151c',
	bgSurface: '#171b24',
	bgElevated: '#1e2430',
	textPrimary: '#f3f4f6',
	textSecondary: '#c9ced8',
	textMuted: '#8b93a7',
	accent: '#22d3ee',
	accentHover: '#06b6d4',
	accentMuted: 'rgba(34, 211, 238, 0.14)',
	border: 'rgba(255, 255, 255, 0.1)',
	borderSubtle: 'rgba(255, 255, 255, 0.05)',
	shadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
	shadowGlow: '0 0 32px rgba(34, 211, 238, 0.18)',
	overlay: 'rgba(0, 0, 0, 0.72)',
	appBar: 'rgba(11, 13, 18, 0.85)',
	drawer: 'linear-gradient(180deg, #171b24 0%, #0b0d12 100%)',
	gradientFrom: '#1a1f2b',
	gradientTo: '#0b0d12',
	glassBg: 'rgba(23, 27, 36, 0.78)',
	glassBorder: 'rgba(255, 255, 255, 0.08)',
	success: '#34d399',
	error: '#f87171'
}

export const themeTokens: Record<ThemeMode, ThemeTokens> = {
	light: lightTokens,
	dark: darkTokens
}
