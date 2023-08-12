
import { secondaryFont } from '../../fonts/fonts'
import './styles.css'

const SpiritCard = (props: any) => {
	const {spirit, isActiveTab, setActiveTab} = props

	return (
		<div
			className={`spirit-tab ${isActiveTab ? 'spirit-tab-active' : ''}`}
			onClick={() => setActiveTab(spirit)}
		>
			<p style={{fontFamily: secondaryFont}}>{spirit}</p>
		</div>
	)
}

export default SpiritCard
