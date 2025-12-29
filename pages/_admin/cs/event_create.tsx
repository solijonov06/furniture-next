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
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Event status
enum EventStatus {
	ACTIVE = 'ACTIVE',
	HOLD = 'HOLD',
}

const EventCreate: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const isEditMode = Boolean(id);

	const [formData, setFormData] = useState({
		eventTitle: '',
		eventCity: '',
		eventDescription: '',
		eventLink: '',
		eventStatus: EventStatus.ACTIVE,
	});
	const [eventImage, setEventImage] = useState<string | null>(null);
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

		// Create preview URL
		const previewUrl = URL.createObjectURL(file);
		setEventImage(previewUrl);

		// TODO: Upload to server when backend is ready
		// const formData = new FormData();
		// formData.append('file', file);
		// formData.append('type', 'event');
		// const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
		//   method: 'POST',
		//   body: formData,
		// });
		// const data = await response.json();
		// setEventImage(data.url);

		e.target.value = '';
	}, []);

	const handleRemoveImage = () => {
		setEventImage(null);
	};

	const handleSubmit = async () => {
		// Validate
		if (!formData.eventTitle.trim()) {
			alert('Please enter event title');
			return;
		}
		if (!formData.eventCity.trim()) {
			alert('Please enter event city');
			return;
		}
		if (!formData.eventDescription.trim()) {
			alert('Please enter event description');
			return;
		}
		if (!eventImage) {
			alert('Please upload an event image');
			return;
		}

		setLoading(true);
		try {
			// TODO: Implement GraphQL mutation when backend is ready
			// const input = {
			//   ...formData,
			//   eventImage: eventImage,
			// };
			// if (isEditMode) {
			//   await updateEvent({ variables: { input: { _id: id, ...input } } });
			// } else {
			//   await createEvent({ variables: { input } });
			// }

			console.log('Event data:', { ...formData, eventImage });
			alert(isEditMode ? 'Event updated successfully!' : 'Event created successfully!');
			router.push('/_admin/cs/events');
		} catch (error) {
			console.error('Error saving event:', error);
			alert('Failed to save event');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>{isEditMode ? 'Edit Event' : 'Create Event'}</Typography>
				<Button
					variant={'outlined'}
					size={'medium'}
					onClick={() => router.push('/_admin/cs/events')}
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
					{/* Event Image Upload - REQUIRED */}
					<Box>
						<Typography
							variant="subtitle1"
							sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
						>
							<ImageIcon /> Event Banner Image *
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							This image will be displayed as the event banner on the homepage. Recommended size:
							800x600px
						</Typography>

						{eventImage ? (
							<Box
								sx={{
									position: 'relative',
									width: '100%',
									maxWidth: 400,
									aspectRatio: '4/3',
									borderRadius: 2,
									overflow: 'hidden',
									border: '2px solid #ddd',
								}}
							>
								<img
									src={eventImage}
									alt="Event banner"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
								<IconButton
									size="small"
									onClick={handleRemoveImage}
									sx={{
										position: 'absolute',
										top: 8,
										right: 8,
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
						) : (
						<Button
							component="label"
							variant="outlined"
							startIcon={<CloudUploadIcon />}
							sx={{
								borderStyle: 'dashed',
								borderWidth: 2,
								borderColor: '#bdbdbd',
								color: '#666',
								py: 4,
								px: 6,
								width: '100%',
								maxWidth: 400,
								'&:hover': {
									borderStyle: 'dashed',
									borderWidth: 2,
									borderColor: '#999',
									backgroundColor: 'rgba(0, 0, 0, 0.04)',
								},
							}}
						>
							Upload Event Image
							<input type="file" hidden accept="image/*" onChange={handleImageUpload} />
						</Button>
						)}
					</Box>

					{/* Event Title */}
					<TextField
						fullWidth
						label="Event Title"
						value={formData.eventTitle}
						onChange={(e) => handleInputChange('eventTitle', e.target.value)}
						placeholder="e.g., Design Week 2025"
						required
					/>

					{/* Event City */}
					<TextField
						fullWidth
						label="Event City / Location"
						value={formData.eventCity}
						onChange={(e) => handleInputChange('eventCity', e.target.value)}
						placeholder="e.g., New York"
						required
						InputProps={{
							startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />,
						}}
					/>

					{/* Event Description */}
					<TextField
						fullWidth
						label="Event Description"
						value={formData.eventDescription}
						onChange={(e) => handleInputChange('eventDescription', e.target.value)}
						placeholder="Brief description of the event..."
						multiline
						minRows={4}
						maxRows={8}
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

					{/* Event Link (Optional) */}
					<TextField
						fullWidth
						label="Event Link (Optional)"
						value={formData.eventLink}
						onChange={(e) => handleInputChange('eventLink', e.target.value)}
						placeholder="https://example.com/event-details"
						InputProps={{
							startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
						}}
						helperText="Users will be redirected to this link when clicking the event"
					/>

					{/* Status Selection */}
					<FormControl fullWidth>
						<InputLabel>Status</InputLabel>
						<Select
							value={formData.eventStatus}
							label="Status"
							onChange={(e) => handleInputChange('eventStatus', e.target.value)}
						>
							<MenuItem value={EventStatus.ACTIVE}>
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
							<MenuItem value={EventStatus.HOLD}>
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

					{/* Submit Button */}
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
						<Button
							variant="outlined"
							onClick={() => router.push('/_admin/cs/events')}
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
							{loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
						</Button>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
};

export default withAdminLayout(EventCreate);

