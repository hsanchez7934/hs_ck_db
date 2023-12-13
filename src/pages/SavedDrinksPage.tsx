import DrinkImageList from '../components/DrinksImageList/DrinksImageList'
import DrinkLocalStorage from '../helper-functions/drinkLocalStorage'
import {useEffect, useState} from 'react'
import NoDrinkDataNotice from '../components/NoDrinkData'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { updateTriggerRender } from '../store'

const SavedDrinksPage = () => {
	const [dataToRender, setDataToRender] = useState([])
	const {triggerRender} = useAppSelector(({savedDrinkState}) => savedDrinkState)
	const dispatch = useAppDispatch()

	useEffect(() => {
		const drinkStorage = new DrinkLocalStorage()
		drinkStorage.init()
		const drinkData = drinkStorage.getDrinkData()
		// @ts-expect-error
		setDataToRender(drinkData)
		if (triggerRender) {
			dispatch(updateTriggerRender(false))
		}
	}, [triggerRender, dispatch])

	let content
	if (dataToRender.length > 0) {
		content = <DrinkImageList drinksData={dataToRender} />
	} else {
		content = <NoDrinkDataNotice isSavedDrinksPage={true} />
	}
	return <div style={{overflow: 'auto', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default SavedDrinksPage
