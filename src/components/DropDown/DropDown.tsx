import {primaryFont} from '../../fonts/fonts'
import './styles.css'

type Props = {
	handleOnChange: (event: any) => void
	dropdownValue: string | number
	data: string[]
	labelText: string
	placeholderText: string
	parentContainerWidth?: number
	hideLabel: boolean
}

const DropDown = (props: Props) => {
	const {hideLabel, handleOnChange, dropdownValue, data, labelText, placeholderText, parentContainerWidth} =
		props

	const renderedData = data.map((item: string) => {
		return (
			<option key={item} value={item}>
				{item}
			</option>
		)
	})

	const renderedLabel = hideLabel ? (
		<></>
	) : (
		<label className="truncate" title={labelText} style={{fontFamily: primaryFont, color: '#fff'}}>
			{labelText}
		</label>
	)

	const width = parentContainerWidth ? `${parentContainerWidth}px` : '100%'

	return (
		<div className="dropdown-container" style={{width}}>
			{renderedLabel}
			<select
				style={{fontFamily: primaryFont, color: '#fff'}}
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
