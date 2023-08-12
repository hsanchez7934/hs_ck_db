import {useState} from 'react'
import SpiritCard from '../components/SpiritCard/SpiritCard'
import {useFetchDrinksBySpiritQuery} from '../store'
import SkeletonLoader from '../components/Skeleton'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'

const spirits = ['Brandy', 'Bourbon', 'Gin', 'Rum', 'Scotch', 'Tequila', 'Vodka', 'Whiskey']

const SearchBySpiritsPage = () => {
	const [activeTab, setActiveTab] = useState('Brandy')
	const {data, error, isFetching} = useFetchDrinksBySpiritQuery(activeTab)
	console.log(data)

	const renderedSpiritTabs = spirits.map((spirit) => {
		return (
			<SpiritCard
				key={spirit}
				spirit={spirit}
				isActiveTab={spirit === activeTab}
				setActiveTab={setActiveTab}
			/>
		)
	})

	let content
	if (isFetching) {
		content = <SkeletonLoader />
	} else if (error) {
		content = <div>Error...</div>
	} else {
		content = <DrinksImageList drinksData={data.drinks} />
	}

	return (
		<div style={{height: 'calc(100% - 64px)'}}>
			<div style={{height: '45px', backgroundColor: '#fff', display: 'flex'}}>
				{renderedSpiritTabs}
			</div>
			<div style={{height: 'calc(100% - 45px)', overflow: 'auto'}}>{content}</div>
		</div>
	)
}

export default SearchBySpiritsPage
