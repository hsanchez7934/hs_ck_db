import './styles.css'
import React, {useEffect} from 'react'
import AlphtabetPicker from '../../components/AlphabetPicker/AlphabetPicker'
import DrinksImageList from '../../components/DrinksImageList/DrinksImageList'
import NoDrinkDataNotice from '../../components/NoDrinkData'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import PageContainer from '../../components/layout/PageContainer'
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
		return (
			<PageContainer id="searchByNamePageContainer">
				<NoDrinkDataNotice isErrorMessage={true} />
			</PageContainer>
		)
	} else if (drinks && drinks.length > 0) {
		content = <DrinksImageList drinksData={drinks} />
	} else {
		content = <NoDrinkDataNotice />
	}

	return (
		<PageContainer id="searchByNamePageContainer">
			<AlphtabetPicker
				isKeywordSearch={isKeywordSearch}
				updateClearHeaderSearchInputText={updateClearHeaderSearchInputText}
			/>
			<div id="searchByNamePageImageListContainer">{content}</div>
		</PageContainer>
	)
}

export default SearchByNamePage
