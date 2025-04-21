import './styles.css'
import React, {ReactElement} from 'react'
import Box from '@mui/material/Box'
// import {DeleteForever} from '@mui/icons-material'
import {DrinkDataPoint} from '../../types'
// import IconButton from '@mui/material/IconButton'
// import StarBorderIcon from '@mui/icons-material/StarBorder'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
// import ImageListItemBar from '@mui/material/ImageListItemBar'
import {Link, useLocation} from 'react-router-dom'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import generateUUID from '../../uuid'
import {updateIsModalOpen, updateModalDrink, updateDrinkMap} from '../../store'
import {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {primaryFont} from '../../fonts/fonts'
import {FaHeartCircleMinus, FaHeartCirclePlus, FaEye} from 'react-icons/fa6'
import {useAuth0} from '@auth0/auth0-react'
import SimpleDialog from '../SimpleDialog/SimpleDialog'
import {updateTriggerRender} from '../../store'
import {updateUserSavedDrinks, updateGetFreshUpdate} from '../../store'
import {saveUserDrinkInDB} from '../../firebase/firebase-user-drink-storage'

interface Props {
	drinksData: DrinkDataPoint[]
}

const srcset = (image: string | null, width: number, height: number, rows = 1, cols = 1) => {
	return {
		src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
		srcSet: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format&dpr=2 2x`
	}
}

const setGridColumns = (width: number) => {
	let columns = 4
	if (width < 500) {
		columns = 1
	} else if (width < 700) {
		columns = 2
	} else if (width < 900) {
		columns = 3
	}
	return columns
}

const removeSavedMapIDs = (drinksList: any) => {
	if (drinksList?.[0]?.drinkMapID) {
		const cleaned = drinksList.map((drink: any) => {
			const newDrink = Object.assign({}, drink)
			delete newDrink.drinkMapID
			return newDrink
		})
		return cleaned
	}
	return drinksList
}

const DrinksImageList = (props: Props) => {
	const {isAuthenticated, user} = useAuth0()
	const windowWidth = window.innerWidth
	const {drinksData} = props
	const [renderData, setRenderData] = useState([])
	const [toggleLoginDialog, setToggleLoginDialog] = useState(false)
	const [toggleSaved, setToggleSaved] = useState(false)
	const [dialogText, setDialogText] = useState('')
	const [dialogTextColor, setDialogTextColor] = useState('')
	const [openSavedStatedDialog, setOpenSavedStateDialog] = useState(false)
	const location = useLocation()
	const dispatch = useAppDispatch()
	const {userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)

	useEffect(() => {
		const setDrinkPagerMap = () => {
			const map = {}
			const drinks = []
			let previousID = null
			let currentID = generateUUID()
			let nextID = generateUUID()
			const drinksDataToRender = removeSavedMapIDs(drinksData)
			for (let index = 0; index < drinksDataToRender.length; index++) {
				const data = Object.assign({...drinksDataToRender[index], drinkMapID: currentID})
				const previous = drinksDataToRender[index - 1]
					? Object.assign({...drinksDataToRender[index - 1], drinkMapID: previousID})
					: null
				const next = drinksDataToRender[index + 1]
					? Object.assign({...drinksDataToRender[index + 1], drinkMapID: nextID})
					: null

				drinks.push(data)

				const node = {
					data,
					previous,
					next
				}

				previousID = currentID
				currentID = nextID
				nextID = generateUUID()

				// @ts-expect-error generic
				map[data.drinkMapID] = node
			}
			// @ts-expect-error generic
			setRenderData(drinks)
			dispatch(updateDrinkMap(map))
		}
		setDrinkPagerMap()
	}, [drinksData, isAuthenticated, user, dispatch])

	const handleOnClickLargeCard = async (drink: DrinkDataPoint) => {
		if (!drink.strInstructions) {
			const response = await fetchDrinkDataByID(drink)
			drink = {...response, ...drink}
		}
		dispatch(updateIsModalOpen(true))
		dispatch(updateModalDrink(drink))
	}

	const renderedLargeDrinkImages = () => {
		const largeDrinkCard = renderData.map((drink: DrinkDataPoint) => (
			<Link
				key={drink.drinkMapID}
				to={`/drink/${drink.idDrink}`}
				state={{backgroundLocation: location}}
			>
				<ImageListItem className="image-container" onClick={() => handleOnClickLargeCard(drink)}>
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
			<ImageList
				variant="standard"
				cols={setGridColumns(windowWidth)}
				gap={8}
				sx={{margin: 0, padding: '7px', overflow: 'hidden', width: '100%'}}
			>
				{largeDrinkCard}
			</ImageList>
		)
	}

	const toggleDialog = (color: string, text: string) => {
		setDialogTextColor(color)
		setDialogText(text)
		setOpenSavedStateDialog(true)
		setTimeout(() => {
			setOpenSavedStateDialog(false)
		}, 1500)
	}

	const handleMobileCardSaveOnClick = (drink: any) => {
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

	const renderFavoriteIcons = (
		drink: DrinkDataPoint,
		isSaved: string | null | undefined | boolean
	) => {
		const renderedSaveIcon =
			isAuthenticated && isSaved ? (
				<FaHeartCirclePlus
					title="Add/Remove from favorites"
					color="red"
					style={{fontSize: '35px'}}
					onClick={() => handleMobileCardSaveOnClick(drink)}
				/>
			) : (
				<FaHeartCircleMinus
					title="Add/Remove from favorites"
					color="white"
					style={{fontSize: '35px'}}
					onClick={() => handleMobileCardSaveOnClick(drink)}
				/>
			)
		return renderedSaveIcon
	}

	const renderedMobileDrinkImages = (): ReactElement => {
		const isDrinkSaved = (drinkID: string | null | undefined) => {
			if (drinkID) {
				const found = userSavedDrinks?.find((drink: any) => drink.idDrink === drinkID)
				return found
			}
			return false
		}
		const mobileDrinkCards = renderData.map((drink: DrinkDataPoint) => {
			// const saveIconColor = isAuthenticated && isDrinkSaved(drink.idDrink) ? 'red' : 'white'
			// const cols = drink.featured ? 2 : 1
			// const rows = drink.featured ? 2 : 1
			// const iconSize = drink.featured ? '35px' : '20px'
			// const titleSize = drink.featured ? '1.8em' : '1empx'
			const isSaved = isDrinkSaved(drink.idDrink)

			return (
				<ImageListItem
					key={drink.idDrink}
					className="image-container"
					sx={{borderRadius: '12px'}}
				>
					<img
						src={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format`}
						srcSet={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format&dpr=2 2x`}
						alt={drink.strDrink || ''}
						loading="lazy"
						style={{borderRadius: '12px'}}
					/>
					<div className="mobile-overlay-photo-top">
						<p
							className="mobile-overylay-photo-title"
							style={{fontFamily: primaryFont, fontSize: '2em'}}
						>
							{drink.strDrink}
						</p>
					</div>
					<div className="mobile-overlay-photo-bottom">
						<div className="mobile-overlay-favorite-container">
							{renderFavoriteIcons(drink, isSaved)}
						</div>
						<div
							className="mobile-overlay-favorite-container"
							style={{borderLeft: '1px solid white'}}
						>
							<Link
								key={drink.drinkMapID}
								to={`/drink/${drink.idDrink}`}
								state={{backgroundLocation: location}}
							>
								<FaEye style={{color: 'white', fontSize: '35px'}} />
							</Link>
						</div>
					</div>
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
				</ImageListItem>
			)
		})

		return (
			<ImageList
				variant="standard"
				cols={setGridColumns(windowWidth)}
				gap={8}
				sx={{margin: 0, padding: '7px', overflow: 'hidden', width: '100%'}}
			>
				{mobileDrinkCards}
			</ImageList>
		)
	}

	return (
		<Box sx={{height: '100%', overflow: 'auto', width: '100%'}}>
			{windowWidth > 800 ? renderedLargeDrinkImages() : renderedMobileDrinkImages()}
		</Box>
	)
}

export default DrinksImageList
