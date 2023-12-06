import DrinkCard from '../components/DrinkCard/DrinkCard'
import {useParams} from 'react-router-dom'
import {useFetchDrinkDataByIDQuery} from '../store'
import SkeletonLoader from '../components/Skeleton'

const DrinkPage = (): JSX.Element => {
	let {id} = useParams<'id'>()
	const {data, error, isFetching} = useFetchDrinkDataByIDQuery(id)

	let content
	if (isFetching) {
		content = <SkeletonLoader />
	} else if (error) {
		return <div>Error fetching data</div>
	} else {
		content = <DrinkCard drink={data.drinks[0]} />
	}
	return <div style={{height: '90%'}}>{content}</div>
}

export default DrinkPage
