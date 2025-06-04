import './styles.css'
import React, {useEffect} from 'react'
import AlphtabetPicker from '../../components/AlphabetPicker/AlphabetPicker'
import DrinksImageList from '../../components/DrinksImageList/DrinksImageList'
import NoDrinkDataNotice from '../../components/NoDrinkData'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import {updateIsKeywordSearch, updateSearchKeyword, updateClearHeaderSearchInputText} from '../../store'
import {useAppSelector, useAppDispatch} from '../../store/hooks'

const SearchByNamePage = (): JSX.Element => {
	const dispatch = useAppDispatch()
	const {
		searchDrinksData: {drinks},
		isFetchingDrinks,
		errorFetchingDrinks,
		isKeywordSearch
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

	return (
		<div style={{height: 'calc(100% - 64px)', overflow: 'hidden'}} id="searchByNamePageContainer">
			<AlphtabetPicker isKeywordSearch={isKeywordSearch} updateClearHeaderSearchInputText={updateClearHeaderSearchInputText} />
			<div id="searchByNamePageImageListContainer" className='bg-red-300'>{content}</div>
		</div>
	)
}

export default SearchByNamePage
