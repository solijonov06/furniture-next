import React, { useState } from 'react';
import {
	Stack,
	Box,
	TextField,
	Button,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Typography,
	Alert,
	Snackbar,
	CircularProgress,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { InquiryCategory } from '../../types/cs/inquiry';
import { InquiryInput } from '../../types/cs/inquiry.input';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

const categoryLabels: Record<InquiryCategory, string> = {
	[InquiryCategory.PRODUCT]: 'Product Inquiry',
	[InquiryCategory.PAYMENT]: 'Payment Issue',
	[InquiryCategory.DELIVERY]: 'Delivery & Shipping',
	[InquiryCategory.RETURN]: 'Return & Refund',
	[InquiryCategory.ACCOUNT]: 'Account Issue',
	[InquiryCategory.OTHER]: 'Other',
};

const Inquiry = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState<InquiryInput>({
		inquiryCategory: InquiryCategory.PRODUCT,
		inquiryTitle: '',
		inquiryContent: '',
		inquiryEmail: '',
		inquiryPhone: user?.memberPhone || '',
	});

	const [errors, setErrors] = useState<Partial<Record<keyof InquiryInput, string>>>({});

	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof InquiryInput, string>> = {};

		if (!formData.inquiryTitle.trim()) {
			newErrors.inquiryTitle = 'Subject is required';
		}

		if (!formData.inquiryContent.trim()) {
			newErrors.inquiryContent = 'Message is required';
		} else if (formData.inquiryContent.trim().length < 20) {
			newErrors.inquiryContent = 'Message must be at least 20 characters';
		}

		if (!formData.inquiryEmail.trim()) {
			newErrors.inquiryEmail = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.inquiryEmail)) {
			newErrors.inquiryEmail = 'Please enter a valid email';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: keyof InquiryInput, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);
		setError(null);

		try {
			// Simulate API call (replace with actual mutation when backend is ready)
			// await createInquiry({ variables: { input: formData } });
			
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setSuccess(true);
			// Reset form
			setFormData({
				inquiryCategory: InquiryCategory.PRODUCT,
				inquiryTitle: '',
				inquiryContent: '',
				inquiryEmail: '',
				inquiryPhone: user?.memberPhone || '',
			});
		} catch (err: any) {
			setError(err.message || 'Failed to submit inquiry. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'inquiry-content mobile'}>
				<Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
					Contact Us
				</Typography>
				<form onSubmit={handleSubmit}>
					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel>Category</InputLabel>
						<Select
							value={formData.inquiryCategory}
							label="Category"
							onChange={(e) => handleInputChange('inquiryCategory', e.target.value as InquiryCategory)}
						>
							{Object.entries(categoryLabels).map(([value, label]) => (
								<MenuItem key={value} value={value}>
									{label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						fullWidth
						label="Subject"
						value={formData.inquiryTitle}
						onChange={(e) => handleInputChange('inquiryTitle', e.target.value)}
						error={!!errors.inquiryTitle}
						helperText={errors.inquiryTitle}
						sx={{ mb: 2 }}
					/>

					<TextField
						fullWidth
						label="Email"
						type="email"
						value={formData.inquiryEmail}
						onChange={(e) => handleInputChange('inquiryEmail', e.target.value)}
						error={!!errors.inquiryEmail}
						helperText={errors.inquiryEmail}
						sx={{ mb: 2 }}
					/>

					<TextField
						fullWidth
						label="Phone (Optional)"
						value={formData.inquiryPhone}
						onChange={(e) => handleInputChange('inquiryPhone', e.target.value)}
						sx={{ mb: 2 }}
					/>

					<TextField
						fullWidth
						label="Message"
						multiline
						rows={4}
						value={formData.inquiryContent}
						onChange={(e) => handleInputChange('inquiryContent', e.target.value)}
						error={!!errors.inquiryContent}
						helperText={errors.inquiryContent}
						sx={{ mb: 3 }}
					/>

					<Button
						type="submit"
						variant="contained"
						fullWidth
						disabled={loading}
						sx={{
							py: 1.5,
							backgroundColor: '#D4A853',
							'&:hover': { backgroundColor: '#B8923D' },
						}}
					>
						{loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Inquiry'}
					</Button>
				</form>
			</Stack>
		);
	}

	return (
		<Stack className={'inquiry-content'}>
			<div className={'inquiry-wrapper'}>
				{/* Left Side - Contact Info */}
				<div className={'contact-info'}>
					<div className={'info-header'}>
						<SupportAgentIcon sx={{ fontSize: 48, color: '#D4A853', marginBottom: '16px' }} />
						<Typography variant="h4" sx={{ fontWeight: 700, color: '#1E3A5F', mb: 1 }}>
							Get in Touch
						</Typography>
						<Typography sx={{ color: '#717171', mb: 4 }}>
							Have a question or need help? We're here for you!
						</Typography>
					</div>

					<div className={'info-items'}>
						<div className={'info-item'}>
							<div className={'icon-box'}>
								<EmailOutlinedIcon />
							</div>
							<div>
								<Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1E3A5F' }}>
									Email Us
								</Typography>
								<Typography variant="body2" sx={{ color: '#717171' }}>
									support@furniture.com
								</Typography>
							</div>
						</div>

						<div className={'info-item'}>
							<div className={'icon-box'}>
								<PhoneOutlinedIcon />
							</div>
							<div>
								<Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1E3A5F' }}>
									Call Us
								</Typography>
								<Typography variant="body2" sx={{ color: '#717171' }}>
									+1 (555) 123-4567
								</Typography>
							</div>
						</div>

						<div className={'info-item'}>
							<div className={'icon-box'}>
								<AccessTimeOutlinedIcon />
							</div>
							<div>
								<Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1E3A5F' }}>
									Working Hours
								</Typography>
								<Typography variant="body2" sx={{ color: '#717171' }}>
									Mon - Fri: 9AM - 6PM
								</Typography>
							</div>
						</div>
					</div>

					<div className={'response-time'}>
						<Typography variant="body2" sx={{ color: '#1E3A5F', fontWeight: 500 }}>
							⚡ Average response time: 2-4 hours
						</Typography>
					</div>
				</div>

				{/* Right Side - Form */}
				<div className={'inquiry-form'}>
					<Typography variant="h5" sx={{ fontWeight: 700, color: '#1E3A5F', mb: 1 }}>
						Send us a Message
					</Typography>
					<Typography sx={{ color: '#717171', mb: 4 }}>
						Fill out the form below and we'll get back to you shortly.
					</Typography>

					<form onSubmit={handleSubmit}>
						<FormControl fullWidth sx={{ mb: 3 }}>
							<InputLabel>Category</InputLabel>
							<Select
								value={formData.inquiryCategory}
								label="Category"
								onChange={(e) => handleInputChange('inquiryCategory', e.target.value as InquiryCategory)}
								sx={{
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#E0DDD5',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#D4A853',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#D4A853',
									},
								}}
							>
								{Object.entries(categoryLabels).map(([value, label]) => (
									<MenuItem key={value} value={value}>
										{label}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<TextField
							fullWidth
							label="Subject"
							placeholder="Brief description of your inquiry"
							value={formData.inquiryTitle}
							onChange={(e) => handleInputChange('inquiryTitle', e.target.value)}
							error={!!errors.inquiryTitle}
							helperText={errors.inquiryTitle}
							sx={{
								mb: 3,
								'& .MuiOutlinedInput-root': {
									'& fieldset': { borderColor: '#E0DDD5' },
									'&:hover fieldset': { borderColor: '#D4A853' },
									'&.Mui-focused fieldset': { borderColor: '#D4A853' },
								},
								'& .MuiInputLabel-root.Mui-focused': { color: '#D4A853' },
							}}
						/>

						<Stack direction="row" spacing={2} sx={{ mb: 3 }}>
							<TextField
								fullWidth
								label="Email"
								type="email"
								placeholder="your@email.com"
								value={formData.inquiryEmail}
								onChange={(e) => handleInputChange('inquiryEmail', e.target.value)}
								error={!!errors.inquiryEmail}
								helperText={errors.inquiryEmail}
								sx={{
									'& .MuiOutlinedInput-root': {
										'& fieldset': { borderColor: '#E0DDD5' },
										'&:hover fieldset': { borderColor: '#D4A853' },
										'&.Mui-focused fieldset': { borderColor: '#D4A853' },
									},
									'& .MuiInputLabel-root.Mui-focused': { color: '#D4A853' },
								}}
							/>

							<TextField
								fullWidth
								label="Phone (Optional)"
								placeholder="+1 (555) 000-0000"
								value={formData.inquiryPhone}
								onChange={(e) => handleInputChange('inquiryPhone', e.target.value)}
								sx={{
									'& .MuiOutlinedInput-root': {
										'& fieldset': { borderColor: '#E0DDD5' },
										'&:hover fieldset': { borderColor: '#D4A853' },
										'&.Mui-focused fieldset': { borderColor: '#D4A853' },
									},
									'& .MuiInputLabel-root.Mui-focused': { color: '#D4A853' },
								}}
							/>
						</Stack>

						<TextField
							fullWidth
							label="Message"
							placeholder="Please describe your question or issue in detail..."
							multiline
							rows={5}
							value={formData.inquiryContent}
							onChange={(e) => handleInputChange('inquiryContent', e.target.value)}
							error={!!errors.inquiryContent}
							helperText={errors.inquiryContent || `${formData.inquiryContent.length}/500 characters`}
							inputProps={{ maxLength: 500 }}
							sx={{
								mb: 4,
								'& .MuiOutlinedInput-root': {
									'& fieldset': { borderColor: '#E0DDD5' },
									'&:hover fieldset': { borderColor: '#D4A853' },
									'&.Mui-focused fieldset': { borderColor: '#D4A853' },
								},
								'& .MuiInputLabel-root.Mui-focused': { color: '#D4A853' },
							}}
						/>

						<Button
							type="submit"
							variant="contained"
							size="large"
							disabled={loading}
							endIcon={!loading && <SendIcon />}
							sx={{
								px: 5,
								py: 1.5,
								fontSize: '16px',
								fontWeight: 600,
								backgroundColor: '#D4A853',
								borderRadius: '8px',
								textTransform: 'none',
								boxShadow: '0 4px 15px rgba(212, 168, 83, 0.3)',
								'&:hover': {
									backgroundColor: '#B8923D',
									boxShadow: '0 6px 20px rgba(212, 168, 83, 0.4)',
								},
								'&:disabled': {
									backgroundColor: '#E0DDD5',
								},
							}}
						>
							{loading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
						</Button>
					</form>
				</div>
			</div>

			{/* Success Snackbar */}
			<Snackbar
				open={success}
				autoHideDuration={6000}
				onClose={() => setSuccess(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
					Your inquiry has been submitted successfully! We'll get back to you within 24 hours.
				</Alert>
			</Snackbar>

			{/* Error Snackbar */}
			<Snackbar
				open={!!error}
				autoHideDuration={6000}
				onClose={() => setError(null)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
					{error}
				</Alert>
			</Snackbar>
		</Stack>
	);
};

export default Inquiry;
