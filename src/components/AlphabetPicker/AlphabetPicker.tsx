import './styles.css'
import React, {useCallback} from 'react'
import {useState, useEffect} from 'react'
import {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData,
	updateIsKeywordSearch,
	updateSearchKeyword,
	updateUseSavedScrollTop,
	updateClearHeaderSearchInputText
} from '../../store'
import {useAppDispatch} from '../../store/hooks'
import {primaryFont} from '../../fonts/fonts'
import DropDown from '../DropDown/DropDown'
import axios from 'axios'
import {ActionCreatorWithPayload} from '@reduxjs/toolkit'

interface Props {
	isKeywordSearch: boolean
	updateClearHeaderSearchInputText: ActionCreatorWithPayload<
		boolean,
		'searchDrinks/updateClearHeaderSearchInputText'
	>
}

const AlphtabetPicker = (props: Props): JSX.Element => {
	const {isKeywordSearch} = props
	const [searchLetter, setSearchLetter] = useState(
		sessionStorage.getItem('savedAlphaPickerLetter') || 'A'
	)
	const [dropdownValue, setDropDownValue] = useState(
		sessionStorage.getItem('savedAlphaPickerLetter') || 'A'
	)
	const dispatch = useAppDispatch()

	const alphabet = [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z'
	]

	const fetchData = useCallback((searchLetter: string) => {
		dispatch(isFetchingSearchDrinkData(true))
		axios
			.get(
				`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/search.php?f=${searchLetter}`
			)
			.then((response) => {
				dispatch(updateSearchDrinks(response.data))
				dispatch(isFetchingSearchDrinkData(false))
			})
			.catch((error) => {
				dispatch(isFetchingSearchDrinkData(false))
				if (error) {
					dispatch(isErrorFetchingSearchDrinksData(error))
				}
			})
	}, [])

	useEffect(() => {
		if (!isKeywordSearch) {
			const savedKeyword = sessionStorage.getItem('savedSearchKeyword')
			if (savedKeyword) {
				return
			} else {
				fetchData(searchLetter)
			}
		}
	}, [isKeywordSearch, searchLetter])

	const setSessionStorageState = (letter: string) => {
		sessionStorage.setItem('savedAlphaPickerLetter', letter)
		dispatch(updateUseSavedScrollTop(false))
	}

	const handleClick = (event: MouseEvent | any) => {
		const listItem = event.target as HTMLLIElement
		const searchLetter = listItem?.dataset?.value
		if (searchLetter) {
			setSearchLetter(searchLetter)
			setDropDownValue(searchLetter)
			setSessionStorageState(searchLetter)
		}
		dispatch(updateIsKeywordSearch(false))
		dispatch(updateSearchKeyword(''))
		dispatch(updateClearHeaderSearchInputText(true))
	}

	const handleOnChange = (event: InputEvent | any) => {
		const searchLetter = event.target.value
		setSearchLetter(searchLetter)
		setDropDownValue(searchLetter)
		setSessionStorageState(searchLetter)
		dispatch(updateIsKeywordSearch(false))
		dispatch(updateSearchKeyword(''))
		dispatch(updateClearHeaderSearchInputText(true))
	}

	return (
		<>
			<div className="alphabetPickerContainer">
				<ul>
					{alphabet.map((letter) => {
						return (
							<li
								className={`letter-list-item ${
									searchLetter === letter && !isKeywordSearch ? 'letter-active' : ''
								}`}
								key={letter}
								onClick={handleClick}
								data-value={letter}
								style={{fontFamily: primaryFont}}
							>
								{letter}
							</li>
						)
					})}
				</ul>
			</div>

			<div className="alphabetPickerDropdownContainer block md:hidden">
				<DropDown
					handleOnChange={handleOnChange}
					dropdownValue={dropdownValue}
					data={alphabet}
					labelText="Select a letter:"
					placeholderText="Select a letter..."
					dropDownWidth="140px"
				/>
			</div>
		</>
	)
}

export default AlphtabetPicker
