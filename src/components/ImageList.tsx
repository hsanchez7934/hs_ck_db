import './styles.css'
import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'

const MasonryImageList = (props: any) => {
	const {drinksData} = props

	return (
		<Box sx={{width: '100%', height: '100%'}}>
			<ImageList variant="masonry" cols={3} gap={8}>
				{drinksData.map((drink: any) => (
					<ImageListItem key={drink.idDrink} className="image-container">
						<img
							src={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format`}
							srcSet={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format&dpr=2 2x`}
							alt={drink.strDrink}
							loading="lazy"
						/>
						<div className="overlay-photo">
							<p className="overlay-photo-text">{drink.strDrink}</p>
						</div>
					</ImageListItem>
				))}
			</ImageList>
		</Box>
	)
}

export default MasonryImageList
