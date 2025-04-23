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
	} = useAppSelector(({searchDrinks}) => searchDrinks)

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

	return (
		<div style={{height: 'calc(100% - 64px)', overflow: 'hidden'}}>
			<AlphtabetPicker isKeywordSearch={isKeywordSearch} searchKeyword={searchKeyword} />
			<div style={{overflowY: 'scroll', height: 'calc(100% - 25px)', paddingBottom: '35px'}}>{content}</div>
		</div>
	)
}

export default SearchByNamePage
