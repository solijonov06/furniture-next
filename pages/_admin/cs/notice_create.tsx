import React, { useState, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
	Box,
	Button,
	Stack,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Typography,
	IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

// Notice categories - adjust based on your backend enum
enum NoticeCategory {
	GENERAL = 'GENERAL',
	EVENT = 'EVENT',
	UPDATE = 'UPDATE',
	MAINTENANCE = 'MAINTENANCE',
}

enum NoticeStatus {
	ACTIVE = 'ACTIVE',
	HOLD = 'HOLD',
}

const NoticeCreate: NextPage = () => {
	const router = useRouter();
	const { id } = router.query; // For edit mode
	const isEditMode = Boolean(id);

	const [formData, setFormData] = useState({
		noticeCategory: NoticeCategory.GENERAL,
		noticeStatus: NoticeStatus.ACTIVE,
		noticeTitle: '',
		noticeContent: '',
	});
	const [noticeImages, setNoticeImages] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	/** HANDLERS **/
	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Image upload handler
	const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		
		// Validate file type
		if (!file.type.startsWith('image/')) {
			alert('Please upload an image file');
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert('Image size must be less than 5MB');
			return;
		}

		// For now, create a local preview URL
		// When backend is ready, this should upload to server and return URL
		const previewUrl = URL.createObjectURL(file);
		setNoticeImages((prev) => [...prev, previewUrl]);

		// TODO: Implement actual file upload to backend
		// const formData = new FormData();
		// formData.append('file', file);
		// formData.append('type', 'notice');
		// const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
		//   method: 'POST',
		//   body: formData,
		// });
		// const data = await response.json();
		// setNoticeImages((prev) => [...prev, data.url]);

		// Reset input
		e.target.value = '';
	}, []);

	const handleRemoveImage = (index: number) => {
		setNoticeImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async () => {
		// Validate
		if (!formData.noticeTitle.trim()) {
			alert('Please enter a title');
			return;
		}
		if (!formData.noticeContent.trim()) {
			alert('Please enter content');
			return;
		}

		setLoading(true);
		try {
			// TODO: Implement GraphQL mutation when backend is ready
			// const input = {
			//   ...formData,
			//   noticeImages: noticeImages,
			// };
			// if (isEditMode) {
			//   await updateNotice({ variables: { input: { _id: id, ...input } } });
			// } else {
			//   await createNotice({ variables: { input } });
			// }
			
			console.log('Notice data:', { ...formData, noticeImages });
			alert(isEditMode ? 'Notice updated successfully!' : 'Notice created successfully!');
			router.push('/_admin/cs/notice');
		} catch (error) {
			console.error('Error saving notice:', error);
			alert('Failed to save notice');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>
					{isEditMode ? 'Edit Notice' : 'Create Notice'}
				</Typography>
				<Button
					variant={'outlined'}
					size={'medium'}
					onClick={() => router.push('/_admin/cs/notice')}
					startIcon={<ArrowBackIcon />}
				>
					Back to List
				</Button>
			</Box>

			<Box
				component={'div'}
				sx={{
					mt: 3,
					p: 4,
					backgroundColor: 'background.paper',
					borderRadius: 2,
					boxShadow: 1,
				}}
			>
				<Stack spacing={3}>
					{/* Category Selection */}
					<FormControl fullWidth>
						<InputLabel>Category</InputLabel>
						<Select
							value={formData.noticeCategory}
							label="Category"
							onChange={(e) => handleInputChange('noticeCategory', e.target.value)}
						>
							{Object.values(NoticeCategory).map((category) => (
								<MenuItem key={category} value={category}>
									{category}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Status Selection */}
					<FormControl fullWidth>
						<InputLabel>Status</InputLabel>
						<Select
							value={formData.noticeStatus}
							label="Status"
							onChange={(e) => handleInputChange('noticeStatus', e.target.value)}
						>
							{Object.values(NoticeStatus).map((status) => (
								<MenuItem key={status} value={status}>
									{status}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Title */}
					<TextField
						fullWidth
						label="Title"
						value={formData.noticeTitle}
						onChange={(e) => handleInputChange('noticeTitle', e.target.value)}
						placeholder="Enter notice title"
						required
					/>

					{/* Content - Fixed multiline textarea */}
					<TextField
						fullWidth
						label="Content"
						value={formData.noticeContent}
						onChange={(e) => handleInputChange('noticeContent', e.target.value)}
						placeholder="Enter notice content..."
						multiline
						minRows={6}
						maxRows={15}
						required
						InputProps={{
							sx: {
								alignItems: 'flex-start',
							},
						}}
						sx={{
							'& .MuiInputBase-root': {
								alignItems: 'flex-start',
							},
							'& .MuiInputBase-input': {
								overflow: 'auto !important',
							},
						}}
					/>

					{/* Image Upload Section */}
					<Box>
						<Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
							<ImageIcon /> Notice Images (Optional)
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							Upload images that will be displayed to all users viewing this notice. Max 5MB per image.
						</Typography>
						
						{/* Upload Button */}
						<Button
							component="label"
							variant="outlined"
							startIcon={<CloudUploadIcon />}
							sx={{
								mb: 2,
								borderStyle: 'dashed',
								borderWidth: 2,
								py: 2,
								px: 4,
								'&:hover': {
									borderStyle: 'dashed',
									borderWidth: 2,
									backgroundColor: 'rgba(244, 67, 54, 0.04)',
								},
							}}
						>
							Upload Image
							<input
								type="file"
								hidden
								accept="image/*"
								onChange={handleImageUpload}
							/>
						</Button>

						{/* Image Preview Grid */}
						{noticeImages.length > 0 && (
							<Box
								sx={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
									gap: 2,
									mt: 2,
								}}
							>
								{noticeImages.map((image, index) => (
									<Box
										key={index}
										sx={{
											position: 'relative',
											aspectRatio: '1',
											borderRadius: 2,
											overflow: 'hidden',
											border: '1px solid #ddd',
										}}
									>
										<img
											src={image}
											alt={`Notice image ${index + 1}`}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
											}}
										/>
										<IconButton
											size="small"
											onClick={() => handleRemoveImage(index)}
											sx={{
												position: 'absolute',
												top: 4,
												right: 4,
												backgroundColor: 'rgba(255, 255, 255, 0.9)',
												'&:hover': {
													backgroundColor: '#f44336',
													color: 'white',
												},
											}}
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Box>
								))}
							</Box>
						)}
					</Box>

					{/* Submit Button */}
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
						<Button
							variant="outlined"
							onClick={() => router.push('/_admin/cs/notice')}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							onClick={handleSubmit}
							disabled={loading}
							startIcon={<SaveIcon />}
							sx={{
								backgroundColor: '#f44336',
								'&:hover': {
									backgroundColor: '#d32f2f',
								},
							}}
						>
							{loading ? 'Saving...' : isEditMode ? 'Update Notice' : 'Create Notice'}
						</Button>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
};

export default withAdminLayout(NoticeCreate);
