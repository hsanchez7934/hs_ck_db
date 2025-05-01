import React, {useState, useEffect, useCallback} from 'react'
import {useAppDispatch} from '../store/hooks'
import {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData,
	updateIsKeywordSearch,
	updateSearchKeyword
} from '../store'
import SearchInput from './SearchInput/SearchInput'
import axios from 'axios'

interface Props {
	isKeywordSearch: boolean
}

const HeaderSearchInput = (props: Props): JSX.Element => {
	const {isKeywordSearch} = props
	const [inputValue, setInputValue] = useState('')
	const [searchKeyword, setSearchKeyword] = useState('')
	const dispatch = useAppDispatch()

	const fetchData = useCallback((searchKeyword: string) => {
		dispatch(isFetchingSearchDrinkData(true))
		axios.get(`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/search.php?s=${searchKeyword}`)
		.then((response) => {
			console.log(response.data)
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
		if (isKeywordSearch) {
			if (searchKeyword !== '') {
				fetchData(searchKeyword)
			}
		}
	}, [isKeywordSearch, searchKeyword])

	useEffect(() => {
		if (window.innerWidth < 800) {
			const sessionStoredSearchKeyword = sessionStorage.getItem('savedSearchKeyword')
			if (!sessionStoredSearchKeyword) {
				return
			}
			setSearchKeyword(sessionStoredSearchKeyword)
			setInputValue('')
			dispatch(updateIsKeywordSearch(true))
			dispatch(updateSearchKeyword(sessionStoredSearchKeyword))
		}
	}, [])

	const executeSearch = () => {
		setSearchKeyword(inputValue)
		setInputValue('')
		dispatch(updateIsKeywordSearch(true))
		dispatch(updateSearchKeyword(inputValue))
		if (window.innerWidth < 800) {
			sessionStorage.setItem('savedSearchKeyword', inputValue)
		}
	}

	const handleOnInput = (event: React.FormEvent<HTMLInputElement>) => {
		const {value} = event.target as HTMLInputElement
		setInputValue(value)
	}

	const handleOnKeyDown = (event: React.FormEvent<HTMLInputElement>) => {
		// @ts-expect-error generic
		if (inputValue.length > 0 && event.key === 'Enter') { 
			executeSearch()
		}
	}

	return (
		<>
			<SearchInput
				inputValue={inputValue}
				handleOnClick={executeSearch}
				handleOnInput={handleOnInput}
				handleOnKeyDown={handleOnKeyDown}
				isDisabled={!inputValue}
			/>
		</>
	)
}

export default HeaderSearchInput
