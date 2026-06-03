import React from 'react'
import {FaChevronDown} from 'react-icons/fa6'
import './styles.css'

type Props = {
	handleOnChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
	dropdownValue: string | number
	data: string[]
	labelText: string
	placeholderText?: string
	dropDownWidth?: string
	variant?: 'default' | 'toolbar'
	className?: string
	id?: string
}

const DropDown = (props: Props): JSX.Element => {
	const {
		handleOnChange,
		dropdownValue,
		data,
		labelText,
		placeholderText,
		dropDownWidth,
		variant = 'default',
		className = '',
		id
	} = props

	const selectId = id || `dropdown-${labelText.replace(/\s+/g, '-').toLowerCase()}`
	const isToolbar = variant === 'toolbar'

	const renderedData = data.map((item: string) => (
		<option key={item} value={item}>
			{item}
		</option>
	))

	return (
		<div
			className={`dropdown-container dropdown-container--${variant} ${className}`.trim()}
			style={dropDownWidth && !isToolbar ? {['--dropdown-width' as string]: dropDownWidth} : undefined}
		>
			<label
				className={isToolbar ? 'dropdown-label dropdown-label--sr-only' : 'dropdown-label'}
				htmlFor={selectId}
				title={labelText}
			>
				{labelText}
			</label>
			<div className="dropdown-select-wrap">
				<select
					id={selectId}
					className="dropdown-select"
					onChange={handleOnChange}
					value={dropdownValue}
					aria-label={isToolbar ? labelText : undefined}
				>
					{placeholderText && data.length === 0 && (
						<option value="" disabled>
							{placeholderText}
						</option>
					)}
					{renderedData}
				</select>
				<FaChevronDown className="dropdown-chevron" aria-hidden="true" />
			</div>
		</div>
	)
}

export default DropDown
