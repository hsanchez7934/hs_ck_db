import React from 'react'
import {motion, useReducedMotion} from 'framer-motion'
import {fadeInUp} from '../theme/motion'

type Props = {isSavedDrinksPage?: boolean; isErrorMessage?: boolean}

const NoDrinkDataNotice = (props: Props) => {
	const {isSavedDrinksPage, isErrorMessage} = props
	const shouldReduceMotion = useReducedMotion()

	let text = ''
	if (isSavedDrinksPage) {
		text = `You haven't saved any drinks yet. Browse the app and find some favorites!`
	} else if (isErrorMessage) {
		text = 'Something went wrong while loading drinks. Please refresh and try again.'
	} else {
		text = 'No drinks found for this search.'
	}

	const content = (
		<div className="empty-state">
			<p className="empty-state-text">{text}</p>
		</div>
	)

	if (shouldReduceMotion) {
		return content
	}

	return (
		<motion.div
			variants={fadeInUp}
			initial="hidden"
			animate="visible"
			transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
			style={{height: '100%', width: '100%'}}
		>
			{content}
		</motion.div>
	)
}

export default NoDrinkDataNotice
