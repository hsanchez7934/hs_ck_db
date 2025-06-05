import './styles.css'
import React from 'react'
import {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import {DrinkDataPoint} from '../../types'
import DrinkTags from '../DrinkTags'
import SimpleDialog from '../SimpleDialog/SimpleDialog'
import Typography from '@mui/material/Typography'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import generateUUID from '../../uuid'
import {generatePath} from 'react-router-dom'
import {primaryFont} from '../../fonts/fonts'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import {useAuth0} from '@auth0/auth0-react'

import {saveUserDrinkInDB} from '../../firebase/firebase-user-drink-storage'
import {
	updateModalDrink,
	updateTriggerRender,
	updateUserSavedDrinks,
	updateGetFreshUpdate
} from '../../store'

import {
	FaVideo,
	FaShare,
	FaHeartCircleMinus,
	FaHeartCirclePlus,
	FaCircleArrowLeft,
	FaCircleArrowRight,
	FaEye
} from 'react-icons/fa6'

type Props = {drink: DrinkDataPoint | null}
// const buttonStyles = {
// 	margin: 0,
// 	border: 'none'
// }
// const buttonClasses = ''
const iconStyles = {
	fontSize: '25px'
}

const DrinkCard = (props: Props) => {
	const {isAuthenticated, user} = useAuth0()

	const {drink} = props
	const [dialogText, setDialogText] = useState('')
	const [dialogTextColor, setDialogTextColor] = useState('')
	const [openSavedStatedDialog, setOpenSavedStateDialog] = useState(false)
	const [toggleSaved, setToggleSaved] = useState(false)

	const [toggleLoginDialog, setToggleLoginDialog] = useState(false)

	const dispatch = useAppDispatch()
	const {drinkPagerMap} = useAppSelector(({drinkPagerMapState}) => drinkPagerMapState)
	const {userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)

	const isDrinkSaved = (drinkID: string | null | undefined) => {
		if (drinkID) {
			const found = userSavedDrinks?.find((drink: any) => drink.idDrink === drinkID)
			return found
		}
		return false
	}

	useEffect(() => {
		if (isDrinkSaved(drink?.idDrink)) {
			setToggleSaved(true)
		} else {
			setToggleSaved(false)
		}
	}, [drink?.idDrink, drinkPagerMap, isAuthenticated, user])

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
				<Typography sx={{fontFamily: primaryFont, color: '#fff'}} className="drinkCardDescText">
					{name}
				</Typography>
				<Typography
					className="drinkCardDescText"
					sx={{marginRight: '5px', fontFamily: primaryFont, color: '#fff'}}
				>
					{amount}
				</Typography>
			</div>
		)
	})

	const toggleDialog = (color: string, text: string) => {
		setDialogTextColor(color)
		setDialogText(text)
		setOpenSavedStateDialog(true)
		setTimeout(() => {
			setOpenSavedStateDialog(false)
		}, 1500)
	}

	const handleOpenDetailedView = (drinkID: string | any): void => {
		let path
		if (process.env.NODE_ENV === 'production') {
			path = generatePath('/drink/:id', {id: drinkID})
		} else {
			path = generatePath(`localhost:3000/drink/:id`, {id: drinkID})
		}
		window.open(path, '_blank')
	}

	const handleShareOnClick = async (drinkID: string | null): Promise<void> => {
		const path = generatePath(`${window.location.origin}/drink/:id`, {id: drinkID})
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
		if (isAuthenticated) {
			dispatch(updateTriggerRender(true))
			setToggleSaved(!toggleSaved)
			if (!toggleSaved) {
				const drinks = [...userSavedDrinks]
				drinks.push(drink)
				saveUserDrinkInDB(user?.sub, drinks).then(() => {
					toggleDialog('green', 'Saved to favorites!')
					dispatch(updateUserSavedDrinks(drinks))
					dispatch(updateGetFreshUpdate(true))
				})
			} else {
				const filtered = userSavedDrinks.filter(
					(savedDrink: any) => savedDrink.idDrink !== drink.idDrink
				)
				saveUserDrinkInDB(user?.sub, filtered).then(() => {
					dispatch(updateUserSavedDrinks(filtered))
					dispatch(updateGetFreshUpdate(true))
					toggleDialog('red', 'Removed from favorites!')
				})
			}
		} else {
			setToggleLoginDialog(true)
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
			color="text.secondary"
			sx={{marginTop: '10px', fontFamily: primaryFont, color: '#fff'}}
			className="drinkCardSecondaryTitle"
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

	const renderedPagerPrevious = (
		<Button
			size="small"
			onClick={() => {
				if (drink && hasPrevious) handlePager(drink, 'left')
			}}
			// sx={buttonStyles}
			disabled={hasPrevious ? false : true}
			className="btn_disabled"
			title="Previous Drink"
		>
			<FaCircleArrowLeft
				color={hasPrevious ? 'white' : 'gray'}
				className="xl:mr-10 2xl:mr-12 h-7 w-7 lg:h-8 lg:w-8 xl:w-9 xl:h-9 2xl:h-11 2xl:w-11"
			/>
		</Button>
	)

	const renderedPagerNext = (
		<Button
			size="small"
			onClick={() => {
				if (drink && hasNext) handlePager(drink, 'right')
			}}
			// sx={buttonStyles}
			disabled={hasNext ? false : true}
			className="btn_disabled"
			title="Next Drink"
		>
			<FaCircleArrowRight
				color={hasNext ? 'white' : 'gray'}
				className="xl:mr-10 2xl:mr-12 h-7 w-7 lg:h-8 lg:w-8 xl:w-9 xl:h-9 2xl:h-11 2xl:w-11"
			/>
		</Button>
	)

	const renderedSaveIcon = toggleSaved ? (
		<FaHeartCirclePlus
			title="Add/Remove from favorites"
			color="red"
			className="xl:mr-10 2xl:mr-12 h-7 w-7 lg:h-8 lg:w-8 xl:w-9 xl:h-9 2xl:h-11 2xl:w-11"
		/>
	) : (
		<FaHeartCircleMinus
			title="Add/Remove from favorites"
			color="white"
			className="xl:mr-10 2xl:mr-12 h-7 w-7 lg:h-8 lg:w-8 xl:w-9 xl:h-9 2xl:h-11 2xl:w-11"
		/>
	)

	const renderedDetailedViewIcon = (
		<Button
			title="Open drink detailed view in new browser tab"
			onClick={() => handleOpenDetailedView(drink?.idDrink)}
		>
			<FaEye color="white" className="xl:mr-10 2xl:mr-12 h-7 w-7 lg:h-8 lg:w-8 xl:w-9 xl:h-9 2xl:h-11 2xl:w-11" />
		</Button>
	)

	const renderedVideoIcon = drink?.strVideo && (
		<Button
			title="Open drink instruction video."
			size="small"
			onClick={() => handleViewOnClick(drink.strVideo)}
			// sx={buttonStyles}
		>
			<FaVideo color="white" className="xl:mr-10 2xl:mr-12 h-7 w-7 lg:h-8 lg:w-8 xl:w-9 xl:h-9 2xl:h-11 2xl:w-11" />
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
					component="div"
					sx={{fontFamily: primaryFont, margin: '0', color: '#fff'}}
					className="truncate"
					title={`${drink?.strDrink}`}
					id="drinkCardTitle"
				>
					{drink?.strDrink}
				</Typography>
				{renderedGlassType}
				<Divider sx={{backgroundColor: '#fff'}} />
				<CardContent sx={{overflow: 'auto', height: '70%', padding: '7px 3px 0px 0px'}}>
					<Typography
						sx={{margin: '0', fontFamily: primaryFont, color: '#fff'}}
						className="drinkCardSecondaryTitle"
					>
						Ingredients
					</Typography>
					<div style={{marginBottom: '20px'}}>{renderedIngredients}</div>
					<Divider sx={{backgroundColor: '#fff'}} />
					<Typography
						sx={{fontFamily: primaryFont, marginTop: '10px', color: '#fff'}}
						className="drinkCardSecondaryTitle"
					>
						Instructions
					</Typography>
					<Typography className="drinkCardDescText" sx={{fontFamily: primaryFont, color: '#fff'}}>
						{drink?.strInstructions}
					</Typography>
					{renderedTags}
				</CardContent>
				<CardContent sx={{padding: '5px 0px'}} className='flex'>
					<CardActions sx={{padding: '5px 0px'}} className='flex w-[95%]'>
						{renderedPagerPrevious}
						{renderedPagerNext}
						<Button
							size="small"
							onClick={() => handleSaveOnClick(drink)}
							// sx={buttonStyles}
						>
							{renderedSaveIcon}
						</Button>
						<Button
							title="Copy shareable link to clipboard"
							size="small"
							onClick={() => {
								if (drink?.idDrink) handleShareOnClick(drink.idDrink)
							}}
							// sx={buttonStyles}
						>
							<FaShare
								color="white"
								className="xl:mr-10 2xl:mr-12 h-7 w-7 lg:h-8 lg:w-8 xl:w-9 xl:h-9 2xl:h-11 2xl:w-11"
							/>
						</Button>
						{renderedDetailedViewIcon}
						{renderedVideoIcon}
						<SimpleDialog
							open={openSavedStatedDialog}
							dialogTextColor={dialogTextColor}
							dialogText={dialogText}
							isLoginDialog={false}
						/>
						{toggleLoginDialog && (
							<SimpleDialog
								open={toggleLoginDialog}
								isLoginDialog={true}
								onLoginDialogClose={() => setToggleLoginDialog(false)}
							/>
						)}
					</CardActions>
				</CardContent>
			</CardContent>
			<CardMedia sx={{height: '100%', width: '40%'}} image={drink?.strDrinkThumb || undefined} />
		</Card>
	)
}

export default DrinkCard
