import DrinkImageList from '../components/DrinksImageList/DrinksImageList'
import DrinkLocalStorage from '../helper-functions/drinkLocalStorage'
import {useEffect, useState} from 'react'

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
		content = <div>No saved data found.</div>
	}
	return <div style={{overflow: 'auto', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default SavedDrinksPage
