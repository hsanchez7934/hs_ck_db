import './styles.css'
import React, {useEffect} from 'react'
import SavedDrinksView from '../../components/SavedDrinksView/SavedDrinksView'
import PageContainer from '../../components/layout/PageContainer'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import {useAuth0} from '@auth0/auth0-react'
import {updateTriggerRender} from '../../store'

const SavedDrinksPage = (): JSX.Element => {
	const {loginWithPopup, isAuthenticated, isLoading, user} = useAuth0()
	const {triggerRender, userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (triggerRender) {
			dispatch(updateTriggerRender(false))
		}
	}, [triggerRender, dispatch])

	return (
		<PageContainer className="saved-drinks-page-container">
			<SavedDrinksView
				isLoading={isLoading}
				isAuthenticated={isAuthenticated}
				savedDrinks={userSavedDrinks}
				userName={user?.nickname || user?.name}
				onSignIn={() => loginWithPopup()}
			/>
		</PageContainer>
	)
}

export default SavedDrinksPage
