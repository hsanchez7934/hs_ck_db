import {useState, useEffect, useRef, useCallback} from 'react'
import axios from 'axios'
import SkeletonLoader from '../components/Skeleton'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import {debounce} from 'lodash'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {updateRenderNextSetOfDrinks} from '../store'

const HomePage = () => {
	const {renderNextSetOfDrinks} = useAppSelector(({mobileHomePageState}) => mobileHomePageState)
	const dispatch = useAppDispatch()
	const infiniteScrollContainer = useRef()
	const [items, setItems] = useState([])
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
				setItems(drinks)
				dispatch(updateRenderNextSetOfDrinks(false))
			} else {
				// @ts-expect-error
				setItems((prevItems) => [...prevItems, ...drinks])
			}
		} catch (error) {
			// @ts-expect-error
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
				// @ts-expect-error
				const containerScrollTop = infiniteScrollContainer.current.scrollTop
				if (containerScrollTop > scrollTop) {
					setScrollTop(scrollTop + (window.innerHeight - 64))
					debounced(false)
				}
			}
			// @ts-expect-error
			infiniteScrollContainer.current?.addEventListener('scroll', handleScroll)
			// @ts-expect-error
			return () => copy.removeEventListener('scroll', handleScroll)
		}
	}, [scrollTop, debounced, dispatch])

	useEffect(() => {
		if (window.innerWidth < 800) {
			console.log('use effect 2')
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

	const content = <DrinksImageList drinksData={items} />
	let notice = <></>
	if (isLoading) {
		notice = <SkeletonLoader />
	} else if (error) {
		notice = <div>Error...</div>
	} else {
	}

	return (
		// @ts-expect-error
		<div ref={infiniteScrollContainer} style={{overflow: 'auto', height: 'calc(100% - 64px)'}}>
			{content}
			{notice}
		</div>
	)
}
export default HomePage
