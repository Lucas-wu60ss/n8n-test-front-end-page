import { useState } from 'react';
import { getAssetUrl } from '@/apps/utils';

import classes from './ExamplePage.module.scss';
import { UserApi } from '@/apps/api/user/user.api';
import { FileInput, Button, Image, Text } from '@mantine/core';

function stripEq(v: any) {
	return typeof v === 'string' ? v.replace(/^=+/, '').trim() : v;
}

function toDataUrl(resp: any) {
	const mime = stripEq(resp?.image_mime) || 'image/png';
	const b64 = stripEq(resp?.image_base64) || '';

	if (!b64) return null;
	if (b64.startsWith('data:')) return b64;

	return `data:${mime};base64,${b64}`;
}

function ExamplePage() {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null); // 本地預覽
	const [removedPreview, setRemovedPreview] = useState<string | null>(null); // ✅ 去背後預覽
	const [isUploading, setIsUploading] = useState(false);
	const [description, setDescription] = useState<string>(''); // ✅ description 文字

	// 處理圖片選擇
	const handleImageChange = (file: File | null) => {
		setImageFile(file);

		// 換圖時，把上次結果清掉
		setRemovedPreview(null);
		setDescription('');

		// 產生圖片預覽
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result as string);
			reader.readAsDataURL(file);
		} else {
			setImagePreview(null);
		}
	};

	// 上傳圖片到 API (n8n)
	const handleUploadImage = async () => {
		if (!imageFile) {
			alert('請先選擇圖片');
			return;
		}

		setIsUploading(true);

		try {
			const response = await UserApi.uploadImage(imageFile);

			console.log('raw response.data:', response.data);
			console.log('typeof data:', typeof response.data);
			console.log('data keys:', response.data && typeof response.data === 'object' ? Object.keys(response.data) : 'not object');

			const raw = response.data;
			const obj =
				typeof raw === 'string'
					? (() => {
							try {
								return JSON.parse(raw);
							} catch {
								return {};
							}
						})()
					: (raw?.body ?? raw?.data ?? raw ?? {});

			console.log('normalized obj keys:', Object.keys(obj));

			setDescription(stripEq(obj.description) || '');

			const imgSrc = toDataUrl(obj);
			console.log('mime:', stripEq(obj.image_mime));
			console.log('b64 length:', stripEq(obj.image_base64)?.length);
			console.log('imgSrc head:', imgSrc?.slice(0, 80));

			setRemovedPreview(imgSrc);
		} catch (e) {
			console.error(e);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className={classes.examplePage}>
			<span>Example Page-test</span>
			<img src={getAssetUrl('/images/vector.png')} />

			<div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
				<FileInput label="傳張圖片給n8n" placeholder="點擊選擇圖片" accept="image/*" value={imageFile} onChange={handleImageChange} />

				{/* 本地預覽 */}
				{/* {imagePreview && ( */}
				<div>
					<Text size="sm" style={{ marginBottom: '8px' }}>
						原圖預覽：
					</Text>
					<Image src={imagePreview} alt="原圖預覽" style={{ maxWidth: '300px', maxHeight: '300px' }} />
				</div>
				{/* )} */}

				{/* ✅ 去背後預覽 */}
				{/* {removedPreview && ( */}
				<div>
					<Text size="sm" mb={8}>
						去背後（n8n 回傳）：
					</Text>

					{removedPreview ? (
						<img
							src={removedPreview}
							alt="去背後圖片"
							style={{ maxWidth: 300, maxHeight: 300, border: '1px solid #ccc' }}
							onError={(e) => console.log('img onError', e)}
							onLoad={() => console.log('img onLoad ok')}
						/>
					) : (
						<Text c="dimmed">removedPreview 是空的</Text>
					)}
				</div>

				{/* )} */}

				<Button onClick={handleUploadImage} disabled={!imageFile || isUploading} loading={isUploading}>
					{isUploading ? '上傳中...' : '上傳到 n8n'}
				</Button>

				{!!description && <Text>description：{description}</Text>}
			</div>
		</div>
	);
}

export default ExamplePage;
