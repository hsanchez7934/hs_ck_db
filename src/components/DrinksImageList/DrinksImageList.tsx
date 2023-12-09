import './styles.css'
import {DrinkDataPoint} from '../../types'
import {Link, useLocation} from 'react-router-dom'
import {updateIsModalOpen, updateModalDrink, updateDrinkMap} from '../../store'
import {useAppDispatch} from '../../store/hooks'
import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import {useEffect, useState} from 'react'
import generateUUID from '../../uuid'

interface Props {
	drinksData: DrinkDataPoint[]
}

const setGridColumns = (width: number) => {
	let columns = 4

	if (width < 500) {
		columns = 1
	} else if (width < 700) {
		columns = 2
	} else if (width < 900) {
		columns = 3
	}
	return columns
}

const DrinksImageList = (props: Props) => {
	const windowWidth = window.innerWidth
	const {drinksData} = props
	const [renderData, setRenderData] = useState([])
	let location = useLocation()
	const dispatch = useAppDispatch()

	useEffect(() => {
		const setDrinkPagerMap = () => {
			const map = {}
			const drinks = []
			let previousID = null
			let currentID = generateUUID()
			let nextID = generateUUID()
			for (let index = 0; index < drinksData.length; index++) {
				const data = Object.assign({...drinksData[index], drinkMapID: currentID})
				const previous = drinksData[index - 1] ? Object.assign({...drinksData[index - 1], drinkMapID: previousID}) : null
				const next = drinksData[index + 1] ? Object.assign({...drinksData[index + 1], drinkMapID: nextID}) : null

				drinks.push(data)

				const node = {
					data,
					previous,
					next
				}

				previousID = currentID
				currentID = nextID
				nextID = generateUUID()

				// @ts-expect-error
				map[data.drinkMapID] = node
			}

			// @ts-expect-error
			setRenderData(drinks)
			dispatch(updateDrinkMap(map))
		}
		setDrinkPagerMap()
	}, [drinksData, dispatch])

	const handleOnClick = async (drink: DrinkDataPoint) => {
		if (!drink.strInstructions) {
			const response = await fetchDrinkDataByID(drink)
			drink = {...response, ...drink}
		}
		dispatch(updateIsModalOpen(true))
		dispatch(updateModalDrink(drink))
	}

	const renderedDrinkImages = renderData.map((drink: DrinkDataPoint) => (
		<Link key={drink.drinkMapID} to={`/drink/${drink.idDrink}`} state={{backgroundLocation: location}}>
			<ImageListItem className="image-container" onClick={() => handleOnClick(drink)}>
				<img
					src={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format`}
					srcSet={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format&dpr=2 2x`}
					alt={drink.strDrink || ''}
					loading="lazy"
				/>
				<div className="overlay-photo">
					<p className="overlay-photo-text">{drink.strDrink}</p>
				</div>
			</ImageListItem>
		</Link>
	))

	return (
		<Box>
			<ImageList
				variant="standard"
				cols={setGridColumns(windowWidth)}
				gap={8}
				sx={{margin: 0, padding: '7px', overflow: 'hidden'}}
			>
				{renderedDrinkImages}
			</ImageList>
		</Box>
	)
}

export default DrinksImageList
