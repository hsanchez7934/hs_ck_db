import './styles.css'
import {useState, useEffect, useMemo} from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import DrinkTags from '../DrinkTags'
import SimpleDialog from '../SimpleDialog'
import Typography from '@mui/material/Typography'
import generateUUID from '../../uuid'
import {DrinkDataPoint} from '../../types'
import {primaryFont} from '../../fonts/fonts'
import {generatePath} from 'react-router-dom'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import {updateModalDrink} from '../../store'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import DrinkLocalStorage from '../../helper-functions/drinkLocalStorage'

import {
	FaVideo,
	FaShare,
	FaHeartCircleMinus,
	FaHeartCirclePlus,
	FaCircleArrowLeft,
	FaCircleArrowRight
} from 'react-icons/fa6'

type Props = {drink: DrinkDataPoint | null}
const buttonStyles = {
	margin: 0,
	border: 'none'
}
const iconStyles = {
	fontSize: '25px'
}

const DrinkCard = (props: Props) => {
	const drinkStorage = useMemo(() => new DrinkLocalStorage(), [])
	drinkStorage.init()

	const {drink} = props
	console.log(drink)
	const [dialogText, setDialogText] = useState('')
	const [dialogTextColor, setDialogTextColor] = useState('')
	const [openDialog, setOpenDialog] = useState(false)
	const [toggleSaved, setToggleSaved] = useState(false)

	const dispatch = useAppDispatch()
	const {drinkPagerMap} = useAppSelector(({drinkPagerMap}) => drinkPagerMap)

	useEffect(() => {
		if (drinkStorage.isDrinkSaved(drink?.idDrink)) {
			setToggleSaved(true)
		} else {
			setToggleSaved(false)
		}
	}, [drink?.idDrink, drinkStorage, drinkPagerMap])

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
					sx={{marginRight: '5px', fontFamily: primaryFont, color: '#fff'}}
				>
					{name}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{fontFamily: primaryFont, color: '#fff'}}
				>
					{amount}
				</Typography>
			</div>
		)
	})

	const toggleDialog = (color: string, text: string) => {
		setDialogTextColor(color)
		setDialogText(text)
		setOpenDialog(true)
		setTimeout(() => {
			setOpenDialog(false)
		}, 1500)
	}

	const handleShareOnClick = async (drinkID: string | null): Promise<void> => {
		const path = generatePath('localhost:3000/drink/:id', {id: drinkID})
		window.navigator.clipboard.writeText(path).then(
			() => {
				toggleDialog('green', 'Link copied to clipboard!')
			},
			() => {
				toggleDialog('red', 'Oops, something went wrong! Please try again.')
			}
		)
	}

	const handleViewOnClick = (url: string | null) => {
		if (url) {
			window.open(url)?.focus()
		}
	}

	const handleSaveOnClick = (drink: any) => {
		setToggleSaved(!toggleSaved)
		if (!toggleSaved) {
			drinkStorage.saveDrink(drink)
			toggleDialog('green', 'Saved to favorites!')
		} else {
			drinkStorage.removeDrink(drink.idDrink)
			toggleDialog('red', 'Removed from favorites!')
		}
	}

	const handlePager = async (drink: DrinkDataPoint, direction: string) => {
		const {drinkMapID} = drink
		let data = null

		if (drinkMapID !== undefined) {
			if (direction === 'left') {
				data = drinkPagerMap[drinkMapID].previous
			} else if (direction === 'right') {
				data = drinkPagerMap[drinkMapID].next
			}
		}

		if (data) {
			if (!data.strInstructions) {
				const response = await fetchDrinkDataByID(data)
				const {drinkMapID} = data
				data = {...response, drinkMapID}
			}
			console.log(data)
			dispatch(updateModalDrink(data))
			const currentUrl = window.location.href
			const split = currentUrl.split('/')
			split[split.length - 1] = data.idDrink
			const updatedURL = split.join('/')
			window.history.replaceState(null, '', updatedURL)
		}
	}

	const renderedGlassType = drink?.strDrink && (
		<Typography
			variant="h6"
			color="text.secondary"
			sx={{marginTop: '10px', fontFamily: primaryFont, color: '#fff'}}
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

	console.log(drinkPagerMap)
	const hasPrevious: boolean =
		drinkPagerMap &&
		drink?.drinkMapID &&
		drinkPagerMap[drink.drinkMapID] &&
		drinkPagerMap[drink.drinkMapID].previous !== null
	const hasNext: boolean =
		drinkPagerMap &&
		drink?.drinkMapID &&
		drinkPagerMap[drink.drinkMapID] &&
		drinkPagerMap[drink.drinkMapID].next !== null

		console.log(hasPrevious, 'previous')
		console.log(hasNext, 'next')

	const renderedPagerPrevious = (
		<Button
			size="small"
			onClick={() => {
				if (drink && hasPrevious) handlePager(drink, 'left')
			}}
			sx={buttonStyles}
			disabled={hasPrevious ? false : true}
			className='btn_disabled'
		>
			<FaCircleArrowLeft color={hasPrevious ? 'white' : 'gray'} style={iconStyles} />
		</Button>
	)

	const renderedPagerNext = (
		<Button
			size="small"
			onClick={() => {
				if (drink && hasNext) handlePager(drink, 'right')
			}}
			sx={buttonStyles}
			disabled={hasNext ? false : true}
			className='btn_disabled'
		>
			<FaCircleArrowRight color={hasNext ? 'white' : 'gray'} style={iconStyles} />
		</Button>
	)

	const renderedSaveIcon = toggleSaved ? (
		<FaHeartCirclePlus color="red" style={iconStyles} />
	) : (
		<FaHeartCircleMinus color="white" style={iconStyles} />
	)

	const renderedVideoIcon = drink?.strVideo && (
		<Button size="small" onClick={() => handleViewOnClick(drink.strVideo)} sx={buttonStyles}>
			<FaVideo color="white" style={iconStyles} />
		</Button>
	)

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
					className="truncate"
					title={`${drink?.strDrink}`}
				>
					{drink?.strDrink}
				</Typography>
				{renderedGlassType}
				<Divider sx={{backgroundColor: '#fff'}} />
				<CardContent sx={{overflow: 'auto', height: '70%', padding: '7px 3px 0px 0px'}}>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{margin: '0', fontFamily: primaryFont, color: '#fff'}}
					>
						Ingredients
					</Typography>
					<div style={{marginBottom: '20px'}}>{renderedIngredients}</div>
					<Divider sx={{backgroundColor: '#fff'}} />
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{fontFamily: primaryFont, marginTop: '10px', color: '#fff'}}
					>
						Instructions
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{fontFamily: primaryFont, color: '#fff'}}
					>
						{drink?.strInstructions}
					</Typography>
					{renderedTags}
				</CardContent>
				<CardContent sx={{padding: 0, margin: '10px 0 0 0'}}>
					<CardActions sx={{padding: 0, margin: 0}}>
						{renderedPagerPrevious}
						{renderedPagerNext}
						<Button size="small" onClick={() => handleSaveOnClick(drink)} sx={buttonStyles}>
							{renderedSaveIcon}
						</Button>
						<Button
							size="small"
							onClick={() => {
								if (drink?.idDrink) handleShareOnClick(drink.idDrink)
							}}
							sx={buttonStyles}
						>
							<FaShare color="white" style={iconStyles} />
						</Button>
						{renderedVideoIcon}
						<SimpleDialog
							open={openDialog}
							dialogTextColor={dialogTextColor}
							dialogText={dialogText}
						/>
					</CardActions>
				</CardContent>
			</CardContent>
			<CardMedia sx={{height: '100%', width: '40%'}} image={drink?.strDrinkThumb || undefined} />
		</Card>
	)
}

export default DrinkCard