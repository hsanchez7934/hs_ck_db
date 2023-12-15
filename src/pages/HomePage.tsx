import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import SkeletonLoader from '../components/Skeleton'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import {debounce} from 'lodash'

const HomePage = () => {
	const infiniteScrollContainer = useRef()
	const [items, setItems] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)
	const [stateScrollTop, setStateScrollTop] = useState((window.innerHeight - 64) / 2 - 100)

	const fetchData = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await axios.get(
				`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/randomselection.php`
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

	const debounced = debounce(fetchData, 1000)

	useEffect(() => {
		const copy = infiniteScrollContainer.current
		const handleScroll = () => {
			// @ts-expect-error
			const {scrollTop} = infiniteScrollContainer.current
			if (scrollTop > stateScrollTop) {
				setStateScrollTop(scrollTop + (window.innerHeight - 64))
				debounced()
			}
		}
		// @ts-expect-error
		infiniteScrollContainer.current?.addEventListener('scroll', handleScroll)
		// @ts-expect-error
		return () => copy.removeEventListener('scroll', handleScroll)
	}, [stateScrollTop, debounced])

	useEffect(() => {
		fetchData()
	}, [])

	const handleScroll = async () => {
		if (window.innerWidth < 950) {
			// @ts-expect-error
			const {scrollTop, scrollHeight} = infiniteScrollContainer?.current
			if (scrollTop === 0) {
				const pastScroll = scrollHeight
				// await props.fecthMoreChat()
				// @ts-expect-error
				const currentScroll = (await infiniteScrollContainer?.current?.scrollHeight) - pastScroll
				// @ts-expect-error
				await infiniteScrollContainer?.current.scrollTo(0, currentScroll)
			}
		}
	}

	const content = <DrinksImageList drinksData={items} />
	let notice = <></>
	if (isLoading) {
		notice = <SkeletonLoader />
	} else if (error) {
		notice = <div>Error...</div>
	}

	return (
		<div
		// @ts-expect-error
			ref={infiniteScrollContainer}
			style={{overflow: 'auto', height: 'calc(100% - 64px)'}}
			onScroll={handleScroll}
		>
			{content}
			{notice}
		</div>
	)
}
export default HomePage
