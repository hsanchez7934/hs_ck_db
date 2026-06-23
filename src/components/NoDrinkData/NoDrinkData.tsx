import './styles.css'
import React from 'react'
import {Link} from 'react-router-dom'
import {motion, useReducedMotion} from 'framer-motion'
import {
	FaCircleExclamation,
	FaHeart,
	FaMagnifyingGlass,
	FaArrowRotateRight,
	FaArrowRight
} from 'react-icons/fa6'
import {fadeInUp} from '../../theme/motion'
import {useLocation} from 'react-router-dom'

type Props = {isSavedDrinksPage?: boolean; isErrorMessage?: boolean}

type Variant = 'search' | 'error' | 'saved'

type VariantConfig = {
	title: string
	text: string
	icon: React.ElementType
	tone: 'accent' | 'error'
	showRefresh?: boolean
	cta?: {to: string; label: string}
}

const getVariant = (isSavedDrinksPage?: boolean, isErrorMessage?: boolean): Variant => {
	if (isSavedDrinksPage) {
		return 'saved'
	}
	if (isErrorMessage) {
		return 'error'
	}
	return 'search'
}

const variantConfig: Record<Variant, VariantConfig> = {
	search: {
		title: 'No drinks found',
		text: 'We could not find any cocktails matching this search. Try a different letter, keyword, or filter.',
		icon: FaMagnifyingGlass,
		tone: 'accent',
		cta: {to: '/search/byname', label: 'Search by name'}
	},
	error: {
		title: 'Something went wrong',
		text: 'Drinks failed to load. Please refresh the page and try again.',
		icon: FaCircleExclamation,
		tone: 'error',
		showRefresh: true
	},
	saved: {
		title: 'No saved drinks yet',
		text: 'You have not saved any drinks yet. Browse the app and tap the heart on your favorites.',
		icon: FaHeart,
		tone: 'accent',
		cta: {to: '/search/byname', label: 'Start exploring'}
	}
}

const NoDrinkDataNotice = ({isSavedDrinksPage, isErrorMessage}: Props): JSX.Element => {
	const shouldReduceMotion = useReducedMotion()
	const variant = getVariant(isSavedDrinksPage, isErrorMessage)
	const {title, text, icon: Icon, tone, showRefresh, cta} = variantConfig[variant]
	const location = useLocation()

	const content = (
		<div className="no-drink-data">
			<section
				className={`no-drink-data-panel no-drink-data-panel--${tone}`}
				aria-labelledby="no-drink-data-title"
			>
				<div className="no-drink-data-icon" aria-hidden="true">
					<Icon />
				</div>
				<h2 className="no-drink-data-title" id="no-drink-data-title">
					{title}
				</h2>
				<p className="no-drink-data-text">{text}</p>
				{(showRefresh || cta) && (
					<div className="no-drink-data-actions">
						{showRefresh && (
							<button
								type="button"
								className="no-drink-data-btn no-drink-data-btn--secondary"
								onClick={() => window.location.reload()}
							>
								<FaArrowRotateRight aria-hidden="true" />
								Refresh page
							</button>
						)}
						{cta && location.pathname !== '/search/byname' && (
							<Link to={cta.to} className="no-drink-data-btn no-drink-data-btn--primary">
								{cta.label}
								<FaArrowRight aria-hidden="true" />
							</Link>
						)}
					</div>
				)}
			</section>
		</div>
	)

	if (shouldReduceMotion) {
		return content
	}

	return (
		<motion.div
			variants={fadeInUp}
			initial="hidden"
			animate="visible"
			transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
			style={{height: '100%', width: '100%'}}
		>
			{content}
		</motion.div>
	)
}

export default NoDrinkDataNotice
