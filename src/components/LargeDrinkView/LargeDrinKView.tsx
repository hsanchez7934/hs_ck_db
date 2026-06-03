import './styles.css'
import React, {ReactElement} from 'react'
import {DrinkDataPoint} from '../../types'
import DrinkTags from '../DrinkTags'
import SectionHeading from '../SectionHeading/SectionHeading'
import DrinkCardActionButton from '../DrinkCard/DrinkCardActionButton'
import '../DrinkCard/styles.css'
import {FaVideo, FaShare, FaHeartCircleMinus, FaHeartCirclePlus} from 'react-icons/fa6'

interface LargeDrinkProps {
	ingredients: {name: string; amount: string}[]
	drink: DrinkDataPoint | null
	handleSaveOnClick: (drink: any) => void
	handleShareOnClick: (drink: any) => void
	handleViewOnClick: (drink: any) => void
	toggleSaved: boolean
}

const LargeDrinkView = (props: LargeDrinkProps): ReactElement => {
	const {
		ingredients,
		drink,
		toggleSaved,
		handleSaveOnClick,
		handleShareOnClick,
		handleViewOnClick
	} = props

	const tags = drink?.strTags?.split(',').map((t) => t.trim()).filter(Boolean) ?? []

	const metaItems = [
		{label: 'Type', value: drink?.strAlcoholic},
		{label: 'Glass', value: drink?.strGlass},
		{label: 'Category', value: drink?.strCategory}
	]

	return (
		<main className="large-drink-page">
			<header className="large-drink-page-hero">
				<div className="large-drink-page-hero-copy">
					<div className="large-drink-page-title-wrap">
						<span className="large-drink-page-title-accent" aria-hidden="true" />
						<h1 className="large-drink-page-title">{drink?.strDrink}</h1>
					</div>

					<div className="large-drink-page-meta glass-panel">
						{metaItems.map((item) => (
							<div key={item.label} className="large-drink-page-meta-item">
								<span className="large-drink-page-meta-label">{item.label}</span>
								<span className="large-drink-page-meta-value truncate" title={item.value || ''}>
									{item.value || '—'}
								</span>
							</div>
						))}
					</div>

					{tags.length > 0 && (
						<div className="large-drink-page-tags">
							<DrinkTags tags={tags} />
						</div>
					)}

					<div className="large-drink-page-actions">
						<DrinkCardActionButton
							label={toggleSaved ? 'Remove from saved drinks' : 'Save drink'}
							onClick={() => handleSaveOnClick(drink)}
							active={toggleSaved}
						>
							{toggleSaved ? (
								<FaHeartCircleMinus className="large-drink-page-action-icon large-drink-page-action-icon--saved" />
							) : (
								<FaHeartCirclePlus className="large-drink-page-action-icon" />
							)}
						</DrinkCardActionButton>
						<DrinkCardActionButton
							label="Copy shareable link"
							onClick={() => drink && handleShareOnClick(drink.idDrink)}
						>
							<FaShare className="large-drink-page-action-icon" />
						</DrinkCardActionButton>
						{drink?.strVideo && (
							<DrinkCardActionButton
								label="Watch instruction video"
								onClick={() => handleViewOnClick(drink.strVideo)}
							>
								<FaVideo className="large-drink-page-action-icon" />
							</DrinkCardActionButton>
						)}
					</div>
				</div>

				<div className="large-drink-page-hero-media glass-panel">
					<img
						className="large-drink-page-hero-image"
						src={`${drink?.strDrinkThumb}?w=720&fit=crop&auto=format`}
						alt={drink?.strDrink || 'Cocktail'}
					/>
				</div>
			</header>

			<div className="large-drink-page-content">
				<section className="large-drink-page-block">
					<SectionHeading title="Ingredients" />
					<ul className="large-drink-page-ingredient-grid">
						{ingredients.map((ingredient, index) => (
							<li
								key={`${ingredient.name}-${index}`}
								className="large-drink-page-ingredient-card glass-panel"
							>
								<div className="large-drink-page-ingredient-thumb">
									<img
										src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.name}-small.png`}
										alt=""
										loading="lazy"
									/>
								</div>
								<div className="large-drink-page-ingredient-copy">
									<p className="large-drink-page-ingredient-name">{ingredient.name || '—'}</p>
									<p className="large-drink-page-ingredient-amount">
										{ingredient.amount || 'To your liking'}
									</p>
								</div>
							</li>
						))}
					</ul>
				</section>

				{drink?.strInstructions && (
					<section className="large-drink-page-block">
						<SectionHeading title="Instructions" />
						<div className="large-drink-page-instructions glass-panel">
							<p className="large-drink-page-instructions-text">{drink.strInstructions}</p>
						</div>
					</section>
				)}
			</div>
		</main>
	)
}

export default LargeDrinkView
