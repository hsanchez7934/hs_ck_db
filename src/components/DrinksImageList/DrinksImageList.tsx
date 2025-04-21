import './styles.css'
import React, {ReactElement} from 'react'
import Box from '@mui/material/Box'
// import {DeleteForever} from '@mui/icons-material'
import {DrinkDataPoint} from '../../types'
// import IconButton from '@mui/material/IconButton'
// import StarBorderIcon from '@mui/icons-material/StarBorder'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
// import ImageListItemBar from '@mui/material/ImageListItemBar'
import {Link, useLocation} from 'react-router-dom'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import generateUUID from '../../uuid'
import {updateIsModalOpen, updateModalDrink, updateDrinkMap} from '../../store'
import {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {primaryFont} from '../../fonts/fonts'
import {
	FaHeartCircleMinus,
	FaHeartCirclePlus,
	FaEye
} from 'react-icons/fa6'
import {useAuth0} from '@auth0/auth0-react'

interface Props {
	drinksData: DrinkDataPoint[]
}

const srcset = (image: string | null, width: number, height: number, rows = 1, cols = 1) => {
	return {
		src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
		srcSet: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format&dpr=2 2x`
	}
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
	const {isAuthenticated, user} = useAuth0()
	const windowWidth = window.innerWidth
	const {drinksData} = props
	const [renderData, setRenderData] = useState([])
	const location = useLocation()
	const dispatch = useAppDispatch()
	const {userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)

	useEffect(() => {
		const setDrinkPagerMap = () => {
			const map = {}
			const drinks = []
			let previousID = null
			let currentID = generateUUID()
			let nextID = generateUUID()
			const drinksDataToRender = removeSavedMapIDs(drinksData)
			for (let index = 0; index < drinksDataToRender.length; index++) {
				let featured = false
				if (index === 0) {
					featured = true
				} else if (index % 5 === 0) {
					featured = true
				}

				const data = Object.assign({...drinksDataToRender[index], drinkMapID: currentID, featured})
				const previous = drinksDataToRender[index - 1]
					? Object.assign({...drinksDataToRender[index - 1], drinkMapID: previousID})
					: null
				const next = drinksDataToRender[index + 1]
					? Object.assign({...drinksDataToRender[index + 1], drinkMapID: nextID})
					: null

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
	}, [drinksData, isAuthenticated, user, dispatch])

	const handleOnClickLargeCard = async (drink: DrinkDataPoint) => {
		if (!drink.strInstructions) {
			const response = await fetchDrinkDataByID(drink)
			drink = {...response, ...drink}
		}
		dispatch(updateIsModalOpen(true))
		dispatch(updateModalDrink(drink))
	}

	const renderedLargeDrinkImages = () => {
		const largeDrinkCard = renderData.map((drink: DrinkDataPoint) => (
			<Link
				key={drink.drinkMapID}
				to={`/drink/${drink.idDrink}`}
				state={{backgroundLocation: location}}
			>
				<ImageListItem className="image-container" onClick={() => handleOnClickLargeCard(drink)}>
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
			<ImageList
				variant="standard"
				cols={setGridColumns(windowWidth)}
				gap={8}
				sx={{margin: 0, padding: '7px', overflow: 'hidden', width: '100%'}}
			>
				{largeDrinkCard}
			</ImageList>
		)
	}

	const renderedMobileDrinkImages = (): ReactElement => {
		const mobileDrinkCards = renderData.map((drink: DrinkDataPoint) => {
			const cols = drink.featured ? 2 : 1
			const rows = drink.featured ? 2 : 1
			const iconSize = drink.featured ? '35px' : '20px'
			const titleSize = drink.featured ? '1.5em' : '1empx'

			return (
				<ImageListItem key={drink.idDrink} className="image-container" cols={cols} rows={rows} sx={{backgroundColor: 'yellow', borderRadius: '12px'}}>
					<img
						{...srcset(drink.strDrinkThumb, 250, 200, rows, cols)}
						alt={drink.strDrink || ''}
						loading="lazy"
						style={{borderRadius: '12px'}}
					/>
					<div className="mobile-overlay-photo-top">
						<p
							className="mobile-overylay-photo-title"
							style={{fontFamily: primaryFont, fontSize: titleSize}}
						>
							{drink.strDrink}
						</p>
					</div>
					<div className="mobile-overlay-photo-bottom">
						<div className="mobile-overlay-favorite-container">
							<FaHeartCircleMinus style={{color: 'white', fontSize: iconSize}} />
						</div>
						<div
							className="mobile-overlay-favorite-container"
							style={{borderLeft: '1px solid white'}}
						>
							<FaEye style={{color: 'white', fontSize: iconSize}} />
						</div>
					</div>
				</ImageListItem>
			)
		})

		return (
			<ImageList
				sx={{
					width: '100%',
					transform: 'translateZ(0)',
					overflow: 'hidden',
					padding: '7px',
					margin: 0
				}}
				rowHeight={200}
				gap={8}
			>
				{mobileDrinkCards}
			</ImageList>
		)
	}

	return (
		<Box sx={{height: '100%', overflow: 'auto', width: '100%'}}>
			{windowWidth > 800 ? renderedLargeDrinkImages() : renderedMobileDrinkImages()}
		</Box>
	)
}

export default DrinksImageList
