import React from 'react'
import {MenuItem, Typography} from '@mui/material'
import {primaryFont} from '../../fonts/fonts'
import {useAuth0} from '@auth0/auth0-react'

const LoginButton: React.FC = () => {
	const {loginWithPopup} = useAuth0()

	const handleLogin = () => {
		loginWithPopup()
	}

	return (
		<MenuItem onClick={() => handleLogin()}>
			<Typography textAlign="center" sx={{fontFamily: primaryFont}}>
				Sign In
			</Typography>
		</MenuItem>
	)
}

export default LoginButton
