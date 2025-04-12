import React, {useEffect} from 'react'
import {useAuth0} from '@auth0/auth0-react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import LoginButton from '../LoginButton/LoginButton'
import LogoutButton from '../LogoutButton/LogoutButton'
import Tooltip from '@mui/material/Tooltip'

import {addUserData} from '../../firebase/firebase-users'

const UserMenu: React.FC = () => {
	const {isAuthenticated, user} = useAuth0()
	const [anchorElUser, setAnchorElUser] = React.useState(null)

	useEffect(() => {
		if (isAuthenticated) {
			// @ts-expect-error generic
			addUserData(user)
		}
	}, [isAuthenticated, user])

	const handleOnUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		// @ts-expect-error generic
		setAnchorElUser(event.currentTarget)
	}

	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}

	return (
		<Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'flex-end'}}>
			<Tooltip title="Open settings">
				<IconButton onClick={handleOnUserMenu} sx={{p: 0}}>
					<Avatar alt="User image" src={isAuthenticated ? user?.picture : ''} />
				</IconButton>
			</Tooltip>
			<Menu
				sx={{mt: '45px'}}
				id="userSettingMenu"
				anchorEl={anchorElUser}
				anchorOrigin={{vertical: 'top', horizontal: 'right'}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
			>
				{isAuthenticated ? <LogoutButton /> : <LoginButton />}
			</Menu>
		</Box>
	)
}

export default UserMenu
