import React from 'react'
import {MenuItem, Typography} from '@mui/material'
import {useAuth0} from '@auth0/auth0-react'
import {useLocation} from 'react-router-dom'

const LoginButton: React.FC = () => {
	const {loginWithRedirect} = useAuth0()
	const location = useLocation()
	
	const handleLogin = () => {
		loginWithRedirect({appState: {returnTo: `${window.location.origin}${location.pathname}`}})
	}

	return (
		<MenuItem onClick={() => handleLogin()}>
			<Typography textAlign="center">Sign In</Typography>
		</MenuItem>
	)
}

export default LoginButton
