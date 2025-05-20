import React, {useState, useEffect} from 'react'
import LargeDrinkView from '../../components/LargeDrinkView/LargeDrinKView'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import MobileDrinkView from '../../components/MobileDrinkView/MobileDrinkView'
import NoDrinkDataNotice from '../../components/NoDrinkData'
import {useAuth0} from '@auth0/auth0-react'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import SimpleDialog from '../../components/SimpleDialog/SimpleDialog'

import {useFetchDrinkDataByIDQuery} from '../../store'
import {useParams, useLocation, generatePath} from 'react-router-dom'

import {updateUserSavedDrinks, updateGetFreshUpdate, updateTriggerRender} from '../../store'
import {saveUserDrinkInDB} from '../../firebase/firebase-user-drink-storage'

const DrinkPage = (): JSX.Element => {
	const {isAuthenticated, user} = useAuth0()
	const location = useLocation()
	const {id} = useParams<'id'>()
	const {data, error, isFetching} = useFetchDrinkDataByIDQuery(id)
	const drinkDataToRender = data?.drinks[0] || {}

	let counter = 1
	const ingredients: any | {name: string; amount: string}[] = []
	if (drinkDataToRender) {
		while (drinkDataToRender[`strIngredient${counter}`]) {
			ingredients.push({
				name: drinkDataToRender[`strIngredient${counter}`],
				amount: drinkDataToRender[`strMeasure${counter}`]
			})
			counter = counter + 1
		}
	}

	const {userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)
	const dispatch = useAppDispatch()

	const [toggleSaved, setToggleSaved] = useState(false)
	const [dialogText, setDialogText] = useState('')
	const [dialogTextColor, setDialogTextColor] = useState('')
	const [openSavedStatedDialog, setOpenSavedStateDialog] = useState(false)
	const [toggleLoginDialog, setToggleLoginDialog] = useState(false)
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)

	useEffect(() => {
			if (isAuthenticated && isDrinkSaved(drinkDataToRender?.idDrink)) {
				setToggleSaved(true)
			} else {
				setToggleSaved(false)
			}
		}, [isAuthenticated, user, userSavedDrinks, drinkDataToRender?.idDrink])

	useEffect(() => {
		const drinkPageContainer = document.getElementById('drinkPageContainer')
		if (drinkPageContainer) {
			const resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					const width = entry.contentRect.width
					setWindowWidth(width)
				}
			})
			resizeObserver.observe(drinkPageContainer)
			return () => {
				resizeObserver.disconnect()
			}
		}
	}, [])

	const toggleDialog = (color: string, text: string) => {
		setDialogTextColor(color)
		setDialogText(text)
		setOpenSavedStateDialog(true)
		setTimeout(() => {
			setOpenSavedStateDialog(false)
		}, 1500)
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

	const isDrinkSaved = (drinkID: string | null | undefined) => {
		if (drinkID) {
			const found = userSavedDrinks?.find((drink: any) => drink.idDrink === drinkID)
			if (found) {
				return true
			}
		}
		return false
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

	const mobileDrinkPageView = () => {
		return (
			<MobileDrinkView
				ingredients={ingredients}
				drink={drinkDataToRender}
				prevPath={location.state?.mobileStatePrevPath}
				handleSaveOnClick={(drink: any) => handleSaveOnClick(drink)}
				handleShareOnClick={(drink: any) => handleShareOnClick(drink)}
				handleViewOnClick={(drink: any) => handleViewOnClick(drink)}
				toggleSaved={toggleSaved}
			/>
		)
	}

	const largeDrinkPageView = () => {
		return (
			<LargeDrinkView
				ingredients={ingredients}
				drink={drinkDataToRender}
				handleSaveOnClick={(drink: any) => handleSaveOnClick(drink)}
				handleShareOnClick={(drink: any) => handleShareOnClick(drink)}
				handleViewOnClick={(drink: any) => handleViewOnClick(drink)}
				toggleSaved={toggleSaved}
			/>
		)
	}

	let content = <LoadingSpinner />
	if (isFetching) {
		content = <LoadingSpinner />
	} else if (error) {
		return <NoDrinkDataNotice isErrorMessage={true} />
	} else {
		content = windowWidth < 900 ? mobileDrinkPageView() : largeDrinkPageView()
	}

	return (
		<div id="drinkPageContainer" style={{height: 'calc(100% - 64px)', overflow: 'auto'}}>
			{content}
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
		</div>
	)
}

export default DrinkPage
