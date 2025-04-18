import React from 'react'
import './styles.css'
import {FaSearch} from 'react-icons/fa'

interface Props {
	handleOnClick: () => void,
	handleOnInput: (event: React.FormEvent<HTMLInputElement>) => void,
	inputValue: string;
	isDisabled: boolean;
	handleOnKeyDown: (event: React.FormEvent<HTMLInputElement>) => void;
}

const SearchInput = (props: Props) => {
	const {handleOnClick, handleOnInput, inputValue, isDisabled, handleOnKeyDown} = props

	return (
		<div className="search-input-container">
			<input
				type="text"
				placeholder="Search for a cocktail..."
				onInput={(event) => handleOnInput(event)}
				onKeyDown={(event) => handleOnKeyDown(event)}
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
