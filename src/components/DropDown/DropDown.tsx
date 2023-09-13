import './styles.css'

const DropDown = (props: any) => {
	const {handleOnChange, dropdownValue, data} = props

	const renderedData = data.map((item: any) => {
		return <option value={item}>{item}</option>
	})

	return (
		<div className="dropdown-container">
			<select placeholder="hello there" onChange={handleOnChange} value={dropdownValue}>
				{renderedData}
			</select>
		</div>
	)
}

export default DropDown
