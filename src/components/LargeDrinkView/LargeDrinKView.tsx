import './styles.css'
import React, {useEffect, useState} from 'react'
import {DrinkDataPoint} from '../../types'
import DrinkTags from '../../components/DrinkTags'
import {primaryFont} from '../../fonts/fonts'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {ImageListItem, ImageList, Button} from '@mui/material'
import {FaVideo, FaShare, FaHeartCircleMinus, FaHeartCirclePlus} from 'react-icons/fa6'
// import LargeViewDetailedIngredients from '../LargeViewDetailedIngredients/LargeViewDetailedIngredients'

interface LargeDrinkProps {
	ingredients: {name: string; amount: string}[]
	drink: DrinkDataPoint | null
	handleSaveOnClick: (drink: any) => void
	handleShareOnClick: (drink: any) => void
	handleViewOnClick: (drink: any) => void
	toggleSaved: boolean
}

// interface IngredientDetailsReponse {
// 	idIngredient: string
// 	strABV: string
// 	strAlcohol: string
// 	strDescription: string
// 	strIngredient: string
// 	strType: string
// }

// const iconStyles = {
// 	fontSize: '40px'
// }

const iconClasses = 'h-9 w-9 lg:h-12 lg:w-12 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16'

const LargeDrinkView = (props: LargeDrinkProps) => {
	const {
		ingredients,
		drink,
		toggleSaved,
		handleSaveOnClick,
		handleShareOnClick,
		handleViewOnClick
	} = props
	// const [ingredientsDetailedDataToRender, setIngredientsDetailedDataToRender] = useState([])
	// const [relatedSpiritsDrinksDataToRender, setRelatedSpiritsDrinksDataToRender] = useState({})
	const [twentyRandomDrinks, setTwentyRandomDrinks] = useState([])

	// const fetchSpiritData = (spirit: string): Promise<IngredientDetailsReponse | null> =>
	// 	axios
	// 		.get(
	// 			`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/search.php?i=${spirit}`
	// 		)
	// 		.then((response) => {
	// 			if (response.data.ingredients) {
	// 				return response.data.ingredients[0]
	// 			}
	// 			return null
	// 		})
	// 		.catch((error) => {
	// 			throw error
	// 		})

	// const fetchRelatedSpiritsDrinks = (spirit: string) =>
	// 	axios
	// 		.get(
	// 			`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/filter.php?i=${spirit}`
	// 		)
	// 		.then((response) => {
	// 			const relatedDrinkData: {[key: string]: DrinkDataPoint[]} = {}
	// 			relatedDrinkData[spirit] = response.data.drinks
	// 			return relatedDrinkData
	// 		})
	// 		.catch((error) => {
	// 			throw error
	// 		})

	const fetchTenRandomDrinks = () => {
		return axios
			.get(
				`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/randomselection.php`
			)
			.then((response) => {
				return response.data.drinks
			})
			.catch((error) => {
				throw error
			})
	}

	useEffect(() => {
		// const ingredientsNameList = ingredients.map(({name}: {name: string}) => name.toLowerCase())
		// if (ingredientsNameList.length > 0) {
		// 	Promise.all(ingredientsNameList.map((spirit: string) => fetchSpiritData(spirit))).then(
		// 		(response) => {
		// 			// @ts-expect-error generic
		// 			setIngredientsDetailedDataToRender(response)
		// 		}
		// 	)

		// 	Promise.all(
		// 		ingredientsNameList.map((spirit: string) => {
		// 			return fetchRelatedSpiritsDrinks(spirit)
		// 		})
		// 	).then((response) => {
		// 		const map = {}
		// 		response.forEach((datum) => {
		// 			const key = Object.keys(datum)
		// 			// @ts-expect-error generic
		// 			map[key] = datum[key]
		// 		})
		// 		setRelatedSpiritsDrinksDataToRender(map)
		// 	})
		// }
		Promise.all([fetchTenRandomDrinks(), fetchTenRandomDrinks()]).then(([firstSet, secondSet]) => {
			// @ts-expect-error generic
			setTwentyRandomDrinks([...firstSet, ...secondSet])
		})
	}, [])

	const renderedBubble = (title: string, text: string | null, cssStyling: any) => {
		return (
			<div className="largeIngredientBubbleSection" style={cssStyling}>
				<p style={{fontFamily: primaryFont}} className="largeViewBubbleTitle text-xs lg:text-sm xl:text-base 2xl:text-lg">
					{title}
				</p>
				<p style={{fontFamily: primaryFont}} className="largeViewBubbleText text-sm lg:text-base xl:text-lg 2xl:text-xl" title={text || ''}>
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
				<div style={{display: 'flex', width: '100%', padding: '20px 30px 20px 0', justifyContent: 'center', marginBottom: '40px'}} key={index}>
					<div>
						<img
							alt={ingredient.name}
							src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.name}-medium.png`}
						/>
					</div>
					<div style={{width: '40%'}}>
						<p
							style={{
								fontFamily: primaryFont,
								color: 'darkgray',
								borderBottom: '1px solid darkgrey',
								margin: '20px 0 0 0'
							}}
							className='text-lg lg:text-xl xl:text-2xl 2xl:text-3xl'
						>
							Ingredient
						</p>
						<p style={{fontFamily: primaryFont, color: 'aqua'}} className='text-lg lg:text-xl xl:text-2xl 2xl:text-3xl pt-3'>
							{ingredient.name}
						</p>
					</div>
					<div style={{width: '40%'}}>
						<p
							style={{
								fontFamily: primaryFont,
								color: 'darkgray',
								textAlign: 'right',
								borderBottom: '1px solid darkgrey',
								margin: '20px 0 0 0'
							}}
							className='text-lg lg:text-xl xl:text-2xl 2xl:text-3xl'
						>
							Amount
						</p>
						<p
							style={{
								fontFamily: primaryFont,
								color: 'aqua',
								textAlign: 'right'
							}}
							className='text-lg lg:text-xl xl:text-2xl 2xl:text-3xl pt-3'
						>
							{ingredient.amount || 'To your liking'}
						</p>
					</div>
				</div>
			)
		})
	}

	// const renderedIngredientsDetailedMarkup = () => {
	// 	return ingredientsDetailedDataToRender.length === 0 ? (
	// 		<></>
	// 	) : (
	// 		ingredientsDetailedDataToRender.map((ingredientData: IngredientDetailsReponse) => {
	// 			if (ingredientData && ingredientData.strDescription) {
	// 				const {idIngredient, strIngredient, strDescription} = ingredientData
	// 				return (
	// 					<LargeViewDetailedIngredients
	// 						idIngredient={idIngredient}
	// 						key={idIngredient}
	// 						strIngredient={strIngredient}
	// 						strDescription={strDescription}
	// 						ingredientsDetailedDataToRender={ingredientsDetailedDataToRender}
	// 						relatedSpiritsDrinksDataToRender={relatedSpiritsDrinksDataToRender}
	// 					/>
	// 				)
	// 			} else {
	// 				return <></>
	// 			}
	// 		})
	// 	)
	// }

	const renderedRandomDrinks = () => {
		const drinkImageList = twentyRandomDrinks.map((drink: DrinkDataPoint) => {
			return (
				<Link key={drink.drinkMapID} to={`/drink/${drink.idDrink}`} id={drink.drinkMapID}>
					<ImageListItem sx={{height: '100%'}} key={drink.drinkMapID}>
						<img
							src={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format&dpr=2 2x`}
							srcSet={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format`}
							alt={drink.strDrink || ''}
							loading="lazy"
						/>
						<div className="overlay-photo">
							<p className="overlay-photo-text">{drink.strDrink}</p>
						</div>
					</ImageListItem>
				</Link>
			)
		})

		return (
			<div
				style={{
					height: 'auto',
					padding: '20px'
				}}
			>
				<h2
					style={{
						fontFamily: primaryFont,
						margin: 0,
						color: 'white',
						backgroundColor: '#000',
						padding: '30px 30px 25px 30px',
						borderTopRightRadius: '12px',
						borderTopLeftRadius: '12px'
					}}
					className='text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl'
				>
					Random Drinks
				</h2>
				<ImageList
					variant="standard"
					cols={4}
					gap={5}
					sx={{
						height: 'auto',
						backgroundColor: '#000',
						margin: 0,
						borderBottomLeftRadius: '12px',
						borderBottomRightRadius: '12px'
					}}
				>
					{drinkImageList}
				</ImageList>
			</div>
		)
	}

	const renderedSaveIcon = toggleSaved ? (
		<FaHeartCirclePlus title="Add/Remove from favorites" color="red" className={iconClasses} />
	) : (
		<FaHeartCircleMinus title="Add/Remove from favorites" color="white" className={iconClasses} />
	)

	const renderedVideoIcon = (videoUrl: string | null | undefined) => {
		if (videoUrl) {
			return (
				<Button
					title="Open drink instruction video."
					size="medium"
					onClick={() => handleViewOnClick(videoUrl)}
					sx={{marginBottom: '10px'}}
				>
					<FaVideo color="white" className={iconClasses} />
				</Button>
			)
		}
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
							<div>
								<h1 style={{fontFamily: primaryFont}} className='text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-5 lg:mb-7 xl:mb-9 2xl:mb-11'>{drink?.strDrink}</h1>
							</div>
							<div>
								<div className="mainPageBubble">
									{renderedBubble('Type', drink?.strAlcoholic || '', {})}
									{renderedBubble('Glass', drink?.strGlass || '', {
										borderLeft: '1px solid darkgrey'
									})}
									{renderedBubble('Category', drink?.strCategory || '', {
										borderLeft: '1px solid darkgrey'
									})}
								</div>
								<div style={{display: 'flex', justifyContent: 'center'}} className='mb-5 lg:mb-7 xl:mb-9 2xl:mb-11'>
									{renderedTags}
								</div>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									<div style={{width: 'auto'}}>
										<Button
											size="medium"
											onClick={() => handleSaveOnClick(drink)}
											sx={{marginBottom: '10px', marginRight: '40px'}}
										>
											{renderedSaveIcon}
										</Button>
										<Button
											size="medium"
											onClick={() => {
												if (drink) handleShareOnClick(drink.idDrink)
											}}
											sx={{marginBottom: '10px', marginRight: '40px'}}
										>
											<FaShare color="white" className={iconClasses} />
										</Button>
										{renderedVideoIcon(drink?.strVideo)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="drinkPageImageContainer" style={{width: '50%'}}>
						<img
							src={`${drink?.strDrinkThumb}?&fit=crop&auto=format&dpr=2 2x`}
							alt={drink?.strDrink || ''}
						/>
					</div>
				</div>

				<div style={{height: 'auto', padding: '20px'}}>
					<h2
						style={{
							fontFamily: primaryFont,
							margin: 0,
							color: 'white',
							backgroundColor: '#000',
							padding: '30px',
							borderTopLeftRadius: '20px',
							borderTopRightRadius: '20px'
						}}
						className='text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl'
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
							backgroundColor: '#000',
							padding: '30px 30px 0px 30px',
							borderTopRightRadius: '12px',
							borderTopLeftRadius: '12px'
						}}
						className='text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl'
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
								margin: 0,
								padding: '0px 10px'
							}}
							className='text-lg lg:text-xl xl:text-2xl 2xl:text-3xl pt-3'
						>
							{drink?.strInstructions}
						</p>
					</div>
				</div>
				{/* {renderedIngredientsDetailedMarkup()} */}
				{renderedRandomDrinks()}
			</main>
		)
	}

	return renderedDrinkPageComponent()
}

export default LargeDrinkView
