import React from 'react'
import {primaryFont} from '../fonts/fonts'
import {Link} from 'react-router-dom'

const NoMatchPage = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				flexDirection: 'column',
				alignItems: 'center',
				overflow: 'auto',
				height: 'calc(100% - 64px)',
				fontFamily: primaryFont
			}}
		>
			<p style={{color: '#fff', fontSize: '2em', margin: '3px'}}>Page not found.</p>
			<Link to={'/'} style={{textDecoration: 'underline', color: 'white', fontSize: '1.5em'}}>
				<p style={{margin: 0}}>Click here to return to home page.</p>
			</Link>
		</div>
	)
}

export default NoMatchPage
