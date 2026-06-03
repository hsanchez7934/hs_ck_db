import React from 'react'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'
import {Outlet, useLocation} from 'react-router-dom'
import {pageTransition, pageVariants} from '../../theme/motion'

const AnimatedOutlet = (): JSX.Element => {
	const location = useLocation()
	const shouldReduceMotion = useReducedMotion()

	if (shouldReduceMotion) {
		return <Outlet />
	}

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={location.pathname}
				variants={pageVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				transition={pageTransition}
				style={{height: '100%', width: '100%'}}
			>
				<Outlet />
			</motion.div>
		</AnimatePresence>
	)
}

export default AnimatedOutlet
