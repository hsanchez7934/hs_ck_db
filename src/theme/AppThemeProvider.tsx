import React, {createContext, useCallback, useContext, useMemo, useState} from 'react'
import {ThemeProvider as MuiThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {applyThemeToDocument, getInitialThemeMode} from './cssVariables'
import {createAppTheme} from './muiTheme'
import {THEME_STORAGE_KEY, ThemeMode, themeTokens} from './tokens'

type ThemeContextValue = {
	mode: ThemeMode
	tokens: (typeof themeTokens)[ThemeMode]
	toggleTheme: () => void
	setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

type Props = {
	children: React.ReactNode
}

export const AppThemeProvider = ({children}: Props): JSX.Element => {
	const [mode, setMode] = useState<ThemeMode>(() => {
		const initialMode = getInitialThemeMode()
		applyThemeToDocument(initialMode)
		return initialMode
	})

	const setTheme = useCallback((nextMode: ThemeMode) => {
		setMode(nextMode)
		localStorage.setItem(THEME_STORAGE_KEY, nextMode)
		applyThemeToDocument(nextMode)
	}, [])

	const toggleTheme = useCallback(() => {
		setTheme(mode === 'dark' ? 'light' : 'dark')
	}, [mode, setTheme])

	const muiTheme = useMemo(() => createAppTheme(mode), [mode])

	const value = useMemo(
		() => ({
			mode,
			tokens: themeTokens[mode],
			toggleTheme,
			setTheme
		}),
		[mode, toggleTheme, setTheme]
	)

	return (
		<ThemeContext.Provider value={value}>
			<MuiThemeProvider theme={muiTheme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	)
}

export function useThemeMode(): ThemeContextValue {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useThemeMode must be used within AppThemeProvider')
	}
	return context
}
