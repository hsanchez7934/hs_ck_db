import './styles.css'
import React, {ReactElement, useEffect, useState} from 'react'
import {DrinkDataPoint} from '../../types'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import generateUUID from '../../uuid'
import {generatePath, Link} from 'react-router-dom'
import {primaryFont} from '../../fonts/fonts'

import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import SimpleDialog from '../SimpleDialog/SimpleDialog'

import {useAppSelector, useAppDispatch} from '../../store/hooks'
import {useAuth0} from '@auth0/auth0-react'
import {saveUserDrinkInDB} from '../../firebase/firebase-user-drink-storage'
import {updateUserSavedDrinks, updateGetFreshUpdate} from '../../store'
import {
	FaVideo,
	FaShare,
	FaHeartCircleMinus,
	FaHeartCirclePlus,
	FaCircleArrowLeft,
	FaCircleArrowRight,
	FaAngleLeft
	// FaEye
} from 'react-icons/fa6'
import {
	// updateModalDrink,
	updateTriggerRender
	// updateUserSavedDrinks,
	// updateGetFreshUpdate
} from '../../store'

// import { redirect } from 'react-router'

interface MobileDrinkViewProps {
	drink: DrinkDataPoint | null
	drinkPagerMap: any
	ingredients: {name: string; amount: string}[]
	prevPath: string | null
}

const buttonStyles = {
	margin: 0,
	borderRadius: '36px',
	backgroundColor: 'black',
	minHeight: '50px',
	minWidth: '50px',
	maxHeight: '40px',
	maxWidth: '40px',
	opacity: '0.8'
}

const iconStyles = {
	fontSize: '25px'
}

