import DrinkImageList from '../components/DrinksImageList/DrinksImageList'
import DrinkLocalStorage from '../helper-functions/drinkLocalStorage'
import {useMemo} from 'react'


const SavedDrinksPage = () => {
	const drinkStorage = useMemo(() => new DrinkLocalStorage(), [])
	drinkStorage.init()
	const drinkData = drinkStorage.getDrinkData()
	console.log(drinkStorage)

	let content
	if (drinkData.length > 0) {
		content = <DrinkImageList drinksData={drinkData} />
	} else {
		content = <div>No saved data found.</div>
	}
	return <div style={{overflow: 'auto', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default SavedDrinksPage
