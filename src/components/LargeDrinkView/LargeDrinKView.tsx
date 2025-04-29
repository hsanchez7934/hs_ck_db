import './styles.css'
import React from 'react'
import {DrinkDataPoint} from '../../types'
import DrinkTags from '../../components/DrinkTags'
import {primaryFont} from '../../fonts/fonts'

interface LargeDrinkProps {
	ingredients: {name: string; amount: string}[]
	drink: DrinkDataPoint | null
}

const LargeDrinkView = (props: LargeDrinkProps) => {
	const {ingredients, drink} = props

	const renderedIngredientContainers = () => {
		return ingredients.map((ingredient: {name: string; amount: string}, index: number) => {
			return (
				<div className="drinksPageIngredientCard drinksPageIngredientCardFull" key={index}>
					<img
						className="drinksPageIngredientImage"
						alt={ingredient.name}
						title={ingredient.name}
						src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.name}.png`}
					></img>
					<div
						className="drinksPageIngredientsCardTextContainer"
						title={`${ingredient.amount}, ${ingredient.name}`}
					>
						<p style={{margin: 0, fontFamily: primaryFont}}>{ingredient.amount}</p>
						<p style={{margin: 0, fontFamily: primaryFont}}>{ingredient.name}</p>
					</div>
				</div>
			)
		})
	}

	const getDrinkDetailHeader = (label: string, value: string | null) => {
		if (label !== '' || !label) {
			return (
				<div className="drinkDetailHeader">
					<p className="drinkDetailHeaderLabel truncate" style={{fontFamily: primaryFont}}>
						{label}
					</p>
					<p className="drinkDetailHeaderValue truncate" style={{fontFamily: primaryFont}}>
						{value || ''}
					</p>
				</div>
			)
		}
		return <></>
	}

	const renderedDrinkPageComponent = () => {
		const renderedTags =
			drink?.strTags && drink?.strTags.length > 0 ? (
				<DrinkTags tags={drink?.strTags.split(',')} />
			) : (
				<></>
			)
		const drinkGlassTypeHeader = getDrinkDetailHeader('Served in:', drink?.strGlass || '')
		const drinkGategoryHeader = getDrinkDetailHeader('Category:', drink?.strCategory || '')
		const drinkAlcoholicHeader = getDrinkDetailHeader(
			'Alcoholic/Nonalcoholic:',
			drink?.strAlcoholic || ''
		)

		const renderedDrinkDetails = (
			<div className="drinkPageDrinkDetails drinkPageHalf" style={{opacity: 1}}>
				<h1 className="drinkPageDrinkTitle" style={{fontFamily: primaryFont}}>
					{drink?.strDrink}
				</h1>
				{drinkGlassTypeHeader}
				{drinkGategoryHeader}
				{drinkAlcoholicHeader}
				<div className="drinkPageDrinkTagsContainer">{renderedTags}</div>
				<h2
					className="drinkPageIngredientsHeader"
					style={{
						fontFamily: primaryFont
					}}
				>
					Ingredients
				</h2>
				<div className="drinkPageIngredientsContainer">{renderedIngredientContainers()}</div>
				<div>
					<h2
						className="drinkPageInstructionsHeader"
						style={{
							fontFamily: primaryFont
						}}
					>
						Instructions
					</h2>
					<p
						className="drinkPageInstructionsText"
						style={{
							fontFamily: primaryFont
						}}
					>
						{drink?.strInstructions || ''}
					</p>
				</div>
			</div>
		)

		return (
			<main className='drinkPageMainContainer' style={{display: 'flex'}}>
				<div
					className="drinkPageImage drinkPageHalf"
					style={{backgroundImage: `url(${drink?.strDrinkThumb})`}}
				></div>
				{renderedDrinkDetails}
			</main>
		)
	}

	return renderedDrinkPageComponent()
}

export default LargeDrinkView
