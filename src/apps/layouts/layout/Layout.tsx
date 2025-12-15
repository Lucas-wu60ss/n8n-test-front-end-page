import { Outlet } from 'react-router-dom';

import classes from './Layout.module.scss';

function Layout() {
	return (
		<div className={classes.layout}>
			<div className={classes.header}>Header</div>
			<Outlet />
		</div>
	);
}

export default Layout;
