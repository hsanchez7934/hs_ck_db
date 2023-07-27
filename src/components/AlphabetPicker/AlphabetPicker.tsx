import './styles.css'
import {useState, useEffect} from 'react'
import {FaCircle} from 'react-icons/fa'
import {secondary} from '../../colors/colors'
import {useFetchDrinkByNameQuery} from '../../store'
import {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData
} from '../../store'
import {useAppDispatch} from '../../store/hooks'

const AlphtabetPicker = () => {
	const [searchLetter, setSearchLetter] = useState('a')
	const {data, error, isFetching} = useFetchDrinkByNameQuery(searchLetter)
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
		<div style={{backgroundColor: 'white'}}>
			<ul
				style={{
					display: 'flex',
					justifyContent: 'space-evenly',
					listStyleType: 'none',
					padding: '0'
				}}
			>
				{alphabet.map((letter, index) => {
					return (
						<li className="letter-list-item" key={letter} onClick={handleClick} data-value={letter}>
							{letter}
							{index !== alphabet.length - 1 ? (
								<FaCircle style={{fontSize: '5px', marginLeft: '10px', color: secondary}} />
							) : (
								<></>
							)}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default AlphtabetPicker
