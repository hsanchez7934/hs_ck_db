import './styles.css'
import {useState, useEffect} from 'react'
import {useFetchDrinksByFirstLetterQuery} from '../../store'
import {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData
} from '../../store'
import {useAppDispatch} from '../../store/hooks'

const AlphtabetPicker = (): JSX.Element => {
	const [searchLetter, setSearchLetter] = useState('a')
	const {data, error, isFetching} = useFetchDrinksByFirstLetterQuery(searchLetter)
	const dispatch = useAppDispatch()

	const alphabet = [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z'
	]

	useEffect(() => {
		dispatch(isFetchingSearchDrinkData(isFetching))
		if (error) {
			dispatch(isErrorFetchingSearchDrinksData(error))
		}
		if (!isFetching && !error) {
			dispatch(updateSearchDrinks(data))
		}
	}, [dispatch, data, error, isFetching])

	const handleClick = (event: any) => {
		const letter = event.target.dataset.value.toLowerCase()
		setSearchLetter(letter)
	}

	return (
		<div style={{backgroundColor: 'black'}}>
			<ul
				style={{
					display: 'flex',
					justifyContent: 'space-evenly',
					listStyleType: 'none',
					padding: 0,
					margin: 0
				}}
			>
				{alphabet.map((letter, index) => {
					return (
						<li
							className={`letter-list-item ${
								searchLetter === letter.toLowerCase() ? 'letter-active' : ''
							}`}
							key={letter}
							onClick={handleClick}
							data-value={letter}
						>
							{letter}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default AlphtabetPicker
