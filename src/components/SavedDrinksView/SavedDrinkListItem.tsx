import React from 'react'
import {Link} from 'react-router-dom'
import {motion, useReducedMotion} from 'framer-motion'
import {GiMartini} from 'react-icons/gi'
import {FaArrowRight} from 'react-icons/fa6'
import {DrinkDataPoint} from '../../types'
import {listItemVariants} from '../../theme/motion'

type Props = {
	drink: DrinkDataPoint
	index: number
	onSelect: (drink: DrinkDataPoint) => void
}

const SavedDrinkListItem = ({drink, index, onSelect}: Props): JSX.Element => {
	const shouldReduceMotion = useReducedMotion()

	const card = (
		<article className="saved-drink-card">
			<div className="saved-drink-card-media">
				{drink.strDrinkThumb ? (
					<img
						src={drink.strDrinkThumb}
						alt={drink.strDrink || 'Cocktail'}
						loading="lazy"
						className="saved-drink-card-image"
					/>
				) : (
					<div className="saved-drink-card-fallback" aria-hidden="true">
						<GiMartini />
					</div>
				)}
				<div className="saved-drink-card-media-overlay" aria-hidden="true" />
			</div>
			<div className="saved-drink-card-body">
				<div className="saved-drink-card-heading">
					<h3 className="saved-drink-card-title">{drink.strDrink}</h3>
					{drink.strCategory && (
						<p className="saved-drink-card-category">{drink.strCategory}</p>
					)}
				</div>
				<div className="saved-drink-card-meta">
					{drink.strGlass && (
						<span className="saved-drink-card-badge">{drink.strGlass}</span>
					)}
					{drink.strAlcoholic && (
						<span className="saved-drink-card-badge saved-drink-card-badge--muted">
							{drink.strAlcoholic}
						</span>
					)}
				</div>
				<span className="saved-drink-card-cta">
					View details
					<FaArrowRight aria-hidden="true" />
				</span>
			</div>
		</article>
	)

	return (
		<Link
			to={`/drink/${drink.idDrink}`}
			state={{savedDrinkViewPrevPath: '/saveddrinks'}}
			className="saved-drink-card-link"
			onClick={() => onSelect(drink)}
		>
			{shouldReduceMotion ? (
				card
			) : (
				<motion.div
					custom={index}
					variants={listItemVariants}
					initial="hidden"
					animate="visible"
					style={{height: '100%'}}
				>
					{card}
				</motion.div>
			)}
		</Link>
	)
}

export default SavedDrinkListItem
