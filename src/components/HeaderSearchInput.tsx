import React, {useState, useEffect} from 'react'
import {useFetchDrinksByKeywordQuery} from '../store'
import {useAppDispatch} from '../store/hooks'
import {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData,
	updateIsKeywordSearch,
	updateSearchKeyword
} from '../store'
import SearchInput from './SearchInput/SearchInput'

interface Props {
	isKeywordSearch: boolean
}

const HeaderSearchInput = (props: Props): JSX.Element => {
	const {isKeywordSearch} = props
	const [inputValue, setInputValue] = useState('')
	const [searchKeyword, setSearchKeyword] = useState('')
	const dispatch = useAppDispatch()

	const {data, error, isFetching} = useFetchDrinksByKeywordQuery(searchKeyword)

	useEffect(() => {
		if (isKeywordSearch) {
			dispatch(isFetchingSearchDrinkData(isFetching))
			if (error) {
				dispatch(isErrorFetchingSearchDrinksData(error))
			}
			if (!isFetching && !error) {
				dispatch(updateSearchDrinks(data))
			}
		}
	}, [dispatch, data, error, isFetching, isKeywordSearch])

	const executeSearch = () => {
		setSearchKeyword(inputValue)
		setInputValue('')
		dispatch(updateIsKeywordSearch(true))
		dispatch(updateSearchKeyword(inputValue))
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
