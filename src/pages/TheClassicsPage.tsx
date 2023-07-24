import {useFetchPopularDrinksQuery} from '../store'
import MediaCard from '../components/MediaCard'
import SkeletonLoader from '../components/Skeleton'

const TheClassicsPage = () => {
	const {data, error, isFetching} = useFetchPopularDrinksQuery()
	console.log(data)
	
	let content
	if (isFetching) {
		content = <SkeletonLoader />
	} else if (error) {
		content = <div>error...</div>
	} else {
		content = data?.drinks.map((drink) => {
			return <MediaCard key={drink.idDrink} drink={drink} />
		})
	}

	return <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>{content}</div>
}

export default TheClassicsPage
