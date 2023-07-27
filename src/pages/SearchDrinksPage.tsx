import AlphtabetPicker from '../components/AlphabetPicker/AlphabetPicker'
import {useAppSelector} from '../store/hooks'
import SkeletonLoader from '../components/Skeleton'
import DrinkCard from '../components/DrinkCard'

const SearchDrinksPage = () => {
	const {
		searchDrinksData: {drinks},
		isFetching,
		error
	} = useAppSelector(({searchDrinks}) => searchDrinks)
	console.log(drinks)
	let content
	if (isFetching) {
		content = <SkeletonLoader />
	} else if (error) {
		return <div>Error...</div>
	} else {
		if (drinks.length > 0) {
			content = drinks.map((drink) => {
				return <DrinkCard key={drink.idDrink} drink={drink} />
			})
		} else {
			content = <div>No data found...</div>
		}
	}

	return (
		<div style={{backgroundColor: 'skyblue', height: '85%'}}>
			<AlphtabetPicker />
			<div style={{overflow: 'auto', height: '92%'}}>{content}</div>
		</div>
	)
}

export default SearchDrinksPage
