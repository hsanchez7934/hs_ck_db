import {useState, useEffect} from 'react'
import SpiritTabs from '../components/SpiritTabs/SpiritTabs'
import {useFetchDrinksBySpiritQuery} from '../store'
import SkeletonLoader from '../components/Skeleton'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {updateSelectedSpirit} from '../store'

const spirits = ['Bourbon', 'Brandy', 'Gin', 'Rum', 'Scotch', 'Tequila', 'Vodka', 'Whiskey']

const SearchBySpiritsPage = () => {
	const {selectedSpirit} = useAppSelector(({spiritsPageState}) => spiritsPageState)
	const [activeTab, setActiveTab] = useState(spirits[0])
	const {data, error, isFetching} = useFetchDrinksBySpiritQuery(selectedSpirit)
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(updateSelectedSpirit(spirits[0]))
	}, [dispatch])

	const handleTabsOnClick = (spirit: string): void => {
		setActiveTab(spirit)
		dispatch(updateSelectedSpirit(spirit))
	}

	const renderedSpiritTabs = spirits.map((spirit) => {
		return (
			<SpiritTabs
				key={spirit}
				spirit={spirit}
				isActiveTab={spirit === activeTab}
				setActiveTab={handleTabsOnClick}
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
			{window.innerWidth < 800 ? (
				<></>
			) : (
				<div style={{height: '45px', display: 'flex'}}>{renderedSpiritTabs}</div>
			)}
			<div
				style={{
					height: `calc(100% - ${window.innerWidth < 800 ? '0px' : '45px'})`,
					overflow: 'auto'
				}}
			>
				{content}
			</div>
		</div>
	)
}

export default SearchBySpiritsPage
