import './styles.css'
import React from 'react'
import Box from '@mui/material/Box'
import {DrinkDataPoint} from '../../types'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import {Link, useLocation} from 'react-router-dom'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import generateUUID from '../../uuid'
import {updateIsModalOpen, updateModalDrink, updateDrinkMap} from '../../store'
import {useEffect, useState} from 'react'
import {useAppDispatch} from '../../store/hooks'

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

const removeSavedMapIDs = (drinksList: any) => {
		if (drinksList?.[0]?.drinkMapID) {
			const cleaned = drinksList.map((drink: any) => {
				const newDrink = Object.assign({}, drink)
				delete newDrink.drinkMapID
				return newDrink
			})
			return cleaned
		}
		return drinksList
}

const DrinksImageList = (props: Props) => {
	const windowWidth = window.innerWidth
	const {drinksData} = props
	const [renderData, setRenderData] = useState([])
	const location = useLocation()
	const dispatch = useAppDispatch()

	useEffect(() => {
		const setDrinkPagerMap = () => {
			const map = {}
			const drinks = []
			let previousID = null
			let currentID = generateUUID()
			let nextID = generateUUID()
			const drinksDataToRender = removeSavedMapIDs(drinksData)
			for (let index = 0; index < drinksDataToRender.length; index++) {
				const data = Object.assign({...drinksDataToRender[index], drinkMapID: currentID})
				const previous = drinksDataToRender[index - 1] ? Object.assign({...drinksDataToRender[index - 1], drinkMapID: previousID}) : null
				const next = drinksDataToRender[index + 1] ? Object.assign({...drinksDataToRender[index + 1], drinkMapID: nextID}) : null

				drinks.push(data)

				const node = {
					data,
					previous,
					next
				}

				previousID = currentID
				currentID = nextID
				nextID = generateUUID()

				// @ts-expect-error generic
				map[data.drinkMapID] = node
			}
			// @ts-expect-error generic
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
