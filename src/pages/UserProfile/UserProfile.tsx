import './styles.css'
import React from 'react'
import {motion} from 'framer-motion'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import AuthPrompt from '../../components/layout/AuthPrompt'
import PageContainer from '../../components/layout/PageContainer'
import {useAuth0} from '@auth0/auth0-react'
import {primaryFont} from '../../fonts/fonts'
import {fadeInUp} from '../../theme/motion'

const UserProfile = () => {
	const {user, isAuthenticated, isLoading, loginWithPopup} = useAuth0()

	const renderedProfileData = () => {
		return (
			<motion.div
				id="profileMainContainer"
				variants={fadeInUp}
				initial="hidden"
				animate="visible"
				transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
			>
				<img alt={user?.name} src={user?.picture} className="profile-avatar" />
				<h1 style={{fontFamily: primaryFont, color: 'var(--text-primary)'}}>Nickname: {user?.nickname}</h1>
				<h1 style={{fontFamily: primaryFont, color: 'var(--text-secondary)'}}>Email: {user?.email}</h1>
			</motion.div>
		)
	}

	let content = <LoadingSpinner />
	if (isLoading) {
		content = <LoadingSpinner />
	} else if (isAuthenticated) {
		content = renderedProfileData()
	} else {
		content = (
			<AuthPrompt
				message="Sign in to view your profile."
				onAction={() => loginWithPopup()}
				buttonId="btn_loginFromProfilePage"
			/>
		)
	}

	return <PageContainer>{content}</PageContainer>
}

export default UserProfile
