import { useState } from 'react';
import { getAssetUrl } from '@/apps/utils';

import classes from './ExamplePage.module.scss';
import { UserApi } from '@/apps/api/user/user.api';
import { FileInput, Button, Image, Text } from '@mantine/core';

function ExamplePage() {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	// 處理圖片選擇
	const handleImageChange = (file: File | null) => {
		setImageFile(file);

		// 產生圖片預覽
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
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
			// 使用 UserApi 上傳圖片
			const response = await UserApi.uploadImage(imageFile);

			console.log('完整回應:', response);
			console.log('回應資料:', response.data);
			console.log('回應狀態:', response.status);

			// 顯示詳細資訊
			if (response.data) {
				const message = response.data.message || '圖片上傳成功！';
				const filename = response.data.filename || imageFile.name;
				alert(`${message}\n檔案名稱: ${filename}`);
				console.log('上傳成功 - 完整資料:', response.data);
			} else {
				alert('圖片上傳成功！（無回應資料）');
				console.warn('警告：回應資料為空');
			}

			// 清空選擇
			setImageFile(null);
			setImagePreview(null);
		} catch (error) {
			console.error('上傳錯誤:', error);
			alert('圖片上傳失敗，請重試');
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<>
			<div className={classes.examplePage}>
				<span>Example Page-test</span>
				<img src={getAssetUrl('/images/vector.png')} />

				{/* 圖片上傳區塊 */}
				<div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
					<FileInput label="傳張圖片給n8n" placeholder="點擊選擇圖片" accept="image/*" value={imageFile} onChange={handleImageChange} />

					{/* 圖片預覽 */}
					{imagePreview && (
						<div>
							<Text size="sm" style={{ marginBottom: '8px' }}>
								預覽：
							</Text>
							<Image src={imagePreview} alt="預覽圖片" style={{ maxWidth: '300px', maxHeight: '300px' }} />
						</div>
					)}

					{/* 上傳按鈕 */}
					<Button onClick={handleUploadImage} disabled={!imageFile || isUploading} loading={isUploading}>
						{isUploading ? '上傳中...' : '上傳到 n8n'}
					</Button>
				</div>
			</div>
		</>
	);
}

export default ExamplePage;
