import './styles.css'
import React, {useEffect, useMemo, useState} from 'react'
import {DrinkDataPoint} from '../../types'
import DrinkTags from '../DrinkTags'
import SimpleDialog from '../SimpleDialog/SimpleDialog'
import DrinkCardActionButton from './DrinkCardActionButton'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import {generatePath} from 'react-router-dom'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import useSaveDrink from '../../hooks/useSaveDrink'
import {updateModalDrink} from '../../store'
import {GiMartini} from 'react-icons/gi'
import {
	FaVideo,
	FaShare,
	FaHeartCircleMinus,
	FaHeartCirclePlus,
	FaCircleArrowLeft,
	FaCircleArrowRight,
	FaEye,
	FaXmark
} from 'react-icons/fa6'

type Props = {drink: DrinkDataPoint | null, handleClose: () => void}

type IngredientRow = {
	id: string
	name: string
	amount: string
}

const DrinkCard = ({drink, handleClose}: Props): JSX.Element | null => {
	const [shareDialogOpen, setShareDialogOpen] = useState(false)
	const [shareDialogColor, setShareDialogColor] = useState('')
	const [shareDialogText, setShareDialogText] = useState('')
	const [toggleSaved, setToggleSaved] = useState(false)

	const dispatch = useAppDispatch()
	const {drinkPagerMap} = useAppSelector(({drinkPagerMapState}) => drinkPagerMapState)
	const {
		dialogState,
		isDrinkSaved,
		toggleSaveDrink,
		toggleLoginDialog,
		setToggleLoginDialog
	} = useSaveDrink()

	useEffect(() => {
		setToggleSaved(Boolean(isDrinkSaved(drink?.idDrink)))
	}, [drink?.idDrink, drinkPagerMap, isDrinkSaved])

	const ingredients = useMemo((): IngredientRow[] => {
		if (!drink) {
			return []
		}

		const rows: IngredientRow[] = []
		let counter = 1

		while (drink[`strIngredient${counter}` as keyof DrinkDataPoint]) {
			rows.push({
				id: `${drink.idDrink}-${counter}`,
				name: String(drink[`strIngredient${counter}` as keyof DrinkDataPoint] || ''),
				amount: String(drink[`strMeasure${counter}` as keyof DrinkDataPoint] || '')
			})
			counter += 1
		}

		return rows
	}, [drink])

	const tags = useMemo(() => {
		if (!drink?.strTags) {
			return []
		}
		return drink.strTags.split(',').map((tag) => tag.trim()).filter(Boolean)
	}, [drink?.strTags])

	const toggleShareDialog = (color: string, text: string) => {
		setShareDialogColor(color)
		setShareDialogText(text)
		setShareDialogOpen(true)
		setTimeout(() => {
			setShareDialogOpen(false)
		}, 1500)
	}

	const handleOpenDetailedView = (drinkID: string | null | undefined) => {
		if (!drinkID) {
			return
		}

		const path =
			process.env.NODE_ENV === 'production'
				? generatePath('/drink/:id', {id: drinkID})
				: generatePath(`localhost:3000/drink/:id`, {id: drinkID})

		window.open(path, '_blank')
	}

	const handleShareOnClick = async (drinkID: string | null): Promise<void> => {
		if (!drinkID) {
			return
		}

		const path = generatePath(`${window.location.origin}/drink/:id`, {id: drinkID})
		window.navigator.clipboard.writeText(path).then(
			() => toggleShareDialog('green', 'Link copied to clipboard!'),
			() => toggleShareDialog('red', 'Oops, something went wrong! Please try again.')
		)
	}

	const handleViewOnClick = (url: string | null) => {
		if (url) {
			window.open(url)?.focus()
		}
	}

	const handleSaveOnClick = (selectedDrink: DrinkDataPoint | null) => {
		if (!selectedDrink) {
			return
		}

		toggleSaveDrink(selectedDrink, {
			isCurrentlySaved: toggleSaved,
			onSavedChange: setToggleSaved
		})
	}

	const handlePager = async (selectedDrink: DrinkDataPoint, direction: 'left' | 'right') => {
		const {drinkMapID} = selectedDrink
		if (drinkMapID === undefined) {
			return
		}

		const node = drinkPagerMap[drinkMapID]
		const data = direction === 'left' ? node?.previous : node?.next

		if (!data) {
			return
		}

		let nextDrink = data
		if (!nextDrink.strInstructions) {
			const response = await fetchDrinkDataByID(nextDrink)
			nextDrink = {...response, drinkMapID: nextDrink.drinkMapID}
		}

		dispatch(updateModalDrink(nextDrink))

		const currentUrl = window.location.href
		const split = currentUrl.split('/')
		split[split.length - 1] = nextDrink.idDrink
		window.history.replaceState(null, '', split.join('/'))
	}

	const hasPrevious = Boolean(
		drink?.drinkMapID &&
			drinkPagerMap[drink.drinkMapID] &&
			drinkPagerMap[drink.drinkMapID].previous !== null
	)
	const hasNext = Boolean(
		drink?.drinkMapID &&
			drinkPagerMap[drink.drinkMapID] &&
			drinkPagerMap[drink.drinkMapID].next !== null
	)

	if (!drink) {
		return null
	}

	return (
		<article className="drink-card">
			<div className="drink-card-layout">
				<div className="drink-card-media-panel">
					{drink.strDrinkThumb ? (
						<img
							className="drink-card-media"
							src={drink.strDrinkThumb}
							alt={drink.strDrink || 'Cocktail image'}
							loading="lazy"
						/>
					) : (
						<div className="drink-card-media-fallback" aria-hidden="true">
							<GiMartini />
						</div>
					)}
					<div className="drink-card-media-gradient" aria-hidden="true" />
				</div>

				<div className="drink-card-content">
					<header className="drink-card-header">
						<div className="drink-card-heading">
							<p className="drink-card-eyebrow">Cocktail Details</p>
							<h2 className="drink-card-title" id="drinkCardTitle" title={drink.strDrink || ''}>
								{drink.strDrink}
							</h2>
						</div>
						{drink.strGlass && (
							<span className="drink-card-glass-badge">
								<GiMartini className="drink-card-glass-icon" aria-hidden="true" />
								{drink.strGlass}
							</span>
						)}
					</header>

					<div className="drink-card-scroll">
						<div className="drink-card-sections">
							<section className="drink-card-section" aria-labelledby="drink-card-ingredients-heading">
								<h3 className="drink-card-section-title" id="drink-card-ingredients-heading">
									Ingredients
								</h3>
								<ul className="drink-card-ingredient-list">
									{ingredients.map(({id, name, amount}) => (
										<li key={id} className="drink-card-ingredient-row">
											<span className="drink-card-ingredient-name">{name}</span>
											<span className="drink-card-ingredient-amount">{amount || '—'}</span>
										</li>
									))}
								</ul>
							</section>

							<section className="drink-card-section" aria-labelledby="drink-card-instructions-heading">
								<h3 className="drink-card-section-title" id="drink-card-instructions-heading">
									Instructions
								</h3>
								<p className="drink-card-instructions">{drink.strInstructions}</p>
								{tags.length > 0 && (
									<div className="drink-card-tags">
										<DrinkTags tags={tags} />
									</div>
								)}
							</section>
						</div>
					</div>

					<footer className="drink-card-actions">
						<div className="drink-card-actions-group" aria-label="Drink navigation">
							<DrinkCardActionButton
								label="Previous drink"
								disabled={!hasPrevious}
								onClick={() => {
									if (hasPrevious) {
										handlePager(drink, 'left')
									}
								}}
							>
								<FaCircleArrowLeft className="drink-card-action-icon" />
							</DrinkCardActionButton>
							<DrinkCardActionButton
								label="Next drink"
								disabled={!hasNext}
								onClick={() => {
									if (hasNext) {
										handlePager(drink, 'right')
									}
								}}
							>
								<FaCircleArrowRight className="drink-card-action-icon" />
							</DrinkCardActionButton>
						</div>
						<div className="drink-card-actions-group" aria-label="Drink actions">
							<DrinkCardActionButton
								label={toggleSaved ? 'Remove from favorites' : 'Save to favorites'}
								active={toggleSaved}
								onClick={() => handleSaveOnClick(drink)}
							>
								{toggleSaved ? (
									<FaHeartCirclePlus className="drink-card-action-icon drink-card-action-icon--saved" />
								) : (
									<FaHeartCircleMinus className="drink-card-action-icon" />
								)}
							</DrinkCardActionButton>
							<DrinkCardActionButton
								label="Copy shareable link to clipboard"
								onClick={() => handleShareOnClick(drink.idDrink)}
							>
								<FaShare className="drink-card-action-icon" />
							</DrinkCardActionButton>
							<DrinkCardActionButton
								label="Open drink detailed view in new browser tab"
								onClick={() => handleOpenDetailedView(drink.idDrink)}
							>
								<FaEye className="drink-card-action-icon" />
							</DrinkCardActionButton>
							{drink.strVideo && (
								<DrinkCardActionButton
									label="Open drink instruction video"
									onClick={() => handleViewOnClick(drink.strVideo)}
								>
									<FaVideo className="drink-card-action-icon" />
								</DrinkCardActionButton>
							)}
						</div>
					</footer>
				</div>
			</div>

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
			{toggleLoginDialog && (
				<SimpleDialog
					open={toggleLoginDialog}
					isLoginDialog={true}
					onLoginDialogClose={() => setToggleLoginDialog(false)}
				/>
			)}
		</article>
	)
}

export default DrinkCard
