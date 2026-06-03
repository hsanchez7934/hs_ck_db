import React from 'react'

type Props = {
	children: React.ReactNode
	className?: string
	id?: string
}

const PageContainer = ({children, className = '', id}: Props): JSX.Element => {
	return (
		<div id={id} className={`page-container ${className}`.trim()}>
			{children}
		</div>
	)
}

export default PageContainer
