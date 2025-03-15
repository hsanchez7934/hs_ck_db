import React from 'react'
import {MenuItem, Typography} from '@mui/material'
import {useAuth0} from '@auth0/auth0-react'

const LoginButton: React.FC = () => {
	const {loginWithRedirect} = useAuth0()
	return (
		<MenuItem onClick={() => loginWithRedirect()}>
			<Typography textAlign="center">Login</Typography>
		</MenuItem>
	)
}

export default LoginButton
