import {useEffect} from 'react'
import AlphtabetPicker from '../components/AlphabetPicker/AlphabetPicker'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import SkeletonLoader from '../components/Skeleton'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import NoDrinkDataNotice from '../components/NoDrinkData'
import {updateIsKeywordSearch, updateSearchKeyword} from '../store'

const SearchByNamePage = (): JSX.Element => {
	const dispatch = useAppDispatch()
	const {
		searchDrinksData: {drinks},
		isFetchingDrinks,
		errorFetchingDrinks,
		isKeywordSearch
	} = useAppSelector(({searchDrinks}) => searchDrinks)
	console.log(drinks)

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
		<div style={{backgroundColor: 'inherit', height: '85%'}}>
			<AlphtabetPicker isKeywordSearch={isKeywordSearch} />
			<div style={{overflow: 'auto', height: '100%'}}>{content}</div>
		</div>
	)
}

export default SearchByNamePage
