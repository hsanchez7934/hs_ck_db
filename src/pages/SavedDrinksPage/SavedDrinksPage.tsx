import './styles.css'
import React, {useEffect, useState} from 'react'

import DrinkImageList from '../../components/DrinksImageList/DrinksImageList'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import NoDrinkDataNotice from '../../components/NoDrinkData'
import AuthPrompt from '../../components/layout/AuthPrompt'
import PageContainer from '../../components/layout/PageContainer'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import {useAuth0} from '@auth0/auth0-react'
import {updateTriggerRender} from '../../store'

const SavedDrinksPage = () => {
	const {loginWithPopup, isAuthenticated, isLoading} = useAuth0()
	const [dataToRender, setDataToRender] = useState([])
	const {triggerRender, userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)
	const dispatch = useAppDispatch()

	useEffect(() => {
		// @ts-expect-error generic
		setDataToRender(userSavedDrinks)

		if (triggerRender) {
			dispatch(updateTriggerRender(false))
		}
	}, [triggerRender, userSavedDrinks, dispatch, isAuthenticated])

	let content = <LoadingSpinner />
	if (isLoading) {
		content = <LoadingSpinner />
	} else if (!isAuthenticated) {
		content = (
			<AuthPrompt
				message="You must sign in to view your saved drinks. Click the button below to sign in."
				buttonId="btn_loginFromSavedDrinksPage"
				onAction={() => loginWithPopup()}
			/>
		)
	} else if (dataToRender.length > 0) {
		content = <DrinkImageList drinksData={dataToRender} />
	} else {
		content = <NoDrinkDataNotice isSavedDrinksPage={true} />
	}

	return <PageContainer>{content}</PageContainer>
}

export default SavedDrinksPage
