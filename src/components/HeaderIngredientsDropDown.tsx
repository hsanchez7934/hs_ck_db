import React, {useState, useEffect} from 'react'
import {
	useFetchDrinkByIngredientQuery,
	useFetchIngredientsQuery,
	updateDrinksByIngredient
} from '../store'
import DropDown from './DropDown/DropDown'
import {useAppDispatch} from '../store/hooks'

const HeaderIngredientsDropDown = () => {
	const [dropdownValue, setDropdownValue] = useState(sessionStorage.getItem('savedIngredientValue') || 'Vodka')
	const {data} = useFetchIngredientsQuery('list')
	const datum = useFetchDrinkByIngredientQuery(dropdownValue)
	const dispatch = useAppDispatch()

	useEffect(() => {
		let data = []
		if (datum?.data?.drinks) {
			data = datum.data.drinks
		}
		dispatch(updateDrinksByIngredient(data))
	}, [dropdownValue, dispatch, datum?.data?.drinks])

	const handleOnChange = (event: any) => {
		const {value} = event.target as HTMLSelectElement
		setDropdownValue(value)
		sessionStorage.setItem('savedIngredientValue', value)
	}

	let dropdownData = []
	if (data) {
		const ingredientsList = data?.drinks.map((ingredient: {strIngredient1: string}) => ingredient.strIngredient1)
		dropdownData = ingredientsList.sort()
	}

	return (
		<div>
			<DropDown
				data={dropdownData}
				handleOnChange={handleOnChange}
				dropdownValue={dropdownValue}
				labelText={'Ingredient:'}
				placeholderText={'Select an ingredient...'}
				dropDownWidth={window.innerWidth < 800 ? '140px' : '240px'}
			/>
		</div>
	)
}

export default HeaderIngredientsDropDown
