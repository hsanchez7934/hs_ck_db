import React from 'react'
import {MenuItem, Typography} from '@mui/material'
import {useAuth0} from '@auth0/auth0-react'

const LogoutButton: React.FC = () => {
	const {logout} = useAuth0()
	return (
		<MenuItem onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}>
			<Typography textAlign="center">Logout</Typography>
		</MenuItem>
	)
}

export default LogoutButton
