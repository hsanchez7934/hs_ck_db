import './styles.css'
import {DrinkDataPoint} from '../../types'
import {Link, useLocation} from 'react-router-dom'
import {updateIsModalOpen, updateModalDrink, updateDrinkMap} from '../../store'
import {useAppDispatch} from '../../store/hooks'
import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import {useEffect} from 'react'

interface Props {
	drinksData: DrinkDataPoint[]
}

const DrinksImageList = (props: Props) => {
	const {drinksData} = props
	let location = useLocation()
	const dispatch = useAppDispatch()

	useEffect(() => {
		const setDrinkPagerMap = () => {
			const map = {}
			for (let index = 0; index < drinksData.length; index++) {
				const drink = drinksData[index]
				const drinkPrevious = drinksData[index - 1]
				const drinkNext = drinksData[index + 1]
				const node = {
					data: drink,
					previous: drinkPrevious ? drinkPrevious : null,
					next: drinkNext ? drinkNext : null
				}
				// @ts-expect-error
				map[drink.idDrink] = node
			}
			dispatch(updateDrinkMap(map))
		}
		setDrinkPagerMap()
	}, [drinksData, dispatch])

	const handleOnClick = async (drink: DrinkDataPoint) => {
		if (!drink.strInstructions) {
			drink = await fetchDrinkDataByID(drink)
		}
		dispatch(updateIsModalOpen(true))
		dispatch(updateModalDrink(drink))
	}

	const renderedDrinkImages = drinksData.map((drink: DrinkDataPoint) => (
		<Link key={drink.idDrink} to={`/drink/${drink.idDrink}`} state={{backgroundLocation: location}}>
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
				cols={4}
				gap={8}
				sx={{margin: 0, padding: '7px', overflow: 'hidden'}}
			>
				{renderedDrinkImages}
			</ImageList>
		</Box>
	)
}

export default DrinksImageList
