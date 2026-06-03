import React from 'react'
import {motion} from 'framer-motion'
import {primaryFont} from '../../fonts/fonts'
import {fadeInUp} from '../../theme/motion'

type Props = {
	message: string
	buttonLabel?: string
	onAction: () => void
	buttonId?: string
}

const AuthPrompt = ({
	message,
	buttonLabel = 'Sign In',
	onAction,
	buttonId = 'btn_loginPrompt'
}: Props): JSX.Element => {
	return (
		<motion.div
			className="auth-prompt"
			variants={fadeInUp}
			initial="hidden"
			animate="visible"
			transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
		>
			<p className="auth-prompt-text">{message}</p>
			<button id={buttonId} className="auth-prompt-button" onClick={onAction} style={{fontFamily: primaryFont}}>
				{buttonLabel}
			</button>
		</motion.div>
	)
}

export default AuthPrompt
