import * as React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import generateUUID from '../../uuid'

const MediaCard = (props: any) => {
	// console.log(props.drink)
	const {drink} = props

	let counter = 1
	const ingredients = []
	while (drink[`strIngredient${counter}`]) {
		ingredients.push({
			name: drink[`strIngredient${counter}`],
			amount: drink[`strMeasure${counter}`],
			id: generateUUID()
		})
		counter = counter + 1
	}

	const renderedIngredients = ingredients.map(({name, amount, id}) => {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: '5px'
				}}
				key={id}
			>
				<Typography variant="body2" color="text.secondary" sx={{marginRight: '5px'}}>
					{name}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{amount}
				</Typography>
			</div>
		)
	})

	return (
		<Card sx={{width: '100%', display: 'flex', height: '500px', marginBottom: '10px'}}>
			<CardContent sx={{width: '60%', overflow: 'auto'}}>
				<Typography gutterBottom variant="h5" component="div">
					{drink.strDrink}
				</Typography>
				<Divider />
				<Typography variant="h6" color="text.secondary" sx={{marginTop: '10px'}}>
					Ingredients
				</Typography>
				<div style={{marginBottom: '20px'}}>{renderedIngredients}</div>
				<Divider />
				<Typography variant="h6" color="text.secondary">
					Instructions
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{drink.strInstructions}
				</Typography>
			</CardContent>
			<CardMedia
				sx={{height: '100%', width: '40%'}}
				image={drink.strDrinkThumb}
				title="green iguana"
			/>
			{/* <CardActions>
				<Button size="small">Share</Button>
				<Button size="small">Learn More</Button>
			</CardActions> */}
		</Card>
	)
}

export default MediaCard
