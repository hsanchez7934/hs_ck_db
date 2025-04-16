import React, {useEffect} from 'react'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {updateIsKeywordSearch, updateSearchKeyword} from '../store'
import AlphtabetPicker from '../components/AlphabetPicker/AlphabetPicker'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import NoDrinkDataNotice from '../components/NoDrinkData'
import SkeletonLoader from '../components/Skeleton'

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

	let content
	if (isFetchingDrinks) {
		content = <SkeletonLoader />
	} else if (errorFetchingDrinks) {
		return <div>Error...</div>
	} else {
		if (drinks.length > 0) {
			content = <DrinksImageList drinksData={drinks} />
		} else {
			content = <NoDrinkDataNotice />
		}
	}

	return (
		<div style={{backgroundColor: 'inherit', height: 'calc(100% - 64px)', overflow: 'hidden'}}>
			<AlphtabetPicker isKeywordSearch={isKeywordSearch} searchKeyword={searchKeyword} />
			<div style={{overflowY: 'scroll', height: 'calc(100% - 25px)'}}>{content}</div>
		</div>
	)
}

export default SearchByNamePage
