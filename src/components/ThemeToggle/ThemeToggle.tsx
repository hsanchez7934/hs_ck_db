import React from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {DarkMode, LightMode} from '@mui/icons-material'
import {motion} from 'framer-motion'
import {useThemeMode} from '../../theme/AppThemeProvider'

type Props = {
	showLabel?: boolean
}

const ThemeToggle = ({showLabel = false}: Props): JSX.Element => {
	const {mode, toggleTheme} = useThemeMode()
	const isDark = mode === 'dark'

	return (
		<Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
			<IconButton
				onClick={toggleTheme}
				aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				sx={{
					color: 'var(--text-primary)',
					border: '1px solid var(--border-subtle)',
					backgroundColor: 'var(--accent-muted)',
					'&:hover': {
						backgroundColor: 'var(--accent-muted)',
						borderColor: 'var(--accent)'
					}
				}}
			>
				<motion.div
					key={mode}
					initial={{rotate: -90, opacity: 0, scale: 0.6}}
					animate={{rotate: 0, opacity: 1, scale: 1}}
					transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}
					style={{display: 'flex', alignItems: 'center', gap: 8}}
				>
					{isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
					{showLabel && (
						<span style={{fontSize: 14, fontFamily: 'Josefin Sans, sans-serif'}}>
							{isDark ? 'Light' : 'Dark'}
						</span>
					)}
				</motion.div>
			</IconButton>
		</Tooltip>
	)
}

export default ThemeToggle
