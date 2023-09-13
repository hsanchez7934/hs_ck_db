import {useFetchNonAlcoholicDrinksQuery} from '../store'
import SkeletonLoader from '../components/Skeleton'
import DrinkImageList from '../components/DrinksImageList/DrinksImageList'

const NonAlcoholicDrinksPage = () => {
	const {data, error, isFetching} = useFetchNonAlcoholicDrinksQuery('Non_Alcoholic')
	let content
	if (isFetching) {
		content = <SkeletonLoader />
	} else if (error) {
		content = <div>Oh no! Looks like an error has occured. Please refresh this page.</div>
	} else {
		const drinksData = data?.drinks || []
		content = <DrinkImageList drinksData={drinksData} />
	}

	return <div style={{overflow: 'auto', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default NonAlcoholicDrinksPage
