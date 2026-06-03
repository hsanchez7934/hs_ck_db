import './styles.css'
import React from 'react'
import {Link} from 'react-router-dom'
import {DrinkDataPoint} from '../../types'
import MobileDrinkCardActionButton from './MobileDrinkCardActionButton'
import {
	FaEye,
	FaHeartCircleMinus,
	FaHeartCirclePlus,
	FaShare,
	FaVideo
} from 'react-icons/fa6'

type Props = {
	drink: DrinkDataPoint
	isSaved: boolean
	detailPath: string
	mobileStatePrevPath: string
	onShare: (drinkID: string | null) => void
	onSave: (drink: DrinkDataPoint, isSaved: boolean) => void
	onVideo: (url: string | null) => void
}

const MobileDrinkCard = ({
	drink,
	isSaved,
	detailPath,
	mobileStatePrevPath,
	onShare,
	onSave,
	onVideo
}: Props): JSX.Element => {
	const hasVideo = Boolean(drink.strVideo)

	return (
		<article className="mobile-drink-card">
			<div className="mobile-drink-card-media">
				<img
					className="mobile-drink-card-image"
					src={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format&dpr=2 2x`}
					srcSet={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format`}
					alt={drink.strDrink || 'Cocktail image'}
					loading="lazy"
				/>
				<div className="mobile-drink-card-overlay" aria-hidden="true" />
				<div className="mobile-drink-card-heading">
					<div className="mobile-drink-card-title-wrap">
						<span className="mobile-drink-card-title-accent" aria-hidden="true" />
						<h3 className="mobile-drink-card-title">{drink.strDrink}</h3>
					</div>
					{drink.strGlass && <span className="mobile-drink-card-glass">{drink.strGlass}</span>}
				</div>
			</div>

			<footer className={`mobile-drink-card-actions${hasVideo ? ' mobile-drink-card-actions--with-video' : ''}`}>
				<MobileDrinkCardActionButton
					label="Copy shareable link"
					onClick={() => onShare(drink.idDrink)}
				>
					<FaShare className="mobile-drink-card-action-icon" />
				</MobileDrinkCardActionButton>

				<MobileDrinkCardActionButton
					label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
					active={isSaved}
					onClick={() => onSave(drink, isSaved)}
				>
					{isSaved ? (
						<FaHeartCirclePlus className="mobile-drink-card-action-icon mobile-drink-card-action-icon--saved" />
					) : (
						<FaHeartCircleMinus className="mobile-drink-card-action-icon" />
					)}
				</MobileDrinkCardActionButton>

				<Link
					to={detailPath}
					state={{mobileStatePrevPath}}
					className="mobile-drink-card-action-link"
					aria-label="View drink details"
					title="View drink details"
				>
					<FaEye className="mobile-drink-card-action-icon" />
				</Link>

				{hasVideo && (
					<MobileDrinkCardActionButton
						label="Open instruction video"
						onClick={() => onVideo(drink.strVideo)}
					>
						<FaVideo className="mobile-drink-card-action-icon" />
					</MobileDrinkCardActionButton>
				)}
			</footer>
		</article>
	)
}

export default MobileDrinkCard
