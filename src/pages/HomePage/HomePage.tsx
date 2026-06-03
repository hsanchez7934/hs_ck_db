import './styles.css'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {motion, useReducedMotion} from 'framer-motion'
import PageContainer from '../../components/layout/PageContainer'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import fetchRandomDrink from '../../helper-functions/fetchRandomDrink'
import {DrinkDataPoint} from '../../types'
import {fadeInUp, pageTransition} from '../../theme/motion'
import {
	FaMartiniGlassCitrus,
	FaShuffle,
	FaHeart,
	FaMagnifyingGlass,
	FaArrowRight
} from 'react-icons/fa6'
import {TiSortAlphabetically} from 'react-icons/ti'
import {GiBeerBottle} from 'react-icons/gi'
import {MdBlender} from 'react-icons/md'

const FEATURES = [
	{
		title: 'Search by name',
		description: 'Browse the catalog A–Z or run a keyword search to find cocktails fast.',
		path: '/search/byname',
		cta: 'Search by name',
		icon: TiSortAlphabetically
	},
	{
		title: 'Filter by spirit',
		description: 'Explore recipes built around vodka, gin, rum, whiskey, and more.',
		path: '/search/byspirit',
		cta: 'Browse spirits',
		icon: GiBeerBottle
	},
	{
		title: 'Match ingredients',
		description: 'See what you can make with what is already in your bar or pantry.',
		path: '/search/byingredient',
		cta: 'By ingredient',
		icon: MdBlender
	},
	{
		title: 'Save favorites',
		description: 'Sign in to bookmark drinks and revisit your personal collection anytime.',
		path: '/saveddrinks',
		cta: 'Saved drinks',
		icon: FaHeart
	}
] as const

const APP_NAME = 'Cocktail Explorer'
const COCKTAIL_DB_URL = 'https://www.thecocktaildb.com/'

const getIngredientPreview = (drink: DrinkDataPoint, limit = 4): string[] => {
	const items: string[] = []
	for (let i = 1; i <= 15 && items.length < limit; i += 1) {
		const name = drink[`strIngredient${i}` as keyof DrinkDataPoint]
		if (name) {
			const measure = drink[`strMeasure${i}` as keyof DrinkDataPoint]
			items.push(measure ? `${measure} ${name}` : String(name))
		}
	}
	return items
}

