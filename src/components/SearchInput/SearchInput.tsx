import './styles.css'
import {FaSearch} from 'react-icons/fa'

interface Props {
	handleOnClick: () => void,
	handleOnInput: (event: React.FormEvent<HTMLInputElement>) => void,
	inputValue: string;
	isDisabled: boolean;
}

const SearchInput = (props: Props) => {
	const {handleOnClick, handleOnInput, inputValue, isDisabled} = props

	return (
		<div className="search-input-container">
			<input
				type="text"
				placeholder="Search for a cocktail..."
				onInput={(event) => handleOnInput(event)}
				value={inputValue}
			/>
			<button
				onClick={handleOnClick}
				disabled={isDisabled}
			>
				<FaSearch style={{fontSize: '18px'}} />
			</button>
		</div>
	)
}

export default SearchInput
