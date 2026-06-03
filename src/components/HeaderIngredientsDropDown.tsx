import React, {useState, useEffect} from 'react'
import {
	useFetchDrinkByIngredientQuery,
	useFetchIngredientsQuery,
	updateDrinksByIngredient
} from '../store'
import DropDown from './DropDown/DropDown'
import {useAppDispatch} from '../store/hooks'

const HeaderIngredientsDropDown = (): JSX.Element => {
	const [dropdownValue, setDropdownValue] = useState(
		sessionStorage.getItem('savedIngredientValue') || '151 proof rum'
	)
	const {data} = useFetchIngredientsQuery('list')
	const datum = useFetchDrinkByIngredientQuery(dropdownValue)
	const dispatch = useAppDispatch()

	useEffect(() => {
		let drinks = []
		if (datum?.data?.drinks) {
			drinks = datum.data.drinks
		}
		dispatch(updateDrinksByIngredient(drinks))
	}, [dropdownValue, dispatch, datum?.data?.drinks])

	const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {value} = event.target
		setDropdownValue(value)
		sessionStorage.setItem('savedIngredientValue', value)
	}

	let dropdownData: string[] = []
	if (data) {
		const ingredientsList = data?.drinks.map(
			(ingredient: {strIngredient1: string}) => ingredient.strIngredient1
		)
		dropdownData = ingredientsList.sort()
	}

	return (
		<div className="header-ingredients-dropdown">
			<DropDown
				id="header-ingredient-select"
				variant="toolbar"
				data={dropdownData}
				handleOnChange={handleOnChange}
				dropdownValue={dropdownValue}
				labelText="Select ingredient"
				placeholderText="Select an ingredient..."
			/>
		</div>
	)
}

export default HeaderIngredientsDropDown
