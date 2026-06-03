import './styles.css'
import React, {ReactElement} from 'react'
import {DrinkDataPoint} from '../../types'
import {Link} from 'react-router-dom'
import generateUUID from '../../uuid'
import {useAppDispatch} from '../../store/hooks'
import {updateUseSavedScrollTop} from '../../store'
import SectionHeading from '../SectionHeading/SectionHeading'
import {FaVideo, FaShare, FaHeartCircleMinus, FaHeartCirclePlus, FaAngleLeft} from 'react-icons/fa6'

interface MobileDrinkViewProps {
	drink: DrinkDataPoint | null
	ingredients: {name: string; amount: string}[]
	prevPath: string
	handleSaveOnClick: (drink: any) => void
	handleShareOnClick: (drink: any) => void
	handleViewOnClick: (drink: any) => void
	toggleSaved: boolean
}

const MobileDrinkView = (props: MobileDrinkViewProps): ReactElement => {
	const {
		drink,
		ingredients,
		prevPath,
		handleSaveOnClick,
		handleViewOnClick,
		handleShareOnClick,
		toggleSaved
	} = props

	const dispatch = useAppDispatch()
	const backPath = prevPath || '/'

	const handleUpdateUseSavedScrollTop = () => {
		dispatch(updateUseSavedScrollTop(true))
	}

	const metaItems = [
		{label: 'Type', value: drink?.strAlcoholic},
		{label: 'Glass', value: drink?.strGlass},
		{label: 'Category', value: drink?.strCategory}
	]

	return (
		<div className="mobile-drink-page">
			<header className="mobile-drink-page-hero">
				<img
					className="mobile-drink-page-hero-image"
					src={drink?.strDrinkThumb || ''}
					alt={drink?.strDrink || 'Cocktail'}
				/>
				<div className="mobile-drink-page-hero-scrim" aria-hidden="true" />

				<div className="mobile-drink-page-hero-actions">
					<Link
						to={backPath}
						className="mobile-drink-page-action-btn"
						aria-label="Go back"
						onClick={handleUpdateUseSavedScrollTop}
					>
						<FaAngleLeft className="mobile-drink-page-action-icon" />
					</Link>
					<div className="mobile-drink-page-hero-actions-right">
						<button
							type="button"
							className="mobile-drink-page-action-btn"
							aria-label={toggleSaved ? 'Remove from saved drinks' : 'Save drink'}
							onClick={() => handleSaveOnClick(drink)}
						>
							{toggleSaved ? (
								<FaHeartCircleMinus className="mobile-drink-page-action-icon mobile-drink-page-action-icon--saved" />
							) : (
								<FaHeartCirclePlus className="mobile-drink-page-action-icon" />
							)}
						</button>
						<button
							type="button"
							className="mobile-drink-page-action-btn"
							aria-label="Copy shareable link"
							onClick={() => drink && handleShareOnClick(drink.idDrink)}
						>
							<FaShare className="mobile-drink-page-action-icon" />
						</button>
						{drink?.strVideo && (
							<button
								type="button"
								className="mobile-drink-page-action-btn"
								aria-label="Watch instruction video"
								onClick={() => handleViewOnClick(drink.strVideo)}
							>
								<FaVideo className="mobile-drink-page-action-icon" />
							</button>
						)}
					</div>
				</div>

				<div className="mobile-drink-page-hero-title">
					<div className="mobile-drink-page-title-wrap">
						<span className="mobile-drink-page-title-accent" aria-hidden="true" />
						<h1 className="mobile-drink-page-title">{drink?.strDrink}</h1>
					</div>
				</div>
			</header>

			<section className="mobile-drink-page-body">
				<div className="mobile-drink-page-meta glass-panel">
					{metaItems.map((item) => (
						<div key={item.label} className="mobile-drink-page-meta-item">
							<span className="mobile-drink-page-meta-label">{item.label}</span>
							<span className="mobile-drink-page-meta-value truncate" title={item.value || ''}>
								{item.value || '—'}
							</span>
						</div>
					))}
				</div>

				<section className="mobile-drink-page-block">
					<SectionHeading title="Ingredients" />
					<ul className="mobile-drink-page-ingredient-list">
						{ingredients.map((ingredient) => (
							<li key={generateUUID()} className="mobile-drink-page-ingredient-card glass-panel">
								<div className="mobile-drink-page-ingredient-thumb">
									<img
										src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.name}-small.png`}
										alt=""
										loading="lazy"
									/>
								</div>
								<div className="mobile-drink-page-ingredient-copy">
									<p className="mobile-drink-page-ingredient-name">{ingredient.name || '—'}</p>
									<p className="mobile-drink-page-ingredient-amount">
										{ingredient.amount || 'To your liking'}
									</p>
								</div>
							</li>
						))}
					</ul>
				</section>

				{drink?.strInstructions && (
					<section className="mobile-drink-page-block mobile-drink-page-block--last">
						<SectionHeading title="Instructions" />
						<div className="mobile-drink-page-instructions glass-panel">
							<p className="mobile-drink-page-instructions-text">{drink.strInstructions}</p>
						</div>
					</section>
				)}
			</section>
		</div>
	)
}

export default MobileDrinkView
