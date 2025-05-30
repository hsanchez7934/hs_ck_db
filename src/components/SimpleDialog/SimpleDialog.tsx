import './styles.css'
import React from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import {DialogActions} from '@mui/material'
import {primaryFont} from '../../fonts/fonts'
import {useAuth0} from '@auth0/auth0-react'

interface SimpleDialogProps {
	open: boolean
	dialogText?: string
	dialogTextColor?: string
	isLoginDialog?: boolean
	onLoginDialogClose?: () => void
}

const SimpleDialog = (props: SimpleDialogProps): JSX.Element => {
	const {loginWithPopup} = useAuth0()
	const {open, dialogText, dialogTextColor, isLoginDialog, onLoginDialogClose} = props

	const handleSignInOnClick = () => {
		if (onLoginDialogClose) {
			onLoginDialogClose()
			loginWithPopup()
		}
	}

	const handleCloseOnClick = () => {
		if (onLoginDialogClose) {
			onLoginDialogClose()
		}
	}

	let content = <></>
	if (isLoginDialog) {
		content = (
			<Dialog open={open}>
				<DialogTitle sx={{fontFamily: primaryFont}}>You must be signed in to be able to save drinks.</DialogTitle>
				<DialogActions>
					<button className="btn_loginFromDrinkCard" onClick={handleSignInOnClick} style={{fontFamily: primaryFont}}>
						Sign In
					</button>
					<button className="btn_loginFromDrinkCard" onClick={handleCloseOnClick} style={{fontFamily: primaryFont}}>
						Cancel
					</button>
				</DialogActions>
			</Dialog>
		)
	} else {
		content = (
			<Dialog open={open}>
				<DialogTitle sx={{fontFamily: primaryFont}} color={dialogTextColor}>{dialogText}</DialogTitle>
			</Dialog>
		)
	}

	return <>{content}</>
}

export default SimpleDialog
