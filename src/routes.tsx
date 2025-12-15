import { Route, createRoutesFromElements } from 'react-router-dom';
import { Layout, LiffLoginGuard } from '@/apps/layouts';
import { ExamplePage } from '@/apps/pages';

const routes = createRoutesFromElements(
	<Route>
		<Route path="" element={<LiffLoginGuard />}>
			<Route path="/" element={<Layout />}>
				<Route index element={<ExamplePage />} />
			</Route>
		</Route>
	</Route>,
);

export default routes;
