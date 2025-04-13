import {withAuthenticationRequired} from '@auth0/auth0-react'
import React from 'react'
import {PageLoader} from './page-loader'

interface Props {
	component: React.FC
	path: string
}

export const AuthenticationGuard = ({component, path}: Props) => {
	const Component = withAuthenticationRequired(component, {
		onRedirecting: () => (
			<div className="page-layout">
				<PageLoader />
			</div>
		),
		returnTo: `${window.location.origin}/${path}`
	})

	return <Component />
}
