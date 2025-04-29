import React from 'react'
import {primaryFont} from '../../fonts/fonts'
import './styles.css'

type Props = {
	handleOnChange: (event: any) => void
	dropdownValue: string | number
	data: string[]
	labelText: string
	placeholderText: string
	dropDownWidth?: string
}

const DropDown = (props: Props) => {
	const {handleOnChange, dropdownValue, data, labelText, placeholderText, dropDownWidth} = props

	const renderedData = data.map((item: string) => {
		return (
			<option key={item} value={item}>
				{item}
			</option>
		)
	})

	return (
		<div className="dropdown-container">
			<label
				className="truncate"
				title={labelText}
				style={{fontFamily: primaryFont, color: '#fff'}}
			>
				{labelText}
			</label>
			<select
				style={{fontFamily: primaryFont, width: dropDownWidth || 'auto'}}
				// @ts-expect-error generic
				placeholder={placeholderText || ''}
				onChange={handleOnChange}
				value={dropdownValue}
			>
				{renderedData}
			</select>
		</div>
	)
}

export default DropDown
