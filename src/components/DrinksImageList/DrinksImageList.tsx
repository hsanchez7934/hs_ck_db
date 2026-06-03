import './styles.css'
import React, {ReactElement, useRef} from 'react'
import Box from '@mui/material/Box'
import {motion, useReducedMotion} from 'framer-motion'
import {DrinkDataPoint} from '../../types'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import SimpleDialog from '../SimpleDialog/SimpleDialog'
import MobileDrinkCard from '../MobileDrinkCard/MobileDrinkCard'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import generateUUID from '../../uuid'
import useSaveDrink from '../../hooks/useSaveDrink'
import {updateIsModalOpen, updateModalDrink, updateDrinkMap} from '../../store'
import {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {Link, useLocation, generatePath} from 'react-router-dom'
import {listItemVariants} from '../../theme/motion'

interface Props {
	drinksData: DrinkDataPoint[]
}

const removeSavedMapIDs = (drinksList: DrinkDataPoint[]) => {
	if (drinksList?.[0]?.drinkMapID) {
		const cleaned = drinksList.map((drink: DrinkDataPoint) => {
			const newDrink = Object.assign({}, drink)
			delete newDrink.drinkMapID
			return newDrink
		})
		return cleaned
	}
	return drinksList
}

const DrinksImageList = (props: Props) => {
	const {drinksData} = props
	const infiniteScrollContainer = useRef(null)
	const location = useLocation()
	const shouldReduceMotion = useReducedMotion()

	const [renderData, setRenderData] = useState([])
	const [shareDialogOpen, setShareDialogOpen] = useState(false)
	const [shareDialogColor, setShareDialogColor] = useState('')
	const [shareDialogText, setShareDialogText] = useState('')
	const [gridColumnsNum, setGridColumnsNum] = useState(4)
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)

	const dispatch = useAppDispatch()
	const {userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)
	const {useSavedScrollTop} = useAppSelector(({useSavedScrollTopState}) => useSavedScrollTopState)
	const {dialogState, isDrinkSaved, toggleSaveDrink, toggleLoginDialog, setToggleLoginDialog} = useSaveDrink()

	useEffect(() => {
		const setDrinkPagerMap = () => {
			const map = {}
			const drinks = []
			let previousID = null
			let currentID = generateUUID()
			let nextID = generateUUID()
			const drinksDataToRender = removeSavedMapIDs(drinksData)
			for (let index = 0; index < drinksDataToRender.length; index++) {
				const data = Object.assign({...drinksDataToRender[index], drinkMapID: currentID})
				const previous = drinksDataToRender[index - 1]
					? Object.assign({...drinksDataToRender[index - 1], drinkMapID: previousID})
					: null
				const next = drinksDataToRender[index + 1]
					? Object.assign({...drinksDataToRender[index + 1], drinkMapID: nextID})
					: null

				drinks.push(data)
				const node = {
					data,
					previous,
					next
				}

				previousID = currentID
				currentID = nextID
				nextID = generateUUID()

				// @ts-expect-error generic
				map[data.drinkMapID] = node
			}
			// @ts-expect-error generic
			setRenderData(drinks)
			dispatch(updateDrinkMap(map))
		}
		setDrinkPagerMap()
	}, [drinksData, userSavedDrinks])

	useEffect(() => {
		if (window.innerWidth <= 640) {
			const copy = infiniteScrollContainer?.current
			const handleScroll = (scroll: number) => {
				if (scroll) {
					sessionStorage.setItem('savedScrollTop', scroll.toString())
				}
			}
			// @ts-expect-error generic
			copy.addEventListener('scroll', () => {
				// @ts-expect-error generic
				handleScroll(copy.scrollTop)
			})
			// @ts-expect-error generic
			return () => copy.removeEventListener('scroll', handleScroll)
		}
	}, [])

	useEffect(() => {
		const copy = infiniteScrollContainer?.current
		if (window.innerWidth <= 640 && useSavedScrollTop) {
			const savedScrollTop = sessionStorage.getItem('savedScrollTop')
			// @ts-expect-error generic
			copy.scrollTo(0, Number(savedScrollTop))
		}
	}, [useSavedScrollTop])

	useEffect(() => {
		const setGridColumns = (width: number) => {
			let columns = 5

			if (width <= 640) {
				columns = 1
			} else if (width <= 768) {
				columns = 2
			} else if (width <= 1024) {
				columns = 3
			} else if (width <= 1536) {
				columns = 4
			}

			setGridColumnsNum(columns)
			return columns
		}

		const imageListContainer = document.querySelector('#imageScrollContainer')
		if (imageListContainer) {
			const resizeObserver = new ResizeObserver((entries: any) => {
				for (const entry of entries) {
					const width = entry.contentRect.width
					setGridColumns(width)
					setWindowWidth(width)
				}
			})
			resizeObserver.observe(imageListContainer)
			return () => {
				resizeObserver.disconnect()
			}
		}
	}, [])

	const handleOnClickLargeCard = async (drink: DrinkDataPoint) => {
		if (!drink.strInstructions) {
			const response = await fetchDrinkDataByID(drink)
			drink = {...response, ...drink}
		}
		dispatch(updateIsModalOpen(true))
		dispatch(updateModalDrink(drink))
	}

	const renderedLargeDrinkImages = () => {
		const largeDrinkCards = renderData.map((drink: DrinkDataPoint, index: number) => {
			const cardContent = (
				<>
					<img
						src={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format&dpr=2 2x`}
						srcSet={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format`}
						alt={drink.strDrink || ''}
						loading="lazy"
					/>
					<div className="overlay-photo">
						<p className="overlay-photo-text">{drink.strDrink}</p>
					</div>
				</>
			)

			return (
				<Link
					key={drink.drinkMapID}
					to={`/drink/${drink.idDrink}`}
					state={{backgroundLocation: location}}
					id={drink.drinkMapID}
				>
					<ImageListItem onClick={() => handleOnClickLargeCard(drink)} key={drink.drinkMapID}>
						{shouldReduceMotion ? (
							cardContent
						) : (
							<motion.div
								custom={index}
								variants={listItemVariants}
								initial="hidden"
								animate="visible"
								style={{height: '100%', width: '100%', position: 'relative'}}
							>
								{cardContent}
							</motion.div>
						)}
					</ImageListItem>
				</Link>
			)
		})

		return largeDrinkCards
	}

	const toggleShareDialog = (color: string, text: string) => {
		setShareDialogColor(color)
		setShareDialogText(text)
		setShareDialogOpen(true)
		setTimeout(() => {
			setShareDialogOpen(false)
		}, 1500)
	}

	const handleMobileCardSaveOnClick = (selectedDrink: DrinkDataPoint, isSaved: boolean) => {
		toggleSaveDrink(selectedDrink, {isCurrentlySaved: isSaved})
	}

	const handleShareOnClick = async (drinkID: string | null): Promise<void> => {
		const path = generatePath(`${window.location.origin}/drink/:id`, {id: drinkID})
		window.navigator.clipboard.writeText(path).then(
			() => {
				toggleShareDialog('green', 'Link copied to clipboard!')
			},
			() => {
				toggleShareDialog('red', 'Oops, something went wrong! Please try again.')
			}
		)
	}

	const handleViewOnClick = (url: string | null) => {
		if (url) {
			window.open(url)?.focus()
		}
	}

	const renderedMobileDrinkImages = (): ReactElement[] => {
		return renderData.map((drink: DrinkDataPoint, index: number) => {
			const isSaved = isDrinkSaved(drink.idDrink)
			const card = (
				<MobileDrinkCard
					drink={drink}
					isSaved={isSaved}
					detailPath={`/drink/${drink.idDrink}`}
					mobileStatePrevPath={location.pathname}
					onShare={handleShareOnClick}
					onSave={handleMobileCardSaveOnClick}
					onVideo={handleViewOnClick}
				/>
			)

			return (
				<ImageListItem key={drink.drinkMapID} id={drink.drinkMapID}>
					{shouldReduceMotion ? (
						card
					) : (
						<motion.div
							custom={index}
							variants={listItemVariants}
							initial="hidden"
							animate="visible"
							style={{height: '100%', width: '100%'}}
						>
							{card}
						</motion.div>
					)}
				</ImageListItem>
			)
		})
	}

	return (
		<Box
			sx={{overflow: 'auto'}}
			id="imageScrollContainer"
			ref={infiniteScrollContainer}
			className="h-full sm:pb-0"
		>
			<ImageList
				variant="standard"
				cols={gridColumnsNum}
				gap={windowWidth <= 640 ? 24 : 8}
				sx={{
					margin: 0,
					width: '100%',
					height: 'auto',
					overflow: 'hidden',
					padding: windowWidth <= 640 ? '12px 16px 20px' : '5px'
				}}
			>
				{windowWidth > 640 ? renderedLargeDrinkImages() : renderedMobileDrinkImages()}
				{windowWidth <= 640 && (
					<>
						<SimpleDialog
							open={dialogState.open}
							dialogTextColor={dialogState.color}
							dialogText={dialogState.text}
							isLoginDialog={false}
						/>
						<SimpleDialog
							open={shareDialogOpen}
							dialogTextColor={shareDialogColor}
							dialogText={shareDialogText}
							isLoginDialog={false}
						/>
						<SimpleDialog
							open={toggleLoginDialog}
							isLoginDialog={true}
							onLoginDialogClose={() => setToggleLoginDialog(false)}
						/>
					</>
				)}
			</ImageList>
		</Box>
	)
}

export default DrinksImageList
