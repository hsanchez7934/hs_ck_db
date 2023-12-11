import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import SkeletonLoader from '../components/Skeleton'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import { debounce } from 'lodash'

const HomePage = () => {
	const infiniteScrollContainer = useRef()
	const [items, setItems] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)
	const [scrollTop, setScrollTop] = useState(window.innerHeight - 64)

	const fetchData = async () => {
		setIsLoading(true)
		setError(null)
		try {
			const response = await axios.get(
				`https://www.thecocktaildb.com/api/json/v2/${DOTENV_COCKTAIL_DB_API_KEY}/randomselection.php`
			)
			const {drinks} = response.data
			// @ts-expect-error
			setItems((prevItems) => [...prevItems, ...drinks])
		} catch (error) {
			// @ts-expect-error
			setError(error)
		} finally {
			setIsLoading(false)
		}
	}

	const debounced = debounce(fetchData, 1500)

	useEffect(() => {
		const copy = infiniteScrollContainer.current
		const handleScroll = () => {
			// @ts-expect-error
			const containerScrollTop = infiniteScrollContainer.current.scrollTop
			if (containerScrollTop > scrollTop) {
				setScrollTop(scrollTop + window.innerHeight - 64)
				debounced()
			}
		}
		// @ts-expect-error
		infiniteScrollContainer.current?.addEventListener('scroll', handleScroll)
		// @ts-expect-error
		return () => copy.removeEventListener('scroll', handleScroll)
	}, [scrollTop, debounced])

	useEffect(() => {
		fetchData()
	}, [])

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