const MobileDrinkView = (props: MobileDrinkViewProps): ReactElement => {
	const {drink, drinkPagerMap, ingredients, prevPath} = props
	// console.log(prevPath)
	// console.log(drinkPagerMap)
	// console.log(drink)

	const {isAuthenticated, user} = useAuth0()
	const dispatch = useAppDispatch()
	const {userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)

	const [toggleSaved, setToggleSaved] = useState(false)
	const [dialogText, setDialogText] = useState('')
	const [dialogTextColor, setDialogTextColor] = useState('')
	const [openSavedStatedDialog, setOpenSavedStateDialog] = useState(false)
	const [toggleLoginDialog, setToggleLoginDialog] = useState(false)

	const isDrinkSaved = (drinkID: string | null | undefined) => {
		if (drinkID) {
			const found = userSavedDrinks?.find((drink: any) => drink.idDrink === drinkID)
			return found
		}
		return false
	}

	useEffect(() => {
		if (isAuthenticated && isDrinkSaved(drink?.idDrink)) {
			setToggleSaved(true)
		} else {
			setToggleSaved(false)
		}
	}, [drink?.idDrink, isAuthenticated, user])

	const toggleDialog = (color: string, text: string) => {
		setDialogTextColor(color)
		setDialogText(text)
		setOpenSavedStateDialog(true)
		setTimeout(() => {
			setOpenSavedStateDialog(false)
		}, 1500)
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
			console.log('not authenticated')
			// setToggleLoginDialog(true)
		}
	}

	// const handleShareOnClick = async (drinkID: string | null): Promise<void> => {
	// 	const path = generatePath(`${window.location.origin}/drink/:id`, {id: drinkID})
	// 	window.navigator.clipboard.writeText(path).then(
	// 		() => {
	// 			toggleDialog('green', 'Link copied to clipboard!')
	// 		},
	// 		() => {
	// 			toggleDialog('red', 'Oops, something went wrong! Please try again.')
	// 		}
	// 	)
	// }

	const renderedBubble = (title: string, text: string | null, cssStyling: any) => {
		return (
			<div className="mobileIngredientBubbleSection" style={cssStyling}>
				<p style={{fontFamily: primaryFont}} className="bubbleTitle">
					{title}
				</p>
				<p style={{fontFamily: primaryFont}} className="bubbleText truncate" title={text || ''}>
					{text}
				</p>
			</div>
		)
	}

	const renderedSaveIcon = toggleSaved ? (
		<FaHeartCirclePlus title="Add/Remove from favorites" color="red" style={iconStyles} />
	) : (
		<FaHeartCircleMinus title="Add/Remove from favorites" color="white" style={iconStyles} />
	)

	// const handleViewOnClick = (url: string | null) => {
	// 	if (url) {
	// 		window.open(url)?.focus()
	// 	}
	// }

	// const renderedVideoIcon = drink?.strVideo && (
	// 	<Button
	// 		title="Open drink instruction video."
	// 		size="large"
	// 		onClick={() => handleViewOnClick(drink.strVideo)}
	// 		sx={buttonStyles}
	// 	>
	// 		<FaVideo color="white" style={iconStyles} />
	// 	</Button>
	// )

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
			// redirect(`/drink/${Number(data.idDrink)}`)
			// dispatch(updateModalDrink(data))
			const currentUrl = window.location.href
			const split = currentUrl.split('/')
			split[split.length - 1] = data.idDrink
			const updatedURL = split.join('/')
			window.history.replaceState(null, '', updatedURL)
		}
	}
	// console.log(drink)
	// console.log(drinkPagerMap)
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

	console.log('hasPrev: ', hasPrevious)
	console.log('hasNext: ', hasNext)

	const renderedPagerPrevious = (
		<Button
			size="small"
			onClick={() => {
				if (drink && hasPrevious) handlePager(drink, 'left')
			}}
			sx={buttonStyles}
			disabled={hasPrevious ? false : true}
			className="btn_disabled"
			title="Previous Drink"
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
			className="btn_disabled"
			title="Next Drink"
		>
			<FaCircleArrowRight color={hasNext ? 'white' : 'gray'} style={iconStyles} />
		</Button>
	)

	return (
		<div>
			<div
				style={{
					height: '400px',
					backgroundImage: `url(${drink?.strDrinkThumb})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					position: 'relative'
				}}
			>
				<div className="mobileDrinkPageSaveBackContainer">
					<div className="mobileDrinkPageBackContainer">
						<Link to={prevPath || ''} state={{test: 'test'}}>
							<Button
							title="Navigate back to previous page."
							size="small"
							sx={buttonStyles}
						>
							<FaAngleLeft color="white" style={iconStyles} />
						</Button>
						</Link>
					</div>
					<div className="mobileDrinkPageSaveContainer">
						<Button size="small" onClick={() => handleSaveOnClick(drink)} sx={buttonStyles}>
							{renderedSaveIcon}
						</Button>
					</div>
				</div>
				<div className="mobileDrinkPageTitleContainer">
					<h1 style={{fontFamily: primaryFont}} className="mobileDrinkPageTitle">
						{drink?.strDrink}
					</h1>
				</div>
			</div>
			<div className="mobileDrinkPageBubbleTextContainer">
				<div className="mobileIngredientBubble gradientFilter">
					{renderedBubble('Type', drink?.strAlcoholic || '', {})}
					{renderedBubble('Glass', drink?.strGlass || '', {borderLeft: '1px solid darkgrey'})}
					{renderedBubble('Category', drink?.strCategory || '', {borderLeft: '1px solid darkgrey'})}
				</div>
			</div>
			<div className="mobileDrinkPageIngredientsContainer">
				<h2 style={{fontFamily: primaryFont}} className="mobileDrinkPageIngredientsHeader">
					Ingredients
				</h2>
				<div className="mobileDrinkPageIngredientsListContainer">
					{ingredients.map((ingredient: {amount: string; name: string}) => {
						return (
							<div className="mobileDrinkPageIngredientCard gradientFilter" key={generateUUID()}>
								<div className="mobileDrinkPageIngredientImgContainer">
									<img
										src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.name}-small.png`}
									/>
								</div>
								<div className="mobileDrinkPageIngredientTextContainer">
									<p style={{fontFamily: primaryFont, color: 'darkgray'}}>Ingredient</p>
									<p
										style={{fontFamily: primaryFont, color: 'aqua'}}
									>{`${ingredient.name || ''}`}</p>
								</div>
								<div
									className="mobileDrinkPageIngredientTextContainer"
									style={{borderLeft: 'none'}}
								>
									<p style={{fontFamily: primaryFont, color: 'darkgray', textAlign: 'right'}}>
										Amount
									</p>
									<p
										style={{fontFamily: primaryFont, textAlign: 'right', color: 'aqua'}}
									>{`${ingredient.amount || 'To your liking'}`}</p>
								</div>
							</div>
						)
					})}
				</div>
				<h2 style={{fontFamily: primaryFont}} className="mobileDrinkPageIngredientsHeader">
					Instructions
				</h2>
				<div style={{padding: '5px 20px'}}>
					<p
						className="mobileDrinkPageInstructionsText gradientFilter"
						style={{fontFamily: primaryFont, color: 'white'}}
					>
						{drink?.strInstructions}
					</p>
				</div>
			</div>
		</div>
	)
}

export default MobileDrinkView
