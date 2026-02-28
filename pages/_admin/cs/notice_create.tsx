import React, { useState, useCallback, useEffect } from 'react';
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

// Notice categories
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

// Notice type
interface NoticeData {
	_id: string;
	noticeCategory: string;
	noticeStatus: string;
	noticeTitle: string;
	noticeContent: string;
	noticeImages?: string[];
	createdAt: string;
}

// localStorage key
const NOTICES_STORAGE_KEY = 'furniture_admin_notices';

// Helper functions
const getStoredNotices = (): NoticeData[] => {
	if (typeof window === 'undefined') return [];
	const stored = localStorage.getItem(NOTICES_STORAGE_KEY);
	return stored ? JSON.parse(stored) : [];
};

const saveNotice = (noticeData: NoticeData): void => {
	const notices = getStoredNotices();
	const existingIndex = notices.findIndex((n) => n._id === noticeData._id);

	if (existingIndex >= 0) {
		notices[existingIndex] = noticeData;
	} else {
		notices.unshift(noticeData);
	}

	localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
};

const getNoticeById = (id: string): NoticeData | null => {
	const notices = getStoredNotices();
	return notices.find((n) => n._id === id) || null;
};

const NoticeCreate: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const isEditMode = Boolean(id);

	const [formData, setFormData] = useState({
		noticeCategory: NoticeCategory.GENERAL,
		noticeStatus: NoticeStatus.ACTIVE,
		noticeTitle: '',
		noticeContent: '',
	});
	const [noticeImages, setNoticeImages] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	// Load notice data if editing
	useEffect(() => {
		if (isEditMode && id) {
			const notice = getNoticeById(id as string);
			if (notice) {
				setFormData({
					noticeCategory: notice.noticeCategory as NoticeCategory,
					noticeStatus: notice.noticeStatus as NoticeStatus,
					noticeTitle: notice.noticeTitle,
					noticeContent: notice.noticeContent,
				});
				setNoticeImages(notice.noticeImages || []);
			}
		}
	}, [isEditMode, id]);

	/** HANDLERS **/
	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Image upload handler - converts to base64 for localStorage
	const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const file = files[0];

		if (!file.type.startsWith('image/')) {
			alert('Please upload an image file');
			return;
		}

		if (file.size > 2 * 1024 * 1024) {
			alert('Image size must be less than 2MB (localStorage limit)');
			return;
		}

		// Convert to base64
		const reader = new FileReader();
		reader.onloadend = () => {
			setNoticeImages((prev) => [...prev, reader.result as string]);
		};
		reader.readAsDataURL(file);

		e.target.value = '';
	}, []);

	const handleRemoveImage = (index: number) => {
		setNoticeImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async () => {
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
			const noticeData: NoticeData = {
				_id: isEditMode ? (id as string) : `notice-${Date.now()}`,
				noticeCategory: formData.noticeCategory,
				noticeStatus: formData.noticeStatus,
				noticeTitle: formData.noticeTitle,
				noticeContent: formData.noticeContent,
				noticeImages: noticeImages,
				createdAt: isEditMode
					? getNoticeById(id as string)?.createdAt || new Date().toISOString().split('T')[0]
					: new Date().toISOString().split('T')[0],
			};

			// Save to localStorage
			saveNotice(noticeData);

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
				<Typography variant={'h2'}>{isEditMode ? 'Edit Notice' : 'Create Notice'}</Typography>
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
							<MenuItem value={NoticeStatus.ACTIVE}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<Box
										sx={{
											width: 8,
											height: 8,
											borderRadius: '50%',
											backgroundColor: '#4caf50',
										}}
									/>
									ACTIVE - Visible to all users
								</Box>
							</MenuItem>
							<MenuItem value={NoticeStatus.HOLD}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<Box
										sx={{
											width: 8,
											height: 8,
											borderRadius: '50%',
											backgroundColor: '#ff9800',
										}}
									/>
									HOLD - Hidden from users
								</Box>
							</MenuItem>
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

					{/* Content */}
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
						<Typography
							variant="subtitle1"
							sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
						>
							<ImageIcon /> Notice Images (Optional)
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							Upload images for this notice. Max 2MB per image.
						</Typography>

						<Button
							component="label"
							variant="outlined"
							startIcon={<CloudUploadIcon />}
							sx={{
								mb: 2,
								borderStyle: 'dashed',
								borderWidth: 2,
								borderColor: '#bdbdbd',
								color: '#666',
								py: 2,
								px: 4,
								'&:hover': {
									borderStyle: 'dashed',
									borderWidth: 2,
									borderColor: '#999',
									backgroundColor: 'rgba(0, 0, 0, 0.04)',
								},
							}}
						>
							Upload Image
							<input type="file" hidden accept="image/*" onChange={handleImageUpload} />
						</Button>

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
													backgroundColor: '#424242',
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
								backgroundColor: '#1E3A5F',
								'&:hover': {
									backgroundColor: '#0D1B2A',
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
