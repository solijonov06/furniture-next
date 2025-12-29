import React, { useState } from 'react';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

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
	const [loading, setLoading] = useState(false);

	/** HANDLERS **/
	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
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
			// if (isEditMode) {
			//   await updateNotice({ variables: { input: { _id: id, ...formData } } });
			// } else {
			//   await createNotice({ variables: { input: formData } });
			// }
			
			console.log('Notice data:', formData);
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

					{/* Content */}
					<TextField
						fullWidth
						label="Content"
						value={formData.noticeContent}
						onChange={(e) => handleInputChange('noticeContent', e.target.value)}
						placeholder="Enter notice content"
						multiline
						rows={8}
						required
					/>

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

