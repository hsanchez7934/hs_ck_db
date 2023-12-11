import './styles.css'
import {useState, useEffect} from 'react'
import {useFetchDrinksByFirstLetterQuery} from '../../store'
import {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData,
	updateIsKeywordSearch,
	updateSearchKeyword
} from '../../store'
import {useAppDispatch} from '../../store/hooks'
import {primaryFont} from '../../fonts/fonts'
import DropDown from '../DropDown/DropDown'

interface Props {
	isKeywordSearch: boolean
	searchKeyword: string
}

const AlphtabetPicker = (props: Props): JSX.Element => {
	const {isKeywordSearch, searchKeyword} = props
	const [searchLetter, setSearchLetter] = useState('a')
	const [dropdownValue, setDropDownValue] = useState('A')
	const {data, error, isFetching} = useFetchDrinksByFirstLetterQuery(searchLetter)
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

	useEffect(() => {
		if (!isKeywordSearch) {
			dispatch(isFetchingSearchDrinkData(isFetching))
			if (error) {
				dispatch(isErrorFetchingSearchDrinksData(error))
			}
			if (!isFetching && !error) {
				dispatch(updateSearchDrinks(data))
			}
		}
	}, [dispatch, data, error, isFetching, isKeywordSearch])

	const handleClick = (event: MouseEvent | any) => {
		const listItem = event.target as HTMLLIElement
		const searchLetter = listItem?.dataset?.value?.toLowerCase()
		if (searchLetter) {
			setSearchLetter(searchLetter)
			setDropDownValue('A')
		}
		dispatch(updateIsKeywordSearch(false))
		dispatch(updateSearchKeyword(''))
	}

	const handleOnChange = (event: InputEvent | any) => {
		const searchLetter = event.target.value
		setSearchLetter(searchLetter.toLowerCase())
		setDropDownValue(searchLetter)
		dispatch(updateIsKeywordSearch(false))
		dispatch(updateSearchKeyword(''))
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

	if (window.innerWidth < 700) {
		return (
			<div className="alphabetPickerDropdownContainer">
				{window.innerWidth < 600 && isKeywordSearch ? renderedSearchKeywordResults : <></>}
				<DropDown
					handleOnChange={handleOnChange}
					dropdownValue={dropdownValue}
					data={alphabet}
					labelText="Select a letter:"
					placeholderText="Select a letter..."
					parentContainerWidth={402}
					hideLabel={false}
				/>
			</div>
		)
	}

	return (
		<div className="alphabetPickerContainer">
			<ul>
				{alphabet.map((letter, index) => {
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
