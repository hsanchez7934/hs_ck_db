import './styles.css'
import React from 'react'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import {useAuth0} from '@auth0/auth0-react'
import {primaryFont} from '../../fonts/fonts'

const UserProfile = () => {
	const {user, isAuthenticated, isLoading} = useAuth0()

	const renderedProfileData = () => {
		return (
			<div id="profileMainContainer">
				<img alt={user?.name} src={user?.picture} />
				<h1 style={{fontFamily: primaryFont}}>Nickname: {user?.nickname}</h1>
				<h1 style={{fontFamily: primaryFont}}>Email: {user?.email}</h1>
			</div>
		)
	}

	let content = <LoadingSpinner />
	if (isLoading) {
		content = <LoadingSpinner />
	} else if (isAuthenticated) {
		content = renderedProfileData()
	}

	return <div style={{overflow: 'hidden', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default UserProfile

// {
//     "sub": "google-oauth2|104000117949839508734",
//     "given_name": "Hector A.",
//     "family_name": "Sanchez",
//     "nickname": "hsanchez7934",
//     "name": "Hector A. Sanchez",
//     "picture": "https://lh3.googleusercontent.com/a/ACg8ocISGaJJXrF0QomfedK9DP0aprWhzipA98dhWpA9i0_bWHyNqg6f=s96-c",
//     "updated_at": "2025-05-19T16:24:28.408Z"
//   }

// email: "hsanchez@team239913.testinator.com"
// email_verified: false
// name: "hsanchez@team239913.testinator.com"
// nickname: "hsanchez"
// picture: "https://s.gravatar.com/avatar/24d6886a20fea94901e528e8b0041919?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fhs.png"
// sub: "auth0|67d90dde3615a90fb8a5ce76"
// updated_at: "2025-05-19T22:02:23.771Z"
