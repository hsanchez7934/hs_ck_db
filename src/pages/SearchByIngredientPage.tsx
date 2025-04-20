import React from 'react'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import NoDrinkDataNotice from '../components/NoDrinkData'
import {useAppSelector} from '../store/hooks'

const SearchByIngredientpage = () => {
	const {drinksByIngredient} = useAppSelector((state) => state.drinksByIngredient)

	let content = <LoadingSpinner />
	if (!drinksByIngredient) {
		content = <NoDrinkDataNotice isErrorMessage={true} />
	} else if (drinksByIngredient === 'None Found') {
		content = <NoDrinkDataNotice />
	} else if (drinksByIngredient.length > 0) {
		content = <DrinksImageList drinksData={drinksByIngredient} />
	}

	return <div style={{overflow: 'auto', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default SearchByIngredientpage
