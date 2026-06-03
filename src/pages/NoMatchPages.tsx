import React from 'react'
import {motion} from 'framer-motion'
import {primaryFont} from '../fonts/fonts'
import {Link} from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import {fadeInUp} from '../theme/motion'

const NoMatchPage = () => {
	return (
		<PageContainer>
			<motion.div
				className="empty-state"
				variants={fadeInUp}
				initial="hidden"
				animate="visible"
				transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
				style={{flexDirection: 'column', fontFamily: primaryFont}}
			>
				<p className="empty-state-text">Page not found.</p>
				<Link to={'/'} style={{textDecoration: 'none', color: 'var(--accent)', fontSize: '1.25rem'}}>
					Return to home
				</Link>
			</motion.div>
		</PageContainer>
	)
}

export default NoMatchPage
