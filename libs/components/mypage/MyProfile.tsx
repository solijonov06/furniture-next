import React, { useCallback, useEffect, useState, useRef } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { Messages, REACT_APP_API_URL } from '../../config';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { sweetErrorAlert, sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);
	const fileInputRef = useRef<HTMLInputElement>(null);

	/** APOLLO REQUESTS **/

	const  [updateMember] = useMutation(UPDATE_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		console.log('+user from userVar:', user);
		if (user && user._id) {
			setUpdateData(prev => ({
				...prev,
				memberNick: user.memberNick || '',
				memberPhone: user.memberPhone || '',
				memberAddress: user.memberAddress || '',
				memberImage: user.memberImage || '',
			}));
		}
	}, [user]);

	/** HANDLERS **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			if (!image) {
				console.log('No image selected');
				return;
			}
			
			console.log('+image:', image);
			console.log('+token:', token ? 'exists' : 'missing');
			console.log('+API URL:', process.env.REACT_APP_API_GRAPHQL_URL);

			if (!token) {
				await sweetErrorAlert('Please login first!');
				return;
			}

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'member',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			console.log('+response:', response.data);
			
			if (response.data.errors) {
				console.error('GraphQL Errors:', response.data.errors);
				await sweetErrorAlert(response.data.errors[0]?.message || 'Upload failed');
				return;
			}

			const responseImage = response.data.data?.imageUploader;
			console.log('+responseImage: ', responseImage);
			
			if (responseImage) {
				// Use functional setState to avoid stale closure
				setUpdateData(prev => ({ ...prev, memberImage: responseImage }));
				await sweetMixinSuccessAlert('Image uploaded! Click "Update Profile" to save.');
			} else {
				await sweetErrorAlert('No image returned from server');
			}

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err: any) {
			console.error('Upload error:', err);
			const errorMsg = err?.response?.data?.errors?.[0]?.message 
				|| err?.message 
				|| 'Upload failed. Is the backend running on port 3005?';
			await sweetErrorAlert(errorMsg);
		}
	};

	const updatePropertyHandler = useCallback(async () => {
		try {
          if (!user._id) throw new Error(Messages.error2);
		  updateData._id = user._id;
		  const result = await updateMember({
			variables: {
				input: updateData,
			},
		  });

		  // @ts-ignore
		  const jwtToken = result.data.updateMember?.accessToken;
		  await updateStorage({ jwtToken });
		  updateUserInfo(result.data.updateMember?.accessToken);
		  await sweetMixinSuccessAlert('Information updated successfully.');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [updateData]);

	const doDisabledCheck = () => {
		if (
			updateData.memberNick === '' ||
			updateData.memberPhone === '' ||
			updateData.memberAddress === '' ||
			updateData.memberImage === ''
		) {
			return true;
		}
	};

	console.log('+updateData', updateData);

	if (device === 'mobile') {
		return <>MY PROFILE PAGE MOBILE</>;
	} else
		return (
			<div id="my-profile-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Profile</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="top-box">
					<Stack className="photo-box">
						<Typography className="title">Photo</Typography>
						<Stack className="image-big-box">
							<Stack className="image-box">
								<img
									src={
										updateData?.memberImage
											? `${REACT_APP_API_URL}/${updateData?.memberImage}`
											: `/img/profile/defaultUser.svg`
									}
									alt=""
								/>
							</Stack>
							<Stack className="upload-big-box">
								<input
									type="file"
									ref={fileInputRef}
									style={{ 
										position: 'absolute',
										width: '1px',
										height: '1px',
										padding: 0,
										margin: '-1px',
										overflow: 'hidden',
										clip: 'rect(0, 0, 0, 0)',
										whiteSpace: 'nowrap',
										border: 0,
									}}
									onChange={(e) => {
										console.log('onChange triggered!', e.target.files);
										uploadImage(e);
									}}
									accept="image/jpg,image/jpeg,image/png"
								/>
								<Button 
									variant="outlined"
									component="span"
									onClick={(e) => {
										e.preventDefault();
										console.log('Button clicked, opening file picker...');
										if (fileInputRef.current) {
											fileInputRef.current.value = '';
											fileInputRef.current.click();
										}
									}}
									sx={{
										borderColor: '#8B5A2B',
										color: '#8B5A2B',
										padding: '12px 24px',
										borderRadius: '8px',
										'&:hover': {
											borderColor: '#6B4423',
											backgroundColor: 'rgba(139, 90, 43, 0.05)',
										}
									}}
								>
									Upload Profile Image
								</Button>
								<Typography className="upload-text">A photo must be in JPG, JPEG or PNG format!</Typography>
							</Stack>
						</Stack>
					</Stack>
					<Stack className="small-input-box">
						<Stack className="input-box">
							<Typography className="title">Username</Typography>
							<input
								type="text"
								placeholder="Your username"
								value={updateData.memberNick}
								onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberNick: value })}
							/>
						</Stack>
						<Stack className="input-box">
							<Typography className="title">Phone</Typography>
							<input
								type="text"
								placeholder="Your Phone"
								value={updateData.memberPhone}
								onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberPhone: value })}
							/>
						</Stack>
					</Stack>
					<Stack className="address-box">
						<Typography className="title">Address</Typography>
						<input
							type="text"
							placeholder="Your address"
							value={updateData.memberAddress}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberAddress: value })}
						/>
					</Stack>
					<Stack className="about-me-box">
						<Button className="update-button" onClick={updatePropertyHandler} disabled={doDisabledCheck()}>
							<Typography>Update Profile</Typography>
							<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
								<g clipPath="url(#clip0_7065_6985)">
									<path
										d="M12.6389 0H4.69446C4.49486 0 4.33334 0.161518 4.33334 0.361122C4.33334 0.560727 4.49486 0.722245 4.69446 0.722245H11.7672L0.105803 12.3836C-0.0352676 12.5247 -0.0352676 12.7532 0.105803 12.8942C0.176321 12.9647 0.268743 13 0.361131 13C0.453519 13 0.545907 12.9647 0.616459 12.8942L12.2778 1.23287V8.30558C12.2778 8.50518 12.4393 8.6667 12.6389 8.6667C12.8385 8.6667 13 8.50518 13 8.30558V0.361122C13 0.161518 12.8385 0 12.6389 0Z"
										fill="white"
									/>
								</g>
								<defs>
									<clipPath id="clip0_7065_6985">
										<rect width="13" height="13" fill="white" />
									</clipPath>
								</defs>
							</svg>
						</Button>
					</Stack>
				</Stack>
			</div>
		);
};

MyProfile.defaultProps = {
	initialValues: {
		_id: '',
		memberImage: '',
		memberNick: '',
		memberPhone: '',
		memberAddress: '',
	},
};

export default MyProfile;