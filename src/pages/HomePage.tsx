import React, {useState, useEffect, useRef, useCallback} from 'react'
import axios from 'axios'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import NoDrinkDataNotice from '../components/NoDrinkData'
import {debounce} from 'lodash'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {updateRenderNextSetOfDrinks} from '../store'

const HomePage = () => {
	const {renderNextSetOfDrinks} = useAppSelector(({mobileHomePageState}) => mobileHomePageState)
	const dispatch = useAppDispatch()
	const infiniteScrollContainer = useRef()
	const [drinksDataToRender, setDrinksDataToRender] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)
	const [scrollTop, setScrollTop] = useState((window.innerHeight - 64) / 2 - 100)

	const fetchData = useCallback(async (isMobile: boolean) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await axios.get(
				`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/randomselection.php`
			)
			const {drinks} = response.data
			if (isMobile) {
				setDrinksDataToRender(drinks)
				dispatch(updateRenderNextSetOfDrinks(false))
			} else {
				// @ts-expect-error generic
				setDrinksDataToRender((prevItems) => [...prevItems, ...drinks])
			}
		} catch (error) {
			// @ts-expect-error generic
			setError(error)
		} finally {
			setIsLoading(false)
		}
	}, [dispatch])

	const debounced = debounce(fetchData, 1000)

	useEffect(() => {
		if (window.innerWidth >= 800) {
			const copy = infiniteScrollContainer.current
			const handleScroll = () => {
				// @ts-expect-error generic
				const containerScrollTop = infiniteScrollContainer.current.scrollTop
				if (containerScrollTop > scrollTop) {
					setScrollTop(scrollTop + (window.innerHeight - 64))
					debounced(false)
				}
			}
			// @ts-expect-error generic
			infiniteScrollContainer.current?.addEventListener('scroll', handleScroll)
			// @ts-expect-error generic
			return () => copy.removeEventListener('scroll', handleScroll)
		}
	}, [scrollTop, debounced])

	useEffect(() => {
		if (window.innerWidth < 800) {
			fetchData(true)
		} else {
			fetchData(false)
		}
	}, [])

	useEffect(() => {
		if (renderNextSetOfDrinks) {
			fetchData(true)
		}
	}, [renderNextSetOfDrinks, fetchData])

	let content = <LoadingSpinner />
	if (error) {
		content = <NoDrinkDataNotice isErrorMessage={true} />
	} else if (drinksDataToRender && drinksDataToRender.length > 0) {
		content = <DrinksImageList drinksData={drinksDataToRender} />
	}

	return (
		// @ts-expect-error generic
		<div ref={infiniteScrollContainer} style={{overflow: 'hidden', height: 'calc(100% - 64px)'}}>
			{content}
		</div>
	)
}

export default HomePage
