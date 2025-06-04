import './styles.css'
import React, {ReactElement, useRef} from 'react'
import Box from '@mui/material/Box'
import {DrinkDataPoint} from '../../types'
import {FaHeartCircleMinus, FaHeartCirclePlus, FaEye, FaShare, FaVideo} from 'react-icons/fa6'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import SimpleDialog from '../SimpleDialog/SimpleDialog'
import fetchDrinkDataByID from '../../helper-functions/fetchDrinkDataByID'
import generateUUID from '../../uuid'
import {primaryFont} from '../../fonts/fonts'
import {saveUserDrinkInDB} from '../../firebase/firebase-user-drink-storage'
import {updateIsModalOpen, updateModalDrink, updateDrinkMap} from '../../store'
import {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {updateTriggerRender} from '../../store'
import {updateUserSavedDrinks, updateGetFreshUpdate} from '../../store'
import {useAuth0} from '@auth0/auth0-react'
import {Link, useLocation, generatePath} from 'react-router-dom'
import {DebouncedFunc, set} from 'lodash'

interface Props {
	drinksData: DrinkDataPoint[]
	fetchData?: DebouncedFunc<(fetchSessionStorage: boolean) => Promise<void>>
	isHomePage?: boolean
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
	const {drinksData, fetchData, isHomePage} = props
	const infiniteScrollContainer = useRef(null)
	const {isAuthenticated, user} = useAuth0()
	const location = useLocation()

	const [renderData, setRenderData] = useState([])
	const [toggleLoginDialog, setToggleLoginDialog] = useState(false)
	const [dialogText, setDialogText] = useState('')
	const [dialogTextColor, setDialogTextColor] = useState('')
	const [openSavedStatedDialog, setOpenSavedStateDialog] = useState(false)
	const [observerTarget, setObserverTarget] = useState(null)
	const [gridColumnsNum, setGridColumnsNum] = useState(4)
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)

	const dispatch = useAppDispatch()
	const {userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)
	const {useSavedScrollTop} = useAppSelector(({useSavedScrollTopState}) => useSavedScrollTopState)

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
				if (index === drinksDataToRender.length - 6) {
					setObserverTarget(data.drinkMapID)
				}
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
	}, [drinksData, isAuthenticated, user])

	useEffect(() => {
		if (isHomePage && observerTarget) {
			const options = {
				root: document.querySelector('#imageScrollContainer'),
				rootMargin: '0px',
				threshold: 1.0
			}

			// @ts-expect-error generic
			const callback = (entries) => {
				// @ts-expect-error generic
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (fetchData) {
							fetchData(false)
						}
					}
				})
			}

			const observer = new IntersectionObserver(callback, options)
			if (observerTarget) {
				// @ts-expect-error generic
				observer.observe(document.getElementById(observerTarget))
			}
			return () => observer.disconnect()
		}
	}, [observerTarget])

	useEffect(() => {
		if (window.innerWidth < 500) {
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
		if (window.innerWidth < 500 && useSavedScrollTop && observerTarget) {
			const savedScrollTop = sessionStorage.getItem('savedScrollTop')
			// @ts-expect-error generic
			copy.scrollTo(0, Number(savedScrollTop))
		}
	}, [observerTarget, useSavedScrollTop])

	useEffect(() => {
		const setGridColumns = (width: number) => {
			let columns = 4
			if (width <= 900) {
				columns = 1
			} else if (width <= 1000) {
				columns = 2
			} else if (width <= 1100) {
				columns = 3
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
		const largeDrinkCards = renderData.map((drink: DrinkDataPoint) => {
			return (
				<Link
					key={drink.drinkMapID}
					to={`/drink/${drink.idDrink}`}
					state={{backgroundLocation: location}}
					id={drink.drinkMapID}
				>
					<ImageListItem onClick={() => handleOnClickLargeCard(drink)} key={drink.drinkMapID}>
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

		return largeDrinkCards
	}

	const toggleDialog = (color: string, text: string) => {
		setDialogTextColor(color)
		setDialogText(text)
		setOpenSavedStateDialog(true)
		setTimeout(() => {
			setOpenSavedStateDialog(false)
		}, 1500)
	}

	const handleMobileCardSaveOnClick = (drink: DrinkDataPoint, isSaved: boolean) => {
		if (isAuthenticated) {
			dispatch(updateTriggerRender(true))
			if (!isSaved) {
				const drinks = [...userSavedDrinks]
				drinks.push(drink)
				saveUserDrinkInDB(user?.sub, drinks).then(() => {
					dispatch(updateUserSavedDrinks(drinks))
					dispatch(updateGetFreshUpdate(true))
					toggleDialog('green', 'Saved to favorites!')
				})
			} else {
				const filtered = userSavedDrinks.filter(
					(savedDrink: DrinkDataPoint) => savedDrink.idDrink !== drink.idDrink
				)
				saveUserDrinkInDB(user?.sub, filtered).then(() => {
					dispatch(updateUserSavedDrinks(filtered))
					dispatch(updateGetFreshUpdate(true))
					toggleDialog('red', 'Removed from favorites!')
				})
			}
		} else {
			setToggleLoginDialog(true)
		}
	}

	const renderFavoriteIcons = (drink: DrinkDataPoint, isSaved: boolean) => {
		const renderedSaveIcon =
			isAuthenticated && isSaved ? (
				<FaHeartCirclePlus
					title="Add/Remove from favorites"
					color="red"
					style={{fontSize: '25px'}}
					onClick={() => handleMobileCardSaveOnClick(drink, isSaved)}
				/>
			) : (
				<FaHeartCircleMinus
					title="Add/Remove from favorites"
					color="white"
					style={{fontSize: '25px'}}
					onClick={() => handleMobileCardSaveOnClick(drink, isSaved)}
				/>
			)
		return renderedSaveIcon
	}

	const handleShareOnClick = async (drinkID: string | null): Promise<void> => {
		const path = generatePath(`${window.location.origin}/drink/:id`, {id: drinkID})
		window.navigator.clipboard.writeText(path).then(
			() => {
				toggleDialog('green', 'Link copied to clipboard!')
			},
			() => {
				toggleDialog('red', 'Oops, something went wrong! Please try again.')
			}
		)
	}

	const handleViewOnClick = (url: string | null) => {
		if (url) {
			window.open(url)?.focus()
		}
	}

	const renderedVideoIcon = (drink: DrinkDataPoint) => {
		if (drink.strVideo) {
			return (
				<div
					className="mobile-overlay-action-container"
					style={{borderLeft: '1px solid white', width: '25%'}}
				>
					<FaVideo
						color="white"
						style={{color: 'white', fontSize: '25px'}}
						onClick={() => handleViewOnClick(drink.strVideo)}
					/>
				</div>
			)
		}
	}

	const setActionContainerWidth = (videoUrl: string | null) => {
		return videoUrl ? '25%' : '33.3333333333333%'
	}

	const renderedMobileDrinkImages = (): ReactElement[] => {
		const isDrinkSaved = (drinkID: string | null | undefined) => {
			if (drinkID) {
				const found = userSavedDrinks?.find((drink: DrinkDataPoint) => drink.idDrink === drinkID)
				if (found) {
					return true
				}
			}
			return false
		}
		const mobileDrinkCards = renderData.map((drink: DrinkDataPoint) => {
			const isSaved = isDrinkSaved(drink.idDrink)

			return (
				<ImageListItem key={drink.drinkMapID} id={drink.drinkMapID}>
					<img
						className="mobile-drink-card-image"
						src={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format&dpr=2 2x`}
						srcSet={`${drink.strDrinkThumb}?w=248&fit=crop&auto=format`}
						alt={drink.strDrink || ''}
						loading="lazy"
					/>
					<div className="mobile-overlay-photo-top">
						<p className="mobile-overylay-photo-title" style={{fontFamily: primaryFont}}>
							{drink.strDrink}
						</p>
					</div>
					<div className="mobile-drink-card-bottom">
						<div
							className="mobile-overlay-action-container"
							style={{
								borderRight: '1px solid white',
								width: setActionContainerWidth(drink.strVideo)
							}}
						>
							<FaShare
								style={{color: 'white', fontSize: '25px'}}
								onClick={() => handleShareOnClick(drink.idDrink)}
							/>
						</div>
						<div
							className="mobile-overlay-action-container"
							style={{width: setActionContainerWidth(drink.strVideo)}}
						>
							{renderFavoriteIcons(drink, isSaved)}
						</div>
						<div
							className="mobile-overlay-action-container"
							style={{
								borderLeft: '1px solid white',
								width: setActionContainerWidth(drink.strVideo)
							}}
						>
							<Link
								key={drink.drinkMapID}
								to={`/drink/${drink.idDrink}`}
								state={{
									mobileStatePrevPath: location.pathname
								}}
								style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
							>
								<FaEye
									style={{color: 'white', fontSize: '25px'}}
								/>
							</Link>
						</div>
						{renderedVideoIcon(drink)}
					</div>
				</ImageListItem>
			)
		})

		return mobileDrinkCards
	}

	return (
		<Box
			sx={{overflow: 'auto'}}
			id="imageScrollContainer"
			ref={infiniteScrollContainer}
			className={`h-full ${location.pathname === '/search/byname' ? 'pt-12 pb-16' : ''} md:pt-0 md:pb-0`}
		>
			<ImageList
				variant="standard"
				cols={gridColumnsNum}
				gap={8}
				sx={{margin: 0, padding: '7px', width: '100%', overflow: 'hidden'}}
			>
				{windowWidth >= 901 ? renderedLargeDrinkImages() : renderedMobileDrinkImages()}
				{windowWidth <= 900 && (
					<>
						<SimpleDialog
							open={openSavedStatedDialog}
							dialogTextColor={dialogTextColor}
							dialogText={dialogText}
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
