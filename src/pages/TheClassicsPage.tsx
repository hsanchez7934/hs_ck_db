import {useFetchPopularDrinksQuery} from '../store'
import DrinkCard from '../components/DrinkCard'
import SkeletonLoader from '../components/Skeleton'
import MasonryImageList from '../components/ImageList'

const TheClassicsPage = () => {
	const {data, error, isFetching} = useFetchPopularDrinksQuery()

	let content
	if (isFetching) {
		content = <SkeletonLoader />
	} else if (error) {
		content = <div>Oh no! Looks like an error has occured. Please refresh this page.</div>
	} else {
		const drinksData = data?.drinks || []
		content = <MasonryImageList drinksData={drinksData} />
	}

	// let content
	// if (isFetching) {
	// 	content = <SkeletonLoader />
	// } else if (error) {
	// 	content = <div>Oh no! Looks like an error has occured. Please refresh this page.</div>
	// } else {
	// 	content = data?.drinks.map((drink) => {
	// 		return <DrinkCard key={drink.idDrink} drink={drink} />
	// 	})
	// }

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			{content}
		</div>
	)
}

export default TheClassicsPage
