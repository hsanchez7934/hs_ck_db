import './styles.css'
import React from 'react'
import DrinkTags from '../../components/DrinkTags'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import NoDrinkDataNotice from '../../components/NoDrinkData'
import {primaryFont} from '../../fonts/fonts'
import {useFetchDrinkDataByIDQuery} from '../../store'
import {useParams} from 'react-router-dom'
import generateUUID from '../../uuid'

const isMobileView = window.innerWidth < 1050

const DrinkPage = (): JSX.Element => {
	const {id} = useParams<'id'>()
	const {data, error, isFetching} = useFetchDrinkDataByIDQuery(id)

	let counter = 1
	const ingredients: any = []
	if (data && data?.drinks.length > 0) {
		while (data.drinks[0][`strIngredient${counter}`]) {
			ingredients.push({
				name: data.drinks[0][`strIngredient${counter}`],
				amount: data.drinks[0][`strMeasure${counter}`]
			})
			counter = counter + 1
		}
	}

	const renderedIngredientContainers = () => {
		return ingredients.map((ingredient: any, index: number) => {
			return (
				<div
					className={`drinksPageIngredientCard ${
						isMobileView ? 'drinksPageIngredientCardMobile' : 'drinksPageIngredientCardFull'
					}`}
					key={index}
				>
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

	const getDrinkDetailHeader = (label: string, value: string) => {
		if (label !== '' || !label) {
			return (
				<div className="drinkDetailHeader">
					<p className="drinkDetailHeaderLabel truncate" style={{fontFamily: primaryFont}}>
						{label}
					</p>
					<p className="drinkDetailHeaderValue truncate" style={{fontFamily: primaryFont}}>
						{value}
					</p>
				</div>
			)
		}
		return <></>
	}

	const renderedDrinkPageComponent = (drink: any) => {
		const renderedTags =
			data.drinks[0]?.strTags && data.drinks[0]?.strTags.length > 0 ? (
				<DrinkTags tags={data.drinks[0]?.strTags.split(',')} />
			) : (
				<></>
			)
		const drinkGlassTypeHeader = getDrinkDetailHeader('Served in:', drink.strGlass)
		const drinkGategoryHeader = getDrinkDetailHeader('Category:', drink.strCategory)
		const drinkAlcoholicHeader = getDrinkDetailHeader('Alcoholic/Nonalcoholic:', drink.strAlcoholic)

		const renderedDrinkDetails = (
			<div
				className={`drinkPageDrinkDetails ${isMobileView ? 'drinkPageFull' : 'drinkPageHalf'}`}
				style={{opacity: isMobileView ? 0.7 : 1, backgroundColor: isMobileView ? '#000' : ''}}
			>
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
						{drink.strInstructions}
					</p>
				</div>
			</div>
		)

		return (
			<main className={`drinkPageMainContainer`} style={{display: isMobileView ? 'block' : 'flex'}}>
				<div
					className={`drinkPageImage ${isMobileView ? 'drinkPageFull' : 'drinkPageHalf'}`}
					style={{backgroundImage: `url(${drink?.strDrinkThumb})`}}
				>
					{isMobileView ? renderedDrinkDetails : <></>}
				</div>
				{isMobileView ? <></> : renderedDrinkDetails}
			</main>
		)
	}

	const mobileDrinkPageComponent = (drink: any) => {
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
					<div className="mobileIngredientBubble">
						<div className="mobileIngredientBubbleSection">
							<p style={{fontFamily: primaryFont}} className="bubbleTitle">
								Type
							</p>
							<p
								style={{fontFamily: primaryFont}}
								className="bubbleText truncate"
								title={drink.strAlcoholic}
							>
								{drink.strAlcoholic}
							</p>
						</div>
						<div
							className="mobileIngredientBubbleSection"
							style={{borderLeft: '1px solid darkgrey'}}
						>
							<p style={{fontFamily: primaryFont}} className="bubbleTitle">
								Glass
							</p>
							<p
								style={{fontFamily: primaryFont}}
								className="bubbleText truncate"
								title={drink.strGlass}
							>
								{drink.strGlass}
							</p>
						</div>
						<div
							className="mobileIngredientBubbleSection"
							style={{borderLeft: '1px solid darkgrey'}}
						>
							<p style={{fontFamily: primaryFont}} className="bubbleTitle">
								Category
							</p>
							<p
								style={{fontFamily: primaryFont}}
								className="bubbleText truncate"
								title={drink.strCategory}
							>
								{drink.strCategory}
							</p>
						</div>
					</div>
				</div>
				<div className="mobileDrinkPageIngredientsContainer">
					<h2 style={{fontFamily: primaryFont}} className="mobileDrinkPageIngredientsHeader">
						Ingredients
					</h2>
					<div className="mobileDrinkPageIngredientsListContainer">
						{ingredients.map((ingredient: any) => {
							console.log(ingredient)
							return (
								<div className="mobileDrinkPageIngredientCard" key={generateUUID()}>
									<div className="mobileDrinkPageIngredientImgContainer">
										<img
											src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.name}-small.png`}
										/>
									</div>
									<div className="mobileDrinkPageIngredientTextContainer">
										<p className="left">{`${ingredient.amount || ''}`}</p>
										<p className="left">{`${ingredient.name || ''}`}</p>
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
							className="mobileDrinkPageInstructionsText"
							style={{fontFamily: primaryFont, color: 'white'}}
						>
							{drink.strInstructions}
						</p>
					</div>
				</div>
			</div>
		)
	}

	let content = <LoadingSpinner />
	if (isFetching) {
		content = <LoadingSpinner />
	} else if (error) {
		return <NoDrinkDataNotice isErrorMessage={true} />
	} else if (data && data?.drinks?.length > 0) {
		const isMobileView = window.innerWidth < 800
		content = isMobileView
			? mobileDrinkPageComponent(data?.drinks[0])
			: renderedDrinkPageComponent(data?.drinks[0])
	}

	return <div style={{height: 'calc(100% - 64px)', overflow: 'auto'}}>{content}</div>
}

export default DrinkPage
