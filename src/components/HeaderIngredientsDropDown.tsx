import {useState, useEffect} from 'react'
import {
	useFetchDrinkByIngredientQuery,
	useFetchIngredientsQuery,
	updateDrinksByIngredient
} from '../store'
import DropDown from './DropDown/DropDown'
import {useAppDispatch} from '../store/hooks'

const HeaderIngredientsDropDown = () => {
	const [dropdownValue, setDropdownValue] = useState('Vodka')
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
	}

	let dropdownData = []
	if (data) {
		dropdownData = data?.drinks.map((ingredient: any) => ingredient.strIngredient1)
	}
	return (
		<div>
			<DropDown
				data={dropdownData}
				handleOnChange={handleOnChange}
				dropdownValue={dropdownValue}
				labelText={'Select an ingredient:'}
				placeholderText={'Select an ingredient...'}
				hideLabel={window.innerWidth < 550}
			/>
		</div>
	)
}

export default HeaderIngredientsDropDown
