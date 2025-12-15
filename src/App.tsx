import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AxiosIntercetorProvider } from '@/apps/api';

import routes from './routes';

function App() {
	// 禁止雙指縮放
	const preventMultiTouchZoom = () => {
		const preventMultiTouch = (event: TouchEvent) => {
			if (event.touches.length >= 2) {
				event.preventDefault();
			}
		};

		// 添加事件監聽器
		document.addEventListener('touchstart', preventMultiTouch, {
			passive: false,
		});
		document.addEventListener('touchmove', preventMultiTouch, {
			passive: false,
		});
		document.addEventListener('touchend', preventMultiTouch, {
			passive: false,
		});

		// 返回一個清理函數來移除監聽器
		return () => {
			document.removeEventListener('touchstart', preventMultiTouch);
			document.removeEventListener('touchmove', preventMultiTouch);
			document.removeEventListener('touchend', preventMultiTouch);
		};
	};

	useEffect(() => {
		preventMultiTouchZoom();
	}, []);

	return (
		<AxiosIntercetorProvider>
			<RouterProvider router={createBrowserRouter(routes)} />
		</AxiosIntercetorProvider>
	);
}

export default App;
