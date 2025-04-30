import React, {useState, useEffect} from 'react'
import DropDown from './DropDown/DropDown'
import {SelectChangeEvent} from '@mui/material'
import {useAppDispatch} from '../store/hooks'
import {updateSelectedSpirit} from '../store'

const spirits = ['Bourbon', 'Brandy', 'Gin', 'Rum', 'Scotch', 'Tequila', 'Vodka', 'Whiskey']

const HeaderSpiritsDropDown = () => {
	const [dropdownValue, setDropdownValue] = useState(spirits[0])
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(updateSelectedSpirit(spirits[0]))
	}, [dispatch])

	const handleOnChange = (event: SelectChangeEvent) => {
		const selectedSpirit = event.target.value
		setDropdownValue(selectedSpirit)
		dispatch(updateSelectedSpirit(selectedSpirit))
	}

	return (
		<div>
			<DropDown
				data={spirits}
				handleOnChange={handleOnChange}
				dropdownValue={dropdownValue}
				labelText="Spirit:"
				placeholderText="Select a spirit..."
				dropDownWidth="140px"
			/>
		</div>
	)
}

export default HeaderSpiritsDropDown
