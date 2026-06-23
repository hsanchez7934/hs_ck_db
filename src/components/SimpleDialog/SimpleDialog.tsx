import './styles.css'
import React from 'react'
import Dialog from '@mui/material/Dialog'
import {useAuth0} from '@auth0/auth0-react'
import {FaCircleCheck, FaCircleExclamation, FaHeart} from 'react-icons/fa6'

interface SimpleDialogProps {
	open: boolean
	dialogText?: string
	dialogTextColor?: string
	isLoginDialog?: boolean
	onLoginDialogClose?: () => void
}

const getToastTone = (color?: string): 'success' | 'error' | 'neutral' => {
	if (color === 'green') {
		return 'success'
	}
	if (color === 'red') {
		return 'error'
	}
	return 'neutral'
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
		onLoginDialogClose?.()
	}

	const toastTone = getToastTone(dialogTextColor)
	const dialogClassName = `simple-dialog${isLoginDialog ? ' simple-dialog--login' : ' simple-dialog--toast'}`
	const paperClassName = isLoginDialog
		? 'simple-dialog-paper simple-dialog-paper--login'
		: `simple-dialog-paper simple-dialog-paper--toast simple-dialog-paper--${toastTone}`

	return (
		<Dialog
			open={open}
			onClose={isLoginDialog ? handleCloseOnClick : undefined}
			className={dialogClassName}
			hideBackdrop={!isLoginDialog}
			disableScrollLock={!isLoginDialog}
			PaperProps={{
				className: paperClassName,
				elevation: 0
			}}
			BackdropProps={{
				className: 'simple-dialog-backdrop'
			}}
		>
			{isLoginDialog ? (
				<div className="simple-dialog-content simple-dialog-content--login">
					<div className="simple-dialog-icon simple-dialog-icon--login" aria-hidden="true">
						<FaHeart />
					</div>
					<h2 className="simple-dialog-title">Sign in required</h2>
					<p className="simple-dialog-message">
						You must be signed in to save drinks to your personal collection.
					</p>
					<div className="simple-dialog-actions">
						<button
							type="button"
							className="simple-dialog-btn simple-dialog-btn--primary"
							onClick={handleSignInOnClick}
						>
							Sign in
						</button>
						<button
							type="button"
							className="simple-dialog-btn simple-dialog-btn--secondary"
							onClick={handleCloseOnClick}
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div
					className={`simple-dialog-content simple-dialog-content--toast simple-dialog-content--${toastTone}`}
					role="status"
					aria-live="polite"
				>
					<span className="simple-dialog-toast-icon" aria-hidden="true">
						{toastTone === 'error' ? <FaCircleExclamation /> : <FaCircleCheck />}
					</span>
					<p className="simple-dialog-toast-text">{dialogText}</p>
				</div>
			)}
		</Dialog>
	)
}

export default SimpleDialog
