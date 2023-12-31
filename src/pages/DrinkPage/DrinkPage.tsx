import './styles.css'
import {useParams} from 'react-router-dom'
import {useFetchDrinkDataByIDQuery} from '../../store'
import SkeletonLoader from '../../components/Skeleton'
import {primaryFont} from '../../fonts/fonts'
import DrinkTags from '../../components/DrinkTags'

const isMobileView = window.innerWidth < 1050

const DrinkPage = (): JSX.Element => {
	let {id} = useParams<'id'>()
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

	let content
	if (isFetching) {
		content = <SkeletonLoader />
	} else if (error) {
		return <div>Error fetching data</div>
	} else {
		content = renderedDrinkPageComponent(data?.drinks[0])
	}

	return <div style={{height: 'calc(100% - 64px)'}}>{content}</div>
}

export default DrinkPage
