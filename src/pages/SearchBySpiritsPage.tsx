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
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(updateSelectedSpirit(sessionStorage.getItem('savedSpiritValue') || spirits[0]))
	}, [dispatch])

	useEffect(() => {
		const alphabetPickerContainer = document.getElementById('searchBySpiritsPage')
		if (alphabetPickerContainer) {
			const resizeObserver = new ResizeObserver((entries: any) => {
				for (const entry of entries) {
					const width = entry.contentRect.width
					setWindowWidth(width)
				}
			})
			resizeObserver.observe(alphabetPickerContainer)
			return () => {
				resizeObserver.disconnect()
			}
		}
	}, [])

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
		<div style={{height: 'calc(100% - 64px)'}} id="searchBySpiritsPage">
			{windowWidth < 900 ? (
				<></>
			) : (
				<div style={{height: '45px', display: 'flex'}}>{renderedSpiritTabs}</div>
			)}
			<div
				style={{
					height: `calc(100% - ${windowWidth < 900 ? '0px' : '45px'})`,
					overflow: 'hidden'
				}}
			>
				{content}
			</div>
		</div>
	)
}

export default SearchBySpiritsPage
