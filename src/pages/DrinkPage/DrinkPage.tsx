import React, {useEffect, useState} from 'react'
import LargeDrinkView from '../../components/LargeDrinkView/LargeDrinKView'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import MobileDrinkView from '../../components/MobileDrinkView/MobileDrinkView'
import NoDrinkDataNotice from '../../components/NoDrinkData'
import PageContainer from '../../components/layout/PageContainer'
import SimpleDialog from '../../components/SimpleDialog/SimpleDialog'
import useSaveDrink from '../../hooks/useSaveDrink'

import {useFetchDrinkDataByIDQuery} from '../../store'
import {useParams, useLocation, generatePath} from 'react-router-dom'

const DrinkPage = (): JSX.Element => {
	const location = useLocation()
	const {id} = useParams<'id'>()
	const {data, error, isFetching} = useFetchDrinkDataByIDQuery(id)
	const drinkDataToRender = data?.drinks[0] || {}

	let counter = 1
	const ingredients: {name: string; amount: string}[] = []
	if (drinkDataToRender) {
		while (drinkDataToRender[`strIngredient${counter}`]) {
			ingredients.push({
				name: drinkDataToRender[`strIngredient${counter}`],
				amount: drinkDataToRender[`strMeasure${counter}`]
			})
			counter = counter + 1
		}
	}

	const {
		toggleLoginDialog,
		setToggleLoginDialog,
		dialogState,
		isDrinkSaved,
		toggleSaveDrink
	} = useSaveDrink()

	const [toggleSaved, setToggleSaved] = useState(false)
	const [shareDialogOpen, setShareDialogOpen] = useState(false)
	const [shareDialogColor, setShareDialogColor] = useState('')
	const [shareDialogText, setShareDialogText] = useState('')
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)

	useEffect(() => {
		setToggleSaved(isDrinkSaved(drinkDataToRender?.idDrink))
	}, [drinkDataToRender?.idDrink, isDrinkSaved])

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

	const toggleShareDialog = (color: string, text: string) => {
		setShareDialogColor(color)
		setShareDialogText(text)
		setShareDialogOpen(true)
		setTimeout(() => {
			setShareDialogOpen(false)
		}, 1500)
	}

	const handleShareOnClick = async (drinkID: string | null): Promise<void> => {
		const path = generatePath(`${window.location.origin}/drink/:id`, {id: drinkID})
		window.navigator.clipboard.writeText(path).then(
			() => {
				toggleShareDialog('green', 'Link copied to clipboard!')
			},
			() => {
				toggleShareDialog('red', 'Oops, something went wrong! Please try again.')
			}
		)
	}

	const handleViewOnClick = (url: string | null) => {
		if (url) {
			window.open(url)?.focus()
		}
	}

	const handleSaveOnClick = (drink: typeof drinkDataToRender) => {
		toggleSaveDrink(drink, {
			isCurrentlySaved: toggleSaved,
			onSavedChange: setToggleSaved
		})
	}

	const mobileDrinkPageView = () => {
		return (
			<MobileDrinkView
				ingredients={ingredients}
				drink={drinkDataToRender}
				prevPath={location.state?.mobileStatePrevPath}
				handleSaveOnClick={handleSaveOnClick}
				handleShareOnClick={handleShareOnClick}
				handleViewOnClick={handleViewOnClick}
				toggleSaved={toggleSaved}
			/>
		)
	}

	const largeDrinkPageView = () => {
		return (
			<LargeDrinkView
				ingredients={ingredients}
				drink={drinkDataToRender}
				handleSaveOnClick={handleSaveOnClick}
				handleShareOnClick={handleShareOnClick}
				handleViewOnClick={handleViewOnClick}
				toggleSaved={toggleSaved}
			/>
		)
	}

	let content = <LoadingSpinner />
	if (isFetching) {
		content = <LoadingSpinner />
	} else if (error) {
		return (
			<PageContainer>
				<NoDrinkDataNotice isErrorMessage={true} />
			</PageContainer>
		)
	} else {
		content = windowWidth < 640 ? mobileDrinkPageView() : largeDrinkPageView()
	}

	return (
		<PageContainer className="drink-page-container" id="drinkPageContainer">
			{content}
			<SimpleDialog
				open={dialogState.open}
				dialogTextColor={dialogState.color}
				dialogText={dialogState.text}
				isLoginDialog={false}
			/>
			<SimpleDialog
				open={shareDialogOpen}
				dialogTextColor={shareDialogColor}
				dialogText={shareDialogText}
				isLoginDialog={false}
			/>
			<SimpleDialog
				open={toggleLoginDialog}
				isLoginDialog={true}
				onLoginDialogClose={() => setToggleLoginDialog(false)}
			/>
		</PageContainer>
	)
}

export default DrinkPage
