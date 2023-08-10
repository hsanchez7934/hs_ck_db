import AlphtabetPicker from '../components/AlphabetPicker/AlphabetPicker'
import {useAppSelector} from '../store/hooks'
import SkeletonLoader from '../components/Skeleton'
// import DrinkCard from '../components/DrinkCard'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import NoDrinkDataNotice from '../components/NoDrinkData'

const SearchByNamePage = (): JSX.Element => {
	const {
		searchDrinksData: {drinks},
		isFetchingDrinks,
		errorFetchingDrinks
	} = useAppSelector(({searchDrinks}) => searchDrinks)

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
			<AlphtabetPicker />
			<div style={{overflow: 'auto', height: '100%'}}>{content}</div>
		</div>
	)
}

export default SearchByNamePage
