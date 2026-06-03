import React from 'react'
import './styles.css'
import {FaSearch} from 'react-icons/fa'

interface Props {
	handleOnClick: () => void
	handleOnInput: (event: React.FormEvent<HTMLInputElement>) => void
	inputValue: string
	isDisabled: boolean
	handleOnKeyDown: (event: React.FormEvent<HTMLInputElement>) => void
}

const SearchInput = (props: Props): JSX.Element => {
	const {handleOnClick, handleOnInput, inputValue, isDisabled, handleOnKeyDown} = props

	return (
		<div className="search-input-container">
			<input
				type="search"
				className="search-input-field"
				placeholder="Search cocktails..."
				onInput={(event) => handleOnInput(event)}
				onKeyDown={(event) => handleOnKeyDown(event)}
				value={inputValue}
				aria-label="Search cocktails by name"
				enterKeyHint="search"
			/>
			<button
				type="button"
				className="search-input-submit"
				onClick={handleOnClick}
				disabled={isDisabled}
				aria-label="Run cocktail search"
				title="Search"
			>
				<FaSearch className="search-input-icon" aria-hidden="true" />
			</button>
		</div>
	)
}

export default SearchInput
