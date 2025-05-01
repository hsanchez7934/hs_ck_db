import './styles.css'
import React, { useCallback } from 'react'
import {useState, useEffect} from 'react'
import {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData,
	updateIsKeywordSearch,
	updateSearchKeyword,
	updateUseSavedScrollTop
} from '../../store'
import {useAppDispatch} from '../../store/hooks'
import {primaryFont} from '../../fonts/fonts'
import DropDown from '../DropDown/DropDown'
import axios from 'axios'

import { useLocation } from 'react-router-dom'

interface Props {
	isKeywordSearch: boolean
	searchKeyword: string
}

const AlphtabetPicker = (props: Props): JSX.Element => {
	const {isKeywordSearch, searchKeyword} = props
	const [searchLetter, setSearchLetter] = useState(sessionStorage.getItem('savedAlphaPickerLetter') || 'a')
	const [dropdownValue, setDropDownValue] = useState(sessionStorage.getItem('savedAlphaPickerLetter') || 'A')
	const dispatch = useAppDispatch()
	const location = useLocation()
	console.log(location)
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
		if (window.innerWidth < 800) {
			sessionStorage.setItem('savedSearchKeyword', '')
		}
		dispatch(isFetchingSearchDrinkData(true))
		axios.get(`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/search.php?f=${searchLetter}`)
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
			if (window.innerWidth < 800 && savedKeyword) {
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
		const searchLetter = listItem?.dataset?.value?.toLowerCase()
		if (searchLetter) {
			setSearchLetter(searchLetter)
			setDropDownValue(searchLetter)
			setSessionStorageState(searchLetter)
		}
		dispatch(updateIsKeywordSearch(false))
		dispatch(updateSearchKeyword(''))
	}

	const handleOnChange = (event: InputEvent | any) => {
		const searchLetter = event.target.value
		setSearchLetter(searchLetter.toLowerCase())
		setDropDownValue(searchLetter)
		setSessionStorageState(searchLetter)
		dispatch(updateIsKeywordSearch(false))
		dispatch(updateSearchKeyword(''))
		sessionStorage.setItem('savedSearchKeyword', '')
	}

	const renderedSearchKeywordResults = (
		<div style={{height: '30px', padding: '0px 0px 0px 15px'}}>
			<p
				className="truncate"
				style={{margin: 0, color: '#fff', fontFamily: primaryFont}}
				title={`Displaying search results for: "${searchKeyword}"`}
			>
				Displaying search results for: "{searchKeyword}"
			</p>
		</div>
	)

	if (window.innerWidth < 800) {
		return (
			<div className="alphabetPickerDropdownContainer">
				{window.innerWidth < 800 && isKeywordSearch ? renderedSearchKeywordResults : <></>}
				<DropDown
					handleOnChange={handleOnChange}
					dropdownValue={dropdownValue}
					data={alphabet}
					labelText="Select a letter:"
					placeholderText="Select a letter..."
					dropDownWidth='140px'
				/>
			</div>
		)
	}

	return (
		<div className="alphabetPickerContainer">
			<ul>
				{alphabet.map((letter) => {
					return (
						<li
							className={`letter-list-item ${
								searchLetter === letter.toLowerCase() && !isKeywordSearch ? 'letter-active' : ''
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
	)
}

export default AlphtabetPicker
