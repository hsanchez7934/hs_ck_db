import {createTheme, Theme} from '@mui/material/styles'
import {ThemeMode, themeTokens} from './tokens'
import {primaryFont} from '../fonts/fonts'

export function createAppTheme(mode: ThemeMode): Theme {
	const tokens = themeTokens[mode]

	return createTheme({
		palette: {
			mode,
			primary: {
				main: tokens.accent,
				dark: tokens.accentHover
			},
			background: {
				default: tokens.bgPrimary,
				paper: tokens.bgSurface
			},
			text: {
				primary: tokens.textPrimary,
				secondary: tokens.textSecondary
			},
			divider: tokens.border
		},
		typography: {
			fontFamily: primaryFont
		},
		shape: {
			borderRadius: 12
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						backgroundColor: tokens.bgPrimary,
						color: tokens.textPrimary
					}
				}
			},
			MuiAppBar: {
				styleOverrides: {
					root: {
						backgroundColor: tokens.appBar,
						backdropFilter: 'blur(16px) saturate(180%)',
						borderBottom: `1px solid ${tokens.borderSubtle}`,
						boxShadow: 'none'
					}
				}
			},
			MuiDrawer: {
				styleOverrides: {
					paper: {
						backgroundImage: tokens.drawer,
						color: tokens.textPrimary,
						borderRight: `1px solid ${tokens.borderSubtle}`
					}
				}
			},
			MuiCard: {
				styleOverrides: {
					root: {
						backgroundColor: tokens.bgElevated,
						border: `1px solid ${tokens.borderSubtle}`,
						boxShadow: tokens.shadow
					}
				}
			},
			MuiButton: {
				styleOverrides: {
					root: {
						textTransform: 'none',
						fontFamily: primaryFont
					}
				}
			},
			MuiMenu: {
				styleOverrides: {
					paper: {
						backgroundColor: tokens.bgElevated,
						border: `1px solid ${tokens.borderSubtle}`,
						boxShadow: tokens.shadow
					}
				}
			},
			MuiListItemButton: {
				styleOverrides: {
					root: {
						borderRadius: 10,
						'&:hover': {
							backgroundColor: tokens.accentMuted
						}
					}
				}
			}
		}
	})
}
