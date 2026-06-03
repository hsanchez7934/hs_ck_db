import React, {useEffect} from 'react'
import {useAuth0} from '@auth0/auth0-react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import {MenuItem, Typography} from '@mui/material'
import LoginButton from '../LoginButton/LoginButton'
import LogoutButton from '../LogoutButton/LogoutButton'
import Tooltip from '@mui/material/Tooltip'
import {primaryFont} from '../../fonts/fonts'
import {Link} from 'react-router-dom'
import {DarkMode, LightMode} from '@mui/icons-material'

import {addUserData} from '../../firebase/firebase-users'
import {useThemeMode} from '../../theme/AppThemeProvider'

const UserMenu: React.FC = () => {
	const {isAuthenticated, user} = useAuth0()
	const {mode, toggleTheme} = useThemeMode()
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

	useEffect(() => {
		if (isAuthenticated && user) {
			// @ts-expect-error Auth0 user shape is compatible with Firestore user provisioning
			addUserData(user)
		}
	}, [isAuthenticated, user])

	const handleOnUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget)
	}

	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}

	const renderedUserNickname = () => {
		return (
			<Link to={'/profile'} style={{textDecoration: 'none', color: 'var(--text-primary)'}}>
				<MenuItem onClick={handleCloseUserMenu}>
					<Typography textAlign="center" sx={{fontFamily: primaryFont}}>
						Profile
					</Typography>
				</MenuItem>
			</Link>
		)
	}

	return (
		<Box sx={{display: 'flex', justifyContent: 'flex-end', ml: 1}}>
			<Tooltip title="Account settings">
				<IconButton onClick={handleOnUserMenu} sx={{p: 0, ml: 1}}>
					<Avatar
						alt="User image"
						src={isAuthenticated ? user?.picture : ''}
						sx={{
							border: '2px solid var(--accent)',
							width: 36,
							height: 36
						}}
					/>
				</IconButton>
			</Tooltip>
			<Menu
				sx={{mt: '45px'}}
				id="userSettingMenu"
				anchorEl={anchorElUser}
				anchorOrigin={{vertical: 'top', horizontal: 'right'}}
				transformOrigin={{vertical: 'top', horizontal: 'right'}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
			>
				<MenuItem
					onClick={() => {
						toggleTheme()
						handleCloseUserMenu()
					}}
				>
					{mode === 'dark' ? <LightMode sx={{mr: 1}} fontSize="small" /> : <DarkMode sx={{mr: 1}} fontSize="small" />}
					<Typography sx={{fontFamily: primaryFont}}>
						{mode === 'dark' ? 'Light mode' : 'Dark mode'}
					</Typography>
				</MenuItem>
				{isAuthenticated && renderedUserNickname()}
				{isAuthenticated ? <LogoutButton /> : <LoginButton />}
			</Menu>
		</Box>
	)
}

export default UserMenu
