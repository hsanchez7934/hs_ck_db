import './styles.css'

type Props = {
	title: string
	className?: string
}

const SectionHeading = ({title, className = ''}: Props): JSX.Element => (
	<div className={`section-heading ${className}`.trim()}>
		<span className="section-heading-accent" aria-hidden="true" />
		<h2 className="section-heading-title">{title}</h2>
	</div>
)

export default SectionHeading