const HomePage = (): JSX.Element => {
	const location = useLocation()
	const shouldReduceMotion = useReducedMotion()
	const [featuredDrink, setFeaturedDrink] = useState<DrinkDataPoint | null>(null)
	const [isFeaturedLoading, setIsFeaturedLoading] = useState(true)
	const [featuredError, setFeaturedError] = useState(false)

	const loadFeaturedDrink = useCallback(async () => {
		setIsFeaturedLoading(true)
		setFeaturedError(false)
		try {
			const drink = await fetchRandomDrink()
			setFeaturedDrink(drink)
		} catch {
			setFeaturedError(true)
			setFeaturedDrink(null)
		} finally {
			setIsFeaturedLoading(false)
		}
	}, [])

	useEffect(() => {
		loadFeaturedDrink()
	}, [loadFeaturedDrink])

	const ingredientPreview = useMemo(
		() => (featuredDrink ? getIngredientPreview(featuredDrink) : []),
		[featuredDrink]
	)

	const MotionSection = shouldReduceMotion ? 'section' : motion.section

	return (
		<PageContainer className="landing-page-container">
			<div className="landing-page">
				<MotionSection
					className="landing-hero glass-panel"
					{...(shouldReduceMotion
						? {}
						: {
								initial: 'hidden',
								animate: 'visible',
								variants: fadeInUp,
								transition: pageTransition
							})}
				>
					<div className="landing-hero-content">
						<p className="landing-eyebrow">Welcome to Cocktail Explorer</p>
						<h1 className="landing-title">Discover, search, and save your next favorite drink</h1>
						<p className="landing-lead">
							A modern cocktail companion backed by a rich recipe database. Explore classics and
							hidden gems, filter by spirit or ingredient, and keep a personal shelf of saved drinks.
						</p>
						<div className="landing-hero-actions">
							<Link to="/search/popularcocktails" className="landing-btn landing-btn--primary">
								<FaMartiniGlassCitrus aria-hidden="true" />
								Popular cocktails
							</Link>
							<Link to="/search/byname" className="landing-btn landing-btn--secondary">
								<FaMagnifyingGlass aria-hidden="true" />
								Start searching
							</Link>
						</div>
					</div>
					<div className="landing-hero-visual" aria-hidden="true">
						<div className="landing-hero-orb landing-hero-orb--one" />
						<div className="landing-hero-orb landing-hero-orb--two" />
						<FaMartiniGlassCitrus className="landing-hero-icon" />
					</div>
				</MotionSection>

				<section className="landing-section">
					<div className="landing-section-header">
						<h2 className="landing-section-title">What you can do</h2>
						<p className="landing-section-subtitle">
							Everything you need to go from curious to confident behind the glass.
						</p>
					</div>
					<ul className="landing-features">
						{FEATURES.map((feature, index) => {
							const Icon = feature.icon
							const cardContent = (
								<>
									<span className="landing-feature-icon-wrap">
										<Icon className="landing-feature-icon" aria-hidden="true" />
									</span>
									<h3 className="landing-feature-title">{feature.title}</h3>
									<p className="landing-feature-text">{feature.description}</p>
									<Link to={feature.path} className="landing-feature-link">
										{feature.cta}
										<FaArrowRight aria-hidden="true" />
									</Link>
								</>
							)

							if (shouldReduceMotion) {
								return (
									<li key={feature.title} className="landing-feature-card glass-panel">
										{cardContent}
									</li>
								)
							}

							return (
								<motion.li
									key={feature.title}
									className="landing-feature-card glass-panel"
									custom={index}
									variants={fadeInUp}
									initial="hidden"
									whileInView="visible"
									viewport={{once: true, margin: '-40px'}}
									transition={{...pageTransition, delay: index * 0.06}}
								>
									{cardContent}
								</motion.li>
							)
						})}
					</ul>
				</section>

				<section className="landing-section landing-featured-section">
					<div className="landing-section-header landing-section-header--row">
						<div>
							<h2 className="landing-section-title">Featured cocktail</h2>
							<p className="landing-section-subtitle">
								Pulled at random from the database — shuffle for another surprise.
							</p>
						</div>
						<button
							type="button"
							className="landing-btn landing-btn--secondary landing-shuffle-btn"
							onClick={loadFeaturedDrink}
							disabled={isFeaturedLoading}
							aria-busy={isFeaturedLoading}
						>
							<FaShuffle aria-hidden="true" />
							{isFeaturedLoading ? 'Loading…' : 'Shuffle'}
						</button>
					</div>

					<div className="landing-featured glass-panel">
						{isFeaturedLoading && (
							<div className="landing-featured-loading">
								<LoadingSpinner />
							</div>
						)}
						{!isFeaturedLoading && featuredError && (
							<p className="landing-featured-error">
								We could not load a featured drink right now.{' '}
								<button type="button" className="landing-inline-link" onClick={loadFeaturedDrink}>
									Try again
								</button>
							</p>
						)}
						{!isFeaturedLoading && featuredDrink && (
							<div className="landing-featured-inner">
								<div className="landing-featured-media">
									<img
										src={`${featuredDrink.strDrinkThumb}?w=480&fit=crop&auto=format`}
										alt={featuredDrink.strDrink || 'Featured cocktail'}
										className="landing-featured-image"
									/>
								</div>
								<div className="landing-featured-details">
									<p className="landing-eyebrow">Tonight&apos;s pick</p>
									<h3 className="landing-featured-name">{featuredDrink.strDrink}</h3>
									<div className="landing-featured-meta">
										{featuredDrink.strCategory && (
											<span className="landing-meta-pill">{featuredDrink.strCategory}</span>
										)}
										{featuredDrink.strGlass && (
											<span className="landing-meta-pill">{featuredDrink.strGlass}</span>
										)}
										{featuredDrink.strAlcoholic && (
											<span className="landing-meta-pill">{featuredDrink.strAlcoholic}</span>
										)}
									</div>
									{featuredDrink.strInstructions && (
										<p className="landing-featured-instructions">
											{featuredDrink.strInstructions.length > 220
												? `${featuredDrink.strInstructions.slice(0, 220).trim()}…`
												: featuredDrink.strInstructions}
										</p>
									)}
									{ingredientPreview.length > 0 && (
										<ul className="landing-featured-ingredients">
											{ingredientPreview.map((line) => (
												<li key={line}>{line}</li>
											))}
										</ul>
									)}
									<Link
										to={`/drink/${featuredDrink.idDrink}`}
										state={{backgroundLocation: location}}
										className="landing-btn landing-btn--primary landing-featured-cta"
									>
										View full recipe
										<FaArrowRight aria-hidden="true" />
									</Link>
								</div>
							</div>
						)}
					</div>
				</section>

				<footer className="landing-footer glass-panel">
					<p className="landing-footer-brand">{APP_NAME}</p>
					<p className="landing-footer-copy">
						&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
					</p>
					<p className="landing-footer-credit">
						Recipe data powered by{' '}
						<a
							href={COCKTAIL_DB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="landing-footer-link"
						>
							The Cocktail DB
						</a>
						.
					</p>
				</footer>
			</div>
		</PageContainer>
	)
}

export default HomePage
