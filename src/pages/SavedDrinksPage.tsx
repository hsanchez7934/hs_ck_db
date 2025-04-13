import React, {useEffect, useState} from 'react'
import DrinkImageList from '../components/DrinksImageList/DrinksImageList'
import NoDrinkDataNotice from '../components/NoDrinkData'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {useAuth0} from '@auth0/auth0-react'
import {updateTriggerRender} from '../store'

const SavedDrinksPage = () => {
	const {user} = useAuth0()
	const [dataToRender, setDataToRender] = useState([])
	const {triggerRender, userSavedDrinks} = useAppSelector(
		({savedDrinkState}) => savedDrinkState
	)
	const dispatch = useAppDispatch()

	useEffect(() => {
		// @ts-expect-error generic
		setDataToRender(userSavedDrinks)

		if (triggerRender) {
			dispatch(updateTriggerRender(false))
		}
	}, [triggerRender, user, userSavedDrinks])

	let content
	if (dataToRender.length > 0) {
		content = <DrinkImageList drinksData={dataToRender} />
	} else {
		content = <NoDrinkDataNotice isSavedDrinksPage={true} />
	}
	return <div style={{overflow: 'auto', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default SavedDrinksPage
