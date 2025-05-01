import './styles.css'
import React, {ReactElement, useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import {DrinkDataPoint} from '../../types'
import {Link, generatePath} from 'react-router-dom'
import SimpleDialog from '../SimpleDialog/SimpleDialog'

import generateUUID from '../../uuid'
import {primaryFont} from '../../fonts/fonts'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import {useAuth0} from '@auth0/auth0-react'
import {saveUserDrinkInDB} from '../../firebase/firebase-user-drink-storage'
import {
	updateUserSavedDrinks,
	updateGetFreshUpdate,
	updateTriggerRender,
	updateUseSavedScrollTop
} from '../../store'
import {
	FaVideo,
	FaShare,
	FaHeartCircleMinus,
	FaHeartCirclePlus,
	FaAngleLeft
	// FaEye
} from 'react-icons/fa6'

interface MobileDrinkViewProps {
	drink: DrinkDataPoint | null
	ingredients: {name: string; amount: string}[]
	prevPath: string
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
	const {drink, ingredients, prevPath} = props

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
			if (found) {
				return true
			}
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
			setToggleLoginDialog(true)
		}
	}

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

	const renderedVideoIcon = (videoUrl: string | null | undefined) => {
		if (videoUrl) {
			return (
				<Button
					title="Open drink instruction video."
					size="small"
					onClick={() => handleViewOnClick(videoUrl)}
					sx={buttonStyles}
				>
					<FaVideo color="white" style={iconStyles} />
				</Button>
			)
		}
	}

	const fetchFromStorageSession = prevPath === '/'
	const handleUpdateUseSavedScrollTop = () => dispatch(updateUseSavedScrollTop(true))

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
				<div className="mobileDrinkPageActionLeft">
					<Link to={prevPath} state={{fetchFromStorageSession}}>
						<Button
							title="Navigate back to previous page."
							size="small"
							sx={buttonStyles}
							onClick={() => handleUpdateUseSavedScrollTop()}
						>
							<FaAngleLeft color="white" style={iconStyles} />
						</Button>
					</Link>
				</div>

				<div className="mobileDrinkPageActionRight">
					<Button
						size="small"
						onClick={() => handleSaveOnClick(drink)}
						sx={{...buttonStyles, marginBottom: '10px'}}
					>
						{renderedSaveIcon}
					</Button>
					<Button
						size="small"
						onClick={() => {
							if (drink) handleShareOnClick(drink.idDrink)
						}}
						sx={{...buttonStyles, marginBottom: '10px'}}
					>
						<FaShare color="white" style={iconStyles} />
					</Button>
					{renderedVideoIcon(drink?.strVideo)}
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
			<>
				<SimpleDialog
					open={openSavedStatedDialog}
					dialogTextColor={dialogTextColor}
					dialogText={dialogText}
					isLoginDialog={false}
				/>
				<SimpleDialog
					open={toggleLoginDialog}
					isLoginDialog={true}
					onLoginDialogClose={() => setToggleLoginDialog(false)}
				/>
			</>
		</div>
	)
}

export default MobileDrinkView
