import * as React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import DrinkTags from './DrinkTags'
import SimpleDialog from '../components/SimpleDialog'
import Typography from '@mui/material/Typography'
import generateUUID from '../uuid'
import {DrinkDataPoint} from '../types'
import {primaryFont, secondaryFont} from '../fonts/fonts'
import {useState} from 'react'

import {FaShare} from 'react-icons/fa6'
import {FaHeartCircleMinus} from 'react-icons/fa6'
import {FaHeartCirclePlus} from 'react-icons/fa6'
import {FaVideo} from 'react-icons/fa6'

type Props = {drink: DrinkDataPoint | null}

const DrinkCard = (props: Props) => {
	const {drink} = props
	const [dialogText, setDialogText] = useState('')
	const [dialogTextColor, setDialogTextColor] = useState('')
	const [openDialog, setOpenDialog] = useState(false)
	const [toggleSaved, setToggleSaved] = useState(false)

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
					sx={{marginRight: '5px', fontFamily: secondaryFont, color: '#fff'}}
				>
					{name}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{fontFamily: secondaryFont, color: '#fff'}}
				>
					{amount}
				</Typography>
			</div>
		)
	})

	const glass = (
		<Typography
			variant="h6"
			color="text.secondary"
			sx={{marginTop: '10px', fontFamily: secondaryFont, color: '#fff'}}
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

	const handleShareOnClick = async (drinkID: string | null | undefined): Promise<void> => {
		const textToCopy = `https://localhost:3000/drink/${drinkID}`
		window.navigator.clipboard.writeText(textToCopy).then(
			() => {
				setDialogTextColor('green')
				setDialogText('Shareable link copied to clipboard!')
				setOpenDialog(true)
				setTimeout(() => {
					setOpenDialog(false)
				}, 2000)
			},
			() => {
				setDialogTextColor('red')
				setDialogText('Oops, something went wrong! Please try again.')
				setOpenDialog(true)
				setTimeout(() => {
					setOpenDialog(false)
				}, 2000)
			}
		)
	}

	const handleViewOnClick = (url: string | null) => {
		if (url) {
			window.open(url)?.focus()
		}
	}

	const handleSaveOnClick = () => {
		setToggleSaved(!toggleSaved)
	}

	const buttonStyles = {
		margin: 0,
		border: 'none'
	}
	const iconStyles = {
		fontSize: '25px'
	}

	return (
		<Card
			sx={{
				width: '100%',
				display: 'flex',
				height: '100%',
				padding: '15px 15px 15px 10px',
				backgroundColor: '#000',
				border: '1px solid #fff',
				borderRadius: '0px'
			}}
		>
			<CardContent sx={{width: '60%'}}>
				<Typography
					gutterBottom
					variant="h4"
					component="div"
					sx={{fontFamily: primaryFont, margin: '0', color: '#fff'}}
				>
					{drink?.strDrink}
				</Typography>
				{drink?.strDrink && glass}
				<Divider sx={{backgroundColor: '#fff'}} />
				<CardContent sx={{overflow: 'auto', height: '70%', padding: '7px 3px 0px 0px'}}>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{margin: '0', fontFamily: secondaryFont, color: '#fff'}}
					>
						Ingredients
					</Typography>
					<div style={{marginBottom: '20px'}}>{renderedIngredients}</div>
					<Divider sx={{backgroundColor: '#fff'}} />
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{fontFamily: secondaryFont, marginTop: '10px', color: '#fff'}}
					>
						Instructions
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{fontFamily: secondaryFont, color: '#fff'}}
					>
						{drink?.strInstructions}
					</Typography>
					{renderedTags}
				</CardContent>
				<CardContent sx={{padding: 0, margin: '10px 0 0 0'}}>
					<CardActions sx={{padding: 0, margin: 0}}>
						<Button size="small" onClick={handleSaveOnClick} sx={buttonStyles}>
							{toggleSaved ? (
								<FaHeartCirclePlus color="red" style={iconStyles} />
							) : (
								<FaHeartCircleMinus color="white" style={iconStyles} />
							)}
						</Button>
						<Button size="small" onClick={() => handleShareOnClick(drink?.idDrink)} sx={buttonStyles}>
							<FaShare color='white' style={iconStyles} />
						</Button>
						{drink?.strVideo && (
							<Button
								size="small"
								onClick={() => handleViewOnClick(drink.strVideo)}
								sx={buttonStyles}
							>
								<FaVideo color="white" style={iconStyles} />
							</Button>
						)}
						<SimpleDialog open={openDialog} dialogTextColor={dialogTextColor} dialogText={dialogText} />
					</CardActions>
				</CardContent>
			</CardContent>
			<CardMedia sx={{height: '100%', width: '40%'}} image={drink?.strDrinkThumb || undefined} />
		</Card>
	)
}

export default DrinkCard
