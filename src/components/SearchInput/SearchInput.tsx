import './styles.css'
import {useState} from 'react'
import {FaSearch} from 'react-icons/fa'

interface Props {
	handleOnClick: () => void,
	handleOnInput: (event: React.FormEvent<HTMLInputElement>) => void,
	inputValue: string;
	isDisabled: boolean;
}

const SearchInput = (props: Props) => {
	const {handleOnClick, handleOnInput, inputValue, isDisabled} = props
	const [iconColor, setIconColor] = useState('#ececec')

	const handleOnMouseEnter = () => {
		setIconColor('black')
	}

	const handleOnMouseLeave = () => {
		setIconColor('#ececec')
	}

	return (
		<div className="search-input-container">
			<input
				type="text"
				placeholder="Search for a cocktail..."
				onInput={(event) => handleOnInput(event)}
				value={inputValue}
			/>
			<button
				onMouseLeave={handleOnMouseLeave}
				onMouseEnter={handleOnMouseEnter}
				onClick={handleOnClick}
				disabled={isDisabled}
			>
				<FaSearch style={{fontSize: '18px', color: iconColor}} />
			</button>
		</div>
	)
}

export default SearchInput
