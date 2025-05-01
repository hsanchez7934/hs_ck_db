import React from 'react'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import NoDrinkDataNotice from '../components/NoDrinkData'
import SpiritTabs from '../components/SpiritTabs/SpiritTabs'
import {updateSelectedSpirit} from '../store'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {useFetchDrinksBySpiritQuery} from '../store'
import {useState, useEffect} from 'react'

const spirits = ['Bourbon', 'Brandy', 'Gin', 'Rum', 'Scotch', 'Tequila', 'Vodka', 'Whiskey']

const SearchBySpiritsPage = () => {
	const {selectedSpirit} = useAppSelector(({spiritsPageState}) => spiritsPageState)
	const [activeTab, setActiveTab] = useState(sessionStorage.getItem('savedSpiritValue') || spirits[0])
	const {data, error, isFetching} = useFetchDrinksBySpiritQuery(selectedSpirit)
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(updateSelectedSpirit(sessionStorage.getItem('savedSpiritValue') || spirits[0]))
	}, [dispatch])

	const handleTabsOnClick = (spirit: string): void => {
		setActiveTab(spirit)
		dispatch(updateSelectedSpirit(spirit))
		sessionStorage.setItem('savedSpiritValue', spirit)
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

	let content = <LoadingSpinner />
	if (isFetching) {
		content = <LoadingSpinner />
	} else if (error) {
		content = <NoDrinkDataNotice isErrorMessage={true} />
	} else if (data && data?.drinks?.length > 0) {
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
					overflow: 'hidden'
				}}
			>
				{content}
			</div>
		</div>
	)
}

export default SearchBySpiritsPage
