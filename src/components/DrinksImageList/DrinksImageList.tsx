import './styles.css'
import {DrinkDataPoint} from '../../types'
import {Link, useLocation} from 'react-router-dom'
import {updateIsModalOpen, updateModalDrink} from '../../store'
import {useAppDispatch} from '../../store/hooks'
import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'

interface Props {
	drinksData: DrinkDataPoint[]
}

const DrinksImageList = (props: Props) => {
	const {drinksData} = props
	let location = useLocation()
	const dispatch = useAppDispatch()

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
