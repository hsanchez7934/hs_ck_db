import './styles.css'
import {useState, useEffect} from 'react'
import {FaSearch} from 'react-icons/fa'
import {useFetchDrinksByKeywordQuery} from '../../store'
import {useAppDispatch} from '../../store/hooks'
import {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData
} from '../../store'

const SearchInput = () => {
	const [iconColor, setIconColor] = useState('#ececec')
	const [inputValue, setInputValue] = useState('')
	const [searchKeyword, setSearchKeyword] = useState('')
	const dispatch = useAppDispatch()

	const {data, error, isFetching} = useFetchDrinksByKeywordQuery(searchKeyword)

	useEffect(() => {
		dispatch(isFetchingSearchDrinkData(isFetching))
		if (error) {
			dispatch(isErrorFetchingSearchDrinksData(error))
		}
		if (!isFetching && !error) {
			dispatch(updateSearchDrinks(data))
		}
	}, [dispatch, data, error, isFetching])

	const handleOnMouseEnter = () => {
		setIconColor('black')
	}

	const handleOnMouseLeave = () => {
		setIconColor('#ececec')
	}

	const handleOnClick = () => {
		setSearchKeyword(inputValue)
		setInputValue('')
	}

	const handleOnInput = (event: React.FormEvent<HTMLInputElement>) => {
		const {value} = event.target as HTMLInputElement
		setInputValue(value)
	}

	return (
		<div className="search-input-container">
			<input
				type="text"
				placeholder="Search for a cocktail..."
				onInput={(event) => handleOnInput(event)}
				value={inputValue}
			/>
			<button
				onMouseLeave={handleOnMouseLeave}
				onMouseEnter={handleOnMouseEnter}
				onClick={handleOnClick}
			>
				<FaSearch style={{fontSize: '18px', color: iconColor}} />
			</button>
		</div>
	)
}

export default SearchInput
