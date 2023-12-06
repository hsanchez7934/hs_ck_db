import {useState} from 'react'
import SpiritTabs from '../components/SpiritTabs/SpiritTabs'
import {useFetchDrinksBySpiritQuery} from '../store'
import SkeletonLoader from '../components/Skeleton'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'

const spirits = ['Bourbon', 'Brandy', 'Gin', 'Rum', 'Scotch', 'Tequila', 'Vodka', 'Whiskey']

const SearchBySpiritsPage = () => {
	const [activeTab, setActiveTab] = useState(spirits[0])
	const {data, error, isFetching} = useFetchDrinksBySpiritQuery(activeTab)

	const renderedSpiritTabs = spirits.map((spirit) => {
		return (
			<SpiritTabs
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
			<div style={{height: '45px', display: 'flex'}}>
				{renderedSpiritTabs}
			</div>
			<div style={{height: 'calc(100% - 45px)', overflow: 'auto'}}>{content}</div>
		</div>
	)
}

export default SearchBySpiritsPage
