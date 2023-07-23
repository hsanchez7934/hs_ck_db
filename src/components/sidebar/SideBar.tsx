import './styles.css'
import {Link} from 'react-router-dom'
import { FaCocktail } from 'react-icons/fa'

const SideBar: React.FC = () => {
	return (
		<div className="side-bar">
			<nav>
				<div className="logo-container-outer">
					<div className="logo-container-inner">
						<FaCocktail />
					</div>
				</div>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/about">About</Link>
					</li>
					<li>
						<Link to="/dashboard">Dashboard</Link>
					</li>
					<li>
						<Link to="/nothing-here">Nothing Here</Link>
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default SideBar
