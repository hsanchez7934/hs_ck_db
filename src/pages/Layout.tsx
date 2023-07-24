import SideBar from '../components/SideBar';
import { matchPath } from 'react-router-dom';

const Layout: React.FC = (props) => {

	console.log(props)
	return <div className='full layout'><SideBar></SideBar></div>
}

export default Layout
