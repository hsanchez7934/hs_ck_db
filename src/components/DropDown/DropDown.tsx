import { primaryFont } from '../../fonts/fonts'
import './styles.css'

type Props = {
	handleOnChange: (event: any) => void;
	dropdownValue: string | number;
	data: string[];
	labelText: string;
	placeholderText: string;
}

const DropDown = (props: Props) => {
	const {handleOnChange, dropdownValue, data, labelText, placeholderText} = props

	const renderedData = data.map((item: any) => {
		return <option value={item}>{item}</option>
	})

	return (
		<div className="dropdown-container">
			<label style={{fontFamily: primaryFont}}>{labelText}</label>
			<select style={{fontFamily: primaryFont}} placeholder={placeholderText|| ''} onChange={handleOnChange} value={dropdownValue}>
				{renderedData}
			</select>
		</div>
	)
}

export default DropDown
