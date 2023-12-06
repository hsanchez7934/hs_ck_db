import DrinkImageList from '../components/DrinksImageList/DrinksImageList'
import DrinkLocalStorage from '../helper-functions/drinkLocalStorage'
import {useEffect, useState} from 'react'
import NoDrinkDataNotice from '../components/NoDrinkData'

const SavedDrinksPage = () => {
	const [dataToRender, setDataToRender] = useState([])

	useEffect(() => {
		const drinkStorage = new DrinkLocalStorage()
		drinkStorage.init()
		const drinkData = drinkStorage.getDrinkData()
		// @ts-expect-error
		setDataToRender(drinkData)
	}, [])

	let content
	if (dataToRender.length > 0) {
		content = <DrinkImageList drinksData={dataToRender} />
	} else {
		content = <NoDrinkDataNotice isSavedDrinksPage={true} />
	}
	return <div style={{overflow: 'auto', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default SavedDrinksPage
