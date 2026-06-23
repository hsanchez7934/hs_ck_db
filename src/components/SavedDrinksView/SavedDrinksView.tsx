import './styles.css'
import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import {motion, useReducedMotion} from 'framer-motion'
import {
	FaHeart,
	FaCircleCheck,
	FaCircleExclamation,
	FaMagnifyingGlass
} from 'react-icons/fa6'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import SavedDrinkListItem from './SavedDrinkListItem'
import {DrinkDataPoint} from '../../types'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import {useAppDispatch} from '../../store/hooks'
import {updateDrinkMap, updateIsModalOpen, updateModalDrink} from '../../store'
import {fadeInUp} from '../../theme/motion'

type Props = {
	isLoading: boolean
	isAuthenticated: boolean
	savedDrinks: DrinkDataPoint[]
	userName?: string | null
	onSignIn: () => void
}

const SavedDrinksView = ({
	isLoading,
	isAuthenticated,
	savedDrinks,
	userName,
	onSignIn
}: Props): JSX.Element => {
	const dispatch = useAppDispatch()
	const shouldReduceMotion = useReducedMotion()
	const savedCount = isAuthenticated ? savedDrinks.length : 0

	useEffect(() => {
		if (!isAuthenticated || savedDrinks.length === 0) {
			return
		}

		const map: Record<
			string,
			{data: DrinkDataPoint; previous: DrinkDataPoint | null; next: DrinkDataPoint | null}
		> = {}

		savedDrinks.forEach((drink, index) => {
			if (!drink.drinkMapID) {
				return
			}

			map[drink.drinkMapID] = {
				data: drink,
				previous: index > 0 ? savedDrinks[index - 1] : null,
				next: index < savedDrinks.length - 1 ? savedDrinks[index + 1] : null
			}
		})

		dispatch(updateDrinkMap(map))
	}, [dispatch, isAuthenticated, savedDrinks])

	const handleDrinkSelect = async (drink: DrinkDataPoint) => {
		let selectedDrink = drink

		if (!drink.strInstructions) {
			const response = await fetchDrinkDataByID(drink)
			selectedDrink = {...response, drinkMapID: drink.drinkMapID}
		}

		dispatch(updateIsModalOpen(true))
		dispatch(updateModalDrink(selectedDrink))
	}

	const countLabel = savedCount === 1 ? 'cocktail saved' : 'cocktails saved'

	const header = (
		<header className="saved-drinks-header">
			<div className="saved-drinks-header-copy">
				<p className="saved-drinks-eyebrow">Your Collection</p>
				<h1 className="saved-drinks-title">Saved Drinks</h1>
				<p className="saved-drinks-lead">
					{isAuthenticated
						? 'Revisit the cocktails you have bookmarked across the app.'
						: 'Sign in to sync and manage your personal cocktail collection.'}
				</p>
			</div>
			<div className="saved-drinks-stats">
				<div className="saved-drinks-stat-card">
					<span className="saved-drinks-stat-value">
						{isLoading ? '—' : savedCount}
					</span>
					<span className="saved-drinks-stat-label">{countLabel}</span>
				</div>
				<div
					className={`saved-drinks-status-card${
						isAuthenticated
							? ' saved-drinks-status-card--signed-in'
							: ' saved-drinks-status-card--signed-out'
					}`}
				>
					<span className="saved-drinks-status-icon" aria-hidden="true">
						{isAuthenticated ? <FaCircleCheck /> : <FaCircleExclamation />}
					</span>
					<div className="saved-drinks-status-copy">
						<span className="saved-drinks-status-label">Account status</span>
						<span className="saved-drinks-status-value">
							{isAuthenticated
								? userName
									? `Signed in as ${userName}`
									: 'Signed in'
								: 'Not signed in'}
						</span>
					</div>
				</div>
			</div>
		</header>
	)

	const renderBody = () => {
		if (isLoading) {
			return (
				<div className="saved-drinks-loading">
					<LoadingSpinner />
				</div>
			)
		}

		if (!isAuthenticated) {
			return (
				<section className="saved-drinks-sign-in-panel" aria-labelledby="saved-drinks-sign-in-heading">
					<div className="saved-drinks-sign-in-icon" aria-hidden="true">
						<FaHeart />
					</div>
					<h2 className="saved-drinks-sign-in-title" id="saved-drinks-sign-in-heading">
						Sign in to view your saved drinks
					</h2>
					<p className="saved-drinks-sign-in-text">
						Create an account or sign in to save cocktails as you browse, then return here
						anytime to pick up where you left off.
					</p>
					<button
						type="button"
						id="btn_loginFromSavedDrinksPage"
						className="saved-drinks-sign-in-button"
						onClick={onSignIn}
					>
						Sign in
					</button>
				</section>
			)
		}

		if (savedDrinks.length === 0) {
			return (
				<section className="saved-drinks-empty" aria-labelledby="saved-drinks-empty-heading">
					<div className="saved-drinks-empty-icon" aria-hidden="true">
						<FaHeart />
					</div>
					<h2 className="saved-drinks-empty-title" id="saved-drinks-empty-heading">
						No saved drinks yet
					</h2>
					<p className="saved-drinks-empty-text">
						Browse the catalog and tap the heart on any cocktail to add it to your collection.
					</p>
					<Link to="/search/byname" className="saved-drinks-empty-link">
						<FaMagnifyingGlass aria-hidden="true" />
						Start exploring
					</Link>
				</section>
			)
		}

		return (
			<section className="saved-drinks-list-section" aria-labelledby="saved-drinks-list-heading">
				<div className="saved-drinks-list-header">
					<h2 className="saved-drinks-list-title" id="saved-drinks-list-heading">
						Your saved cocktails
					</h2>
					<p className="saved-drinks-list-subtitle">
						Select a drink to open ingredients and instructions.
					</p>
				</div>
				<ul className="saved-drinks-list">
					{savedDrinks.map((drink, index) => (
						<li key={drink.drinkMapID || drink.idDrink} className="saved-drinks-list-item">
							<SavedDrinkListItem
								drink={drink}
								index={index}
								onSelect={handleDrinkSelect}
							/>
						</li>
					))}
				</ul>
			</section>
		)
	}

	const content = (
		<div className="saved-drinks-view">
			{header}
			{renderBody()}
		</div>
	)

	if (shouldReduceMotion) {
		return content
	}

	return (
		<motion.div
			variants={fadeInUp}
			initial="hidden"
			animate="visible"
			transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
			style={{height: '100%'}}
		>
			{content}
		</motion.div>
	)
}

export default SavedDrinksView
