import React, {useState} from 'react'
import {primaryFont} from '../../fonts/fonts'
import {ImageList, ImageListItem} from '@mui/material'
import {Link} from 'react-router-dom'

interface LargeViewDetailedIngredientsProps {
	idIngredient: string
	strIngredient: string
	strDescription: string
	ingredientsDetailedDataToRender: any
	relatedSpiritsDrinksDataToRender: any
}

const LargeViewDetailedIngredients = (props: LargeViewDetailedIngredientsProps) => {
	const {
		idIngredient,
		strIngredient,
		strDescription,
		ingredientsDetailedDataToRender,
		relatedSpiritsDrinksDataToRender
	} = props
	const [spiritDetailToggledClass, setSpiritDetailToggledClass] = useState('truncate')
	const [toggleTruncateClass, setToggleTruncateClass] = useState(false)

	const handleToggleTruncateText = () => {
		if (toggleTruncateClass) {
			setSpiritDetailToggledClass('truncate')
			setToggleTruncateClass(false)
		} else {
			setSpiritDetailToggledClass('')
			setToggleTruncateClass(true)
		}
	}

	const renderedRelatedDrinks = (strIngredient: string) => {
		if (ingredientsDetailedDataToRender.length > 0) {
			if (relatedSpiritsDrinksDataToRender[strIngredient.toLowerCase()]) {
				// @ts-expect-error generic
				return relatedSpiritsDrinksDataToRender[strIngredient.toLowerCase()].map((drink) => {
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
									<p className="overlay-photo-text" style={{fontSize: '1em'}}>
										{drink.strDrink}
									</p>
								</div>
							</ImageListItem>
						</Link>
					)
				})
			}
		}
		return <></>
	}

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
				<div style={{display: 'flex', height: '350px', marginBottom: '20px'}}>
					<div
						style={{
							height: '100%',
							width: '30%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<img
							src={`https://www.thecocktaildb.com/images/ingredients/${strIngredient}-medium.png`}
							className="relatedDrinksImage"
							alt={strIngredient}
						/>
					</div>
					<div style={{height: '100%', width: '70%'}}>
						<h3 style={{color: 'white', fontFamily: primaryFont, margin: 0, height: '20px'}}>
							Drinks that contain {strIngredient}
						</h3>
						<div
							style={{
								height: '300px',
								width: '100%'
							}}
						>
							<ImageList variant="standard" cols={6} gap={1} sx={{height: '300px'}}>
								{renderedRelatedDrinks(strIngredient)}
							</ImageList>
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
					className={`${spiritDetailToggledClass}`}
				>
					{strDescription}
				</p>
				<p
					style={{
						color: 'aqua',
						fontSize: '1.6em',
						cursor: 'pointer',
						fontFamily: primaryFont,
						paddingLeft: '10px'
					}}
					onClick={() => handleToggleTruncateText()}
				>
					{spiritDetailToggledClass === 'truncate' ? 'Show more' : 'Show less'}
				</p>
			</div>
		</div>
	)
}

export default LargeViewDetailedIngredients
