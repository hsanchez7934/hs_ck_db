
import { primaryFont } from '../../fonts/fonts'
import './styles.css'

const SpiritTabs = (props: any) => {
	const {spirit, isActiveTab, setActiveTab} = props

	return (
		<div
			className={`spirit-tab ${isActiveTab ? 'spirit-tab-active' : ''}`}
			onClick={() => setActiveTab(spirit)}
		>
			<p style={{fontFamily: primaryFont}}>{spirit}</p>
		</div>
	)
}

export default SpiritTabs
