import React, {useState, useEffect} from 'react'
import DropDown from './DropDown/DropDown'
import {useAppDispatch, useAppSelector} from '../store/hooks'
import {updateSelectedSpirit} from '../store'

const spirits = ['Bourbon', 'Brandy', 'Gin', 'Rum', 'Scotch', 'Tequila', 'Vodka', 'Whiskey']

const HeaderSpiritsDropDown = (): JSX.Element => {
	const [dropdownValue, setDropdownValue] = useState(
		sessionStorage.getItem('savedSpiritValue') || spirits[0]
	)
	const dispatch = useAppDispatch()
	const {selectedSpirit} = useAppSelector(({spiritsPageState}) => spiritsPageState)

	useEffect(() => {
		dispatch(updateSelectedSpirit(sessionStorage.getItem('savedSpiritValue') || spirits[0]))
	}, [dispatch])

	useEffect(() => {
		setDropdownValue((prevItem) => {
			if (prevItem !== selectedSpirit) {
				return selectedSpirit
			}
			return prevItem
		})
	}, [selectedSpirit])

	const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const spirit = event.target.value
		setDropdownValue(spirit)
		dispatch(updateSelectedSpirit(spirit))
		sessionStorage.setItem('savedSpiritValue', spirit)
	}

	return (
		<div className="header-spirits-dropdown">
			<DropDown
				id="header-spirit-select"
				variant="toolbar"
				data={spirits}
				handleOnChange={handleOnChange}
				dropdownValue={dropdownValue}
				labelText="Select spirit"
				placeholderText="Select a spirit..."
			/>
		</div>
	)
}

export default HeaderSpiritsDropDown
