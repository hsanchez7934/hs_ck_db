import './styles.css'
import React, {useCallback, useEffect, useState} from 'react'
import {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData,
	updateIsKeywordSearch,
	updateSearchKeyword,
	updateUseSavedScrollTop
} from '../../store'
import {useAppDispatch} from '../../store/hooks'
import axios from 'axios'
import {ActionCreatorWithPayload} from '@reduxjs/toolkit'
import {motion, useReducedMotion} from 'framer-motion'

interface Props {
	isKeywordSearch: boolean
	updateClearHeaderSearchInputText: ActionCreatorWithPayload<
		boolean,
		'searchDrinks/updateClearHeaderSearchInputText'
	>
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const AlphtabetPicker = (props: Props): JSX.Element => {
	const {isKeywordSearch, updateClearHeaderSearchInputText: clearHeaderSearchInputText} = props
	const [searchLetter, setSearchLetter] = useState(
		sessionStorage.getItem('savedAlphaPickerLetter') || 'A'
	)
	const dispatch = useAppDispatch()
	const shouldReduceMotion = useReducedMotion()

	const fetchData = useCallback(
		(letter: string) => {
			dispatch(isFetchingSearchDrinkData(true))
			axios
				.get(
					`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/search.php?f=${letter}`
				)
				.then((response) => {
					dispatch(updateSearchDrinks(response.data))
					dispatch(isFetchingSearchDrinkData(false))
				})
				.catch((error) => {
					dispatch(isFetchingSearchDrinkData(false))
					if (error) {
						dispatch(isErrorFetchingSearchDrinksData(error))
					}
				})
		},
		[dispatch]
	)

	useEffect(() => {
		if (!isKeywordSearch) {
			const savedKeyword = sessionStorage.getItem('savedSearchKeyword')
			if (savedKeyword) {
				return
			}
			fetchData(searchLetter)
		}
	}, [isKeywordSearch, searchLetter, fetchData])

	const handleLetterSelect = (letter: string) => {
		setSearchLetter(letter)
		sessionStorage.setItem('savedAlphaPickerLetter', letter)
		dispatch(updateUseSavedScrollTop(false))
		dispatch(updateIsKeywordSearch(false))
		dispatch(updateSearchKeyword(''))
		dispatch(clearHeaderSearchInputText(true))
	}

	return (
		<nav className="alphabet-picker" aria-label="Browse cocktails by letter">
			<div className="alphabet-picker-header">
				<p className="alphabet-picker-eyebrow">Browse by letter</p>
				<span className="alphabet-picker-active-badge" aria-live="polite">
					{isKeywordSearch ? 'Keyword search active' : `Showing: ${searchLetter}`}
				</span>
			</div>
			<div className="alphabet-picker-track">
				<ul className="alphabet-picker-list">
					{ALPHABET.map((letter) => {
						const isActive = searchLetter === letter && !isKeywordSearch

						return (
							<li key={letter} className="alphabet-picker-item">
								<button
									type="button"
									className={`alphabet-picker-letter${isActive ? ' is-active' : ''}`}
									onClick={() => handleLetterSelect(letter)}
									aria-pressed={isActive}
									aria-label={`Browse cocktails starting with ${letter}`}
								>
									{letter}
									{isActive && !shouldReduceMotion && (
										<motion.span
											className="alphabet-picker-letter-glow"
											layoutId="alphabet-picker-active"
											transition={{type: 'spring', stiffness: 420, damping: 34}}
										/>
									)}
								</button>
							</li>
						)
					})}
				</ul>
			</div>
		</nav>
	)
}

export default AlphtabetPicker
