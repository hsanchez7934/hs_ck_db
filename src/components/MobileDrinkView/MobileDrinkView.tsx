import './styles.css'
import React, {ReactElement} from 'react'
import {DrinkDataPoint} from '../../types'
import generateUUID from '../../uuid'
import {primaryFont} from '../../fonts/fonts'

interface MobileDrinkViewProps {
	drink: DrinkDataPoint
	ingredients: {name: string; amount: string}[]
}

const MobileDrinkView = (props: MobileDrinkViewProps): ReactElement => {
	const {drink, ingredients} = props
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

	return (
		<div style={{height: '100%'}}>
			<div
				style={{
					height: '400px',
					backgroundImage: `url(${drink.strDrinkThumb})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					position: 'relative'
				}}
			>
				<div className="mobileDrinkPageTitleContainer">
					<h1 style={{fontFamily: primaryFont}} className="mobileDrinkPageTitle">
						{drink.strDrink}
					</h1>
				</div>
			</div>
			<div className="mobileDrinkPageBubbleTextContainer">
				<div className="mobileIngredientBubble gradientFilter">
					{renderedBubble('Type', drink.strAlcoholic, {})}
					{renderedBubble('Glass', drink.strGlass, {borderLeft: '1px solid darkgrey'})}
					{renderedBubble('Category', drink.strCategory, {borderLeft: '1px solid darkgrey'})}
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
									<p style={{fontFamily: primaryFont}}>{`${ingredient.amount || ''}`}</p>
									<p style={{fontFamily: primaryFont}}>{`${ingredient.name || ''}`}</p>
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
						{drink.strInstructions}
					</p>
				</div>
			</div>
		</div>
	)
}

export default MobileDrinkView
