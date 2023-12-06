import './styles.css'
import DrinkCard from '../components/DrinkCard/DrinkCard'
import {useParams} from 'react-router-dom'
import {useFetchDrinkDataByIDQuery} from '../store'
import SkeletonLoader from '../components/Skeleton'
import fetchIngredientImages from '../helper-functions/fetchIngredientImages'
import {primaryFont} from '../fonts/fonts'
import DrinkTags from '../components/DrinkTags'
import {useRef} from 'react'

const DrinkPage = (): JSX.Element => {
	const divEl = useRef()
	let {id} = useParams<'id'>()
	const {data, error, isFetching} = useFetchDrinkDataByIDQuery(id)
	console.log(data?.drinks)
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
	console.log(ingredients)

	const renderedIngredientContainers = () => {
		return ingredients.map((ingredient: any, index: number) => {
			return (
				<div style={{height: '200px', width: '200px', marginBottom: '50px'}} key={index}>
					<img
						style={{height: '90%'}}
						alt={'drink'}
						src={`https://www.thecocktaildb.com/images/ingredients/${ingredient.name}.png`}
					></img>
					<div
						style={{
							display: 'flex',
							height: '10%',
							width: '100%',
							textAlign: 'center',
							color: '#fff',
							justifyContent: 'space-evenly',
							alignItems: 'center'
						}}
					>
						<p style={{margin: 0}}>{ingredient.amount}</p>
						<p style={{margin: 0}}>{ingredient.name}</p>
					</div>
				</div>
			)
		})
	}

	const renderedDrinkPageComponent = (drink: any) => {
		const renderedTags =
			data.drinks[0]?.strTags && data.drinks[0]?.strTags.length > 0 ? (
				<DrinkTags tags={data.drinks[0]?.strTags.split(',')} />
			) : (
				<></>
			)
		return (
			<div style={{overflow: 'auto', height: '100%', display: 'flex'}}>
				<div
					style={{
						width: ' 55%',
						height: '100%',
						backgroundImage: `url(${drink?.strDrinkThumb})`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'cover',
						backgroundPosition: 'left',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column'
					}}
				>
					<div
						style={{
							backgroundColor: '#000',
							height: '98%',
							color: '#fff',
							width: '98%',
							opacity: 0.7,
							// display: 'flex',
							// justifyContent: 'center',
							// alignItems: 'center',
							// flexDirection: 'column',
							border: '1px solid #fff',
							position: 'relative'
						}}
					>
						<div style={{height: '33.33%'}}>
							<h1
								style={{
									margin: 0,
									fontFamily: primaryFont,
									// borderBottom: '1px solid #fff',
									// marginBottom: '10px',
									width: '100%',
									textAlign: 'center'
								}}
								className="animate-charcter"
							>
								{drink?.strDrink}
							</h1>
						</div>
						<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%', height: '33.33%', alignItems: 'flex-end'}}>
							<h2 style={{margin: 0, fontFamily: primaryFont, display: 'inline-block'}}>
								{drink?.strGlass}
							</h2>
							<h2 style={{margin: 0, fontFamily: primaryFont, display: 'inline-block'}}>
								{drink?.strCategory}
							</h2>
							<h2 style={{margin: 0, fontFamily: primaryFont, display: 'inline-block'}}>
								{drink?.strAlcoholic}
							</h2>
						</div>
						<div style={{width: '100%', textAlign: 'center', height: '33.33%'}}>{renderedTags}</div>
					</div>
				</div>

				<div style={{width: '45%', height: '100%', overflowY: 'auto', padding: '0px 15px'}}>
					<h2
						style={{
							color: '#fff',
							margin: '10px 0px 20px 0px',
							fontFamily: primaryFont,
							borderBottom: '1px solid #fff',
							textAlign: 'center',
							paddingBottom: '10px'
						}}
					>
						Ingredients
					</h2>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-around',
							flexWrap: 'wrap',
							height: 'auto'
						}}
					>
						{renderedIngredientContainers()}
					</div>
					<div>
						<h2
							style={{
								color: '#fff',
								margin: '10px 0px 20px 0px',
								fontFamily: primaryFont,
								borderBottom: '1px solid #fff',
								textAlign: 'center',
								paddingBottom: '10px'
							}}
						>
							Instructions
						</h2>
						<p
							style={{
								color: '#fff',
								// margin: '10px 0px 20px 0px',
								fontFamily: primaryFont
								// borderBottom: '1px solid #fff',
								// textAlign: 'center',
								// paddingBottom: '10px'
							}}
						>
							{drink.strInstructions}
						</p>
					</div>
				</div>
			</div>
		)
	}

	let content
	if (isFetching) {
		content = <SkeletonLoader />
	} else if (error) {
		return <div>Error fetching data</div>
	} else {
		// content = <DrinkCard drink={data.drinks[0]} />
		content = renderedDrinkPageComponent(data?.drinks[0])
	}
	return <div style={{height: 'calc(100% - 64px)'}}>{content}</div>
}

export default DrinkPage
