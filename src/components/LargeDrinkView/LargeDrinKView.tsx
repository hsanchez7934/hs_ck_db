import './styles.css'
import React, {useEffect, useState} from 'react'
import {DrinkDataPoint} from '../../types'
import DrinkTags from '../../components/DrinkTags'
import {primaryFont} from '../../fonts/fonts'

// import picture from './pexels-splitshire-1526.jpg'
import axios from 'axios'
// import {primary} from '../../colors/colors'

interface LargeDrinkProps {
	ingredients: {name: string; amount: string}[]
	drink: DrinkDataPoint | null
}

interface IngredientDetailsReponse {
	ingredients: [
		{
			idIngredient: string
			strABV: string
			strAlcohol: string
			strDescription: string
			strIngredient: string
			strType: string
		}
	]
}

const spirits = [
	'bourbon',
	'brandy',
	'gin',
	'rum',
	'scotch',
	'tequila',
	'vodka',
	'whiskey',
	'light rum',
	'dark rum'
]

const LargeDrinkView = (props: LargeDrinkProps) => {
	const {ingredients, drink} = props
	const [spiritsDetailDataToRender, setSpiritsDetailDataToRender] = useState([])
	const [relatedSpiritsDrinksDataToRender, setRelatedSpiritsDrinksDataToRender] = useState({})

	const fetchSpiritData = (spirit: string): Promise<IngredientDetailsReponse | undefined> =>
		axios
			.get(
				`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/search.php?i=${spirit}`
			)
			.then((response) => {
				return response.data
			})
			.catch((error) => {
				throw error
			})

	const fetchRelatedSpiritsDrinks = (spirit: string) =>
		axios
			.get(
				`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/filter.php?i=${spirit}`
			)
			.then((response) => {
				// console.log(response)
				return response.data.drinks
			})
			.catch((error) => {
				throw error
			})

	useEffect(() => {
		const ingredientsNameList = ingredients.map(({name}: {name: string}) => name.toLowerCase())
		const includedSpirits: string[] = []
		spirits.forEach((spirit: string) => {
			if (ingredientsNameList.includes(spirit.toLowerCase())) {
				includedSpirits.push(spirit)
			}
		})
		if (includedSpirits.length > 0) {
			Promise.all(includedSpirits.map((spirit: string) => fetchSpiritData(spirit))).then(
				(response) => {
					// @ts-expect-error generic
					setSpiritsDetailDataToRender(response)
				}
			)

			const relatedDrinksMap = {}
			// const response = fetchRelatedSpiritsDrinks('Gin')
			// console.log(response)
			includedSpirits.forEach(async (spirit: string) => {
				fetchRelatedSpiritsDrinks(spirit).then((response) => {
					// @ts-expect-error generic
					relatedDrinksMap[spirit] = response
					setRelatedSpiritsDrinksDataToRender(relatedDrinksMap)
				})
			})
		}
	}, [])

	// console.log(drink)
	// const renderedIngredientContainers = () => {
	// 	return ingredients.map((ingredient: {name: string; amount: string}, index: number) => {
	// 		return (
	// 			<div className="drinksPageIngredientCard drinksPageIngredientCardFull" key={index}>
	// 				<img
	// 					className="drinksPageIngredientImage"
	// 					alt={ingredient.name}
	// 					title={ingredient.name}
	// 					src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.name}.png`}
	// 				></img>
	// 				<div
	// 					className="drinksPageIngredientsCardTextContainer"
	// 					title={`${ingredient.amount}, ${ingredient.name}`}
	// 				>
	// 					<p style={{margin: 0, fontFamily: primaryFont}}>{ingredient.amount}</p>
	// 					<p style={{margin: 0, fontFamily: primaryFont}}>{ingredient.name}</p>
	// 				</div>
	// 			</div>
	// 		)
	// 	})
	// }

	// const getDrinkDetailHeader = (label: string, value: string | null) => {
	// 	if (label !== '' || !label) {
	// 		return (
	// 			<div className="drinkDetailHeader">
	// 				<p className="drinkDetailHeaderLabel truncate" style={{fontFamily: primaryFont}}>
	// 					{label}
	// 				</p>
	// 				<p className="drinkDetailHeaderValue truncate" style={{fontFamily: primaryFont}}>
	// 					{value || ''}
	// 				</p>
	// 			</div>
	// 		)
	// 	}
	// 	return <></>
	// }

	const renderedBubble = (title: string, text: string | null, cssStyling: any) => {
		return (
			<div className="largeIngredientBubbleSection" style={cssStyling}>
				<p style={{fontFamily: primaryFont}} className="largeViewBubbleTitle">
					{title}
				</p>
				<p style={{fontFamily: primaryFont}} className="largeViewBubbleText" title={text || ''}>
					{text}
				</p>
			</div>
		)
	}

	const renderedLargeViewIngredientsListItem = (
		ingredients: {amount: string; name: string}[]
	): JSX.Element => {
		// @ts-expect-error generic
		return ingredients.map((ingredient: {amount: string; name: string}, index: number) => {
			return (
				<div style={{display: 'flex', width: '100%', padding: '20px 30px 20px 0'}} key={index}>
					<div>
						<img
							src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.name}-medium.png`}
						/>
					</div>
					<div style={{width: '40%'}}>
						<p
							style={{
								fontFamily: primaryFont,
								color: 'darkgray',
								fontSize: '1.6em',
								borderBottom: '1px solid darkgrey',
								margin: '20px 0 0 0'
							}}
						>
							Ingredient
						</p>
						<p style={{fontFamily: primaryFont, color: 'aqua', fontSize: '1.6em'}}>
							{ingredient.name}
						</p>
					</div>
					<div style={{width: '40%'}}>
						<p
							style={{
								fontFamily: primaryFont,
								color: 'darkgray',
								fontSize: '1.6em',
								textAlign: 'right',
								borderBottom: '1px solid darkgrey',
								margin: '20px 0 0 0'
							}}
						>
							Amount
						</p>
						<p
							style={{
								fontFamily: primaryFont,
								color: 'aqua',
								fontSize: '1.6em',
								textAlign: 'right'
							}}
						>
							{ingredient.amount}
						</p>
					</div>
				</div>
			)
		})
	}

	const renderedRelatedDrinks = (strIngredient: string) => {
		// @ts-expect-error generic
		if (relatedSpiritsDrinksDataToRender[strIngredient.toLowerCase()]) {
			// @ts-expect-error generic
			return relatedSpiritsDrinksDataToRender[strIngredient.toLowerCase()].map((drink) => {
				return (
					<img
						src={drink.strDrinkThumb}
						style={{height: '100%', width: 'auto'}}
						key={drink.idDrink}
					/>
				)
			})
		}
	}

	const renderedSpiritDetails = () => {
		return spiritsDetailDataToRender.length === 0 ? (
			<></>
		) : (
			spiritsDetailDataToRender.map((ingredientData: IngredientDetailsReponse) => {
				const [ingredientDatum] = ingredientData.ingredients
				const {idIngredient, strIngredient, strDescription, strABV} = ingredientDatum

				return (
					<div
						style={{
							height: 'auto',
							padding: '20px'
						}}
						key={idIngredient}
					>
						<h2
							style={{
								fontFamily: primaryFont,
								margin: 0,
								color: 'white',
								fontSize: '3.3em',
								backgroundColor: '#000',
								padding: '30px 30px 0px 30px',
								borderTopRightRadius: '12px',
								borderTopLeftRadius: '12px'
							}}
						>
							This drink contains {strIngredient}
						</h2>
						<div
							style={{
								height: 'auto',
								backgroundColor: '#000',
								padding: '20px 20px 50px 20px',
								borderBottomRightRadius: '12px',
								borderBottomLeftRadius: '12px'
							}}
						>
							<div style={{display: 'flex'}}>
								<div style={{height: '100%', width: '20%'}}>
									<img
										src={`https://www.thecocktaildb.com/images/ingredients/${strIngredient}-medium.png`}
										className='relatedDrinksImage'
									/>
								</div>
								<div style={{height: '100%', width: '80%'}}>
									<h3 style={{color: 'white', fontFamily: primaryFont, margin: 0}}>
										Drinks that contain {strIngredient}
									</h3>
									<div
										style={{
											backgroundColor: 'red',
											height: '300px',
											overflowX: 'scroll',
											display: 'flex',
											border: '5px solid aqua',
											borderRadius: '12px'
										}}
									>
										{renderedRelatedDrinks(strIngredient)}
									</div>
								</div>
							</div>
							<p
								style={{
									fontFamily: primaryFont,
									color: 'white',
									fontSize: '1.6em',
									margin: 0,
									padding: '0px 10px'
								}}
							>
								{strDescription}
							</p>s
						</div>
					</div>
				)
			})
		)
	}

	const renderedDrinkPageComponent = () => {
		const renderedTags =
			drink?.strTags && drink?.strTags.length > 0 ? (
				<DrinkTags tags={drink?.strTags.split(',')} />
			) : (
				<></>
			)

		return (
			<main className="drinkPageMainContainer">
				<div className="drinkPageMainContainerHeader">
					<div className="drinkPageHeaderDetailsContainer" style={{width: '50%'}}>
						<div style={{height: 'auto', width: '100%'}}>
							<div style={{}}>
								<h1 style={{fontFamily: primaryFont}}>{drink?.strDrink}</h1>
							</div>
							<div>
								<div className="mainPageBubble" style={{height: '80px'}}>
									{renderedBubble('Type', drink?.strAlcoholic || '', {})}
									{renderedBubble('Glass', drink?.strGlass || '', {
										borderLeft: '1px solid darkgrey'
									})}
									{renderedBubble('Category', drink?.strCategory || '', {
										borderLeft: '1px solid darkgrey'
									})}
								</div>
								<div style={{display: 'flex', justifyContent: 'center'}}>{renderedTags}</div>
							</div>
						</div>
					</div>
					<div className="drinkPageImageContainer" style={{width: '50%'}}>
						<img src={`${drink?.strDrinkThumb}?&fit=crop&auto=format&dpr=2 2x`} />
					</div>
				</div>

				<div style={{height: 'auto', padding: '20px'}}>
					<h2
						style={{
							fontFamily: primaryFont,
							margin: 0,
							color: 'white',
							fontSize: '3.3em',
							backgroundColor: '#000',
							padding: '30px',
							borderTopLeftRadius: '20px',
							borderTopRightRadius: '20px'
						}}
					>
						Ingredients
					</h2>
					<div
						style={{
							height: 'auto',
							backgroundColor: '#000',
							padding: '20px',
							borderBottomLeftRadius: '20px',
							borderBottomRightRadius: '20px'
						}}
					>
						{renderedLargeViewIngredientsListItem(ingredients)}
					</div>
				</div>

				<div style={{height: 'auto', padding: '20px'}}>
					<h2
						style={{
							fontFamily: primaryFont,
							margin: 0,
							color: 'white',
							fontSize: '3.3em',
							backgroundColor: '#000',
							padding: '30px 30px 0px 30px',
							borderTopRightRadius: '12px',
							borderTopLeftRadius: '12px'
						}}
					>
						Instructions
					</h2>
					<div
						style={{
							height: 'auto',
							backgroundColor: '#000',
							padding: '20px 20px 50px 20px',
							borderBottomRightRadius: '12px',
							borderBottomLeftRadius: '12px'
						}}
					>
						<p
							style={{
								fontFamily: primaryFont,
								color: 'white',
								fontSize: '1.6em',
								margin: 0,
								padding: '0px 10px'
							}}
						>
							{drink?.strInstructions}
						</p>
					</div>
				</div>
				{renderedSpiritDetails()}
			</main>
		)
	}

	return renderedDrinkPageComponent()
}

export default LargeDrinkView
