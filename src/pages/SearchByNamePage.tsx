import React, {useEffect} from 'react'
import AlphtabetPicker from '../components/AlphabetPicker/AlphabetPicker'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import NoDrinkDataNotice from '../components/NoDrinkData'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import {updateIsKeywordSearch, updateSearchKeyword} from '../store'
import {useAppSelector, useAppDispatch} from '../store/hooks'

const SearchByNamePage = (): JSX.Element => {
	const dispatch = useAppDispatch()
	const {
		searchDrinksData: {drinks},
		isFetchingDrinks,
		errorFetchingDrinks,
		isKeywordSearch,
		searchKeyword
	} = useAppSelector(({searchDrinksState}) => searchDrinksState)

	useEffect(() => {
		const cleanup = () => {
			dispatch(updateIsKeywordSearch(false))
			dispatch(updateSearchKeyword(''))
		}
		return () => cleanup()
	}, [dispatch])

	let content = <LoadingSpinner />
	if (isFetchingDrinks) {
		content = <LoadingSpinner />
	} else if (errorFetchingDrinks) {
		return <NoDrinkDataNotice isErrorMessage={true} />
	} else {
		if (drinks && drinks.length > 0) {
			content = <DrinksImageList drinksData={drinks} />
		} else {
			content = <NoDrinkDataNotice />
		}
	}

	const containerHeight = window.innerWidth < 500 ? 'calc(100% - 40px)' : 'calc(100% - 25px)'

	return (
		<div style={{height: 'calc(100% - 64px)', overflow: 'hidden'}}>
			<AlphtabetPicker isKeywordSearch={isKeywordSearch} searchKeyword={searchKeyword} />
			<div style={{overflow: 'hidden', height: containerHeight}}>{content}</div>
		</div>
	)
}

export default SearchByNamePage
