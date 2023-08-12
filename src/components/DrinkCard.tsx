import * as React from 'react'
// import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
// import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import DrinkTags from './DrinkTags'
import Typography from '@mui/material/Typography'
import generateUUID from '../uuid'
import {DrinkDataPoint} from '../types'
import {primaryFont, secondaryFont} from '../fonts/fonts'

type Props = {drink: DrinkDataPoint | null}

const DrinkCard = (props: Props) => {
	const {drink} = props
	let counter = 1
	const ingredients = []

	if (drink) {
		while (drink[`strIngredient${counter}`] as keyof DrinkDataPoint) {
			ingredients.push({
				name: drink[`strIngredient${counter}` as keyof DrinkDataPoint],
				amount: drink[`strMeasure${counter}` as keyof DrinkDataPoint],
				id: generateUUID()
			})
			counter = counter + 1
		}
	}

	const renderedIngredients = ingredients.map(({name, amount, id}) => {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: '2px'
				}}
				key={id}
			>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{marginRight: '5px', fontFamily: secondaryFont}}
				>
					{name}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{fontFamily: secondaryFont}}>
					{amount}
				</Typography>
			</div>
		)
	})

	const glass = (
		<Typography
			variant="h6"
			color="text.secondary"
			sx={{marginTop: '10px', fontFamily: secondaryFont}}
		>
			{drink?.strGlass}
		</Typography>
	)

	const renderedTags =
		drink?.strTags && drink?.strTags.length > 0 ? (
			<DrinkTags tags={drink?.strTags.split(',')} />
		) : (
			<></>
		)

	return (
		<Card
			sx={{
				width: '100%',
				display: 'flex',
				height: '100%',
				padding: '15px 15px 15px 10px'
			}}
		>
			<CardContent sx={{width: '60%'}}>
				<Typography
					gutterBottom
					variant="h4"
					component="div"
					sx={{fontFamily: primaryFont, margin: '0'}}
				>
					{drink?.strDrink}
				</Typography>
				{drink?.strDrink && glass}
				<Divider />
				<CardContent sx={{overflow: 'auto', height: '70%', padding: '7px 3px 0px 0px'}}>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{margin: '0', fontFamily: secondaryFont}}
					>
						Ingredients
					</Typography>
					<div style={{marginBottom: '20px'}}>{renderedIngredients}</div>
					<Divider />
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{fontFamily: secondaryFont, marginTop: '10px'}}
					>
						Instructions
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{fontFamily: secondaryFont}}>
						{drink?.strInstructions}
					</Typography>
					{renderedTags}
				</CardContent>
			</CardContent>
			<CardMedia
				sx={{height: '100%', width: '40%'}}
				image={drink?.strDrinkThumb || undefined}
				title="green iguana"
			/>
			{/* <CardActions>
				<Button size="small">Share</Button>
				<Button size="small">Learn More</Button>
			</CardActions> */}
		</Card>
	)
}

export default DrinkCard
