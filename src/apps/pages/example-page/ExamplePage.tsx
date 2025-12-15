import { useState } from 'react';

import { ENV } from '@/apps/global/const';
import { getAssetUrl } from '@/apps/utils';

import classes from './ExamplePage.module.scss';

function ExamplePage() {
	const [description, setDescription] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const imageUrl = getAssetUrl('/images/vector.png');

	const handleDescribeImage = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`${ENV.N8N_BASE_URL}${ENV.N8N_IMAGE_DESCRIBE_PATH}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					imageUrl,
				}),
			});

			if (!response.ok) {
				const errText = await response.text();
				throw new Error(`Request failed ${response.status}: ${errText}`);
			}

			const data = await response.json();

			// 假設 n8n 回傳的欄位名稱是 description，依你的 workflow 調整
			setDescription(data.description ?? JSON.stringify(data));
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className={classes.examplePage}>
				<span>Example Page</span>
				<img src={imageUrl} />

				<button type="button" onClick={handleDescribeImage} disabled={loading}>
					{loading ? '處理中...' : '送到 n8n 進行圖片描述'}
				</button>

				{error && <p>發生錯誤：{error}</p>}
				{description && (
					<p>
						n8n 回傳描述：
						{description}
					</p>
				)}
			</div>
		</>
	);
}

export default ExamplePage;
