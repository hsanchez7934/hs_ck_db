import React, {useState, useEffect} from 'react'
import DropDown from './DropDown/DropDown'
import {SelectChangeEvent} from '@mui/material'
import {useAppDispatch, useAppSelector} from '../store/hooks'
import {updateSelectedSpirit} from '../store'

const spirits = ['Bourbon', 'Brandy', 'Gin', 'Rum', 'Scotch', 'Tequila', 'Vodka', 'Whiskey']

const HeaderSpiritsDropDown = () => {
	const [dropdownValue, setDropdownValue] = useState(sessionStorage.getItem('savedSpiritValue') || spirits[0])
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

	const handleOnChange = (event: SelectChangeEvent) => {
		const selectedSpirit = event.target.value
		setDropdownValue(selectedSpirit)
		dispatch(updateSelectedSpirit(selectedSpirit))
		sessionStorage.setItem('savedSpiritValue', selectedSpirit)
	}

	return (
		<div className='block md:hidden'>
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
