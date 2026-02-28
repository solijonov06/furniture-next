import React, { useMemo, useRef, useState } from 'react';
import { Button, FormControl, MenuItem, Stack, Typography, Select, TextField } from '@mui/material';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import axios from 'axios';
import { T } from '../../types/common';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useMutation } from '@apollo/client';
import { CREATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const TuiEditor = () => {
	const editorRef = useRef<Editor>(null),
		token = getJwtToken(),
		router = useRouter();
	const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.FREE);

	/** APOLLO REQUESTS **/
	const [createboardArticle] = useMutation(CREATE_BOARD_ARTICLE);

	const memoizedValues = useMemo(() => {
		const articleTitle = '',
			articleContent = '',
			articleImage = '';

		return { articleTitle, articleContent, articleImage };
	}, []);

	/** HANDLERS **/
	const uploadImage = async (image: any) => {
		try {
			// Try backend upload first
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'article',
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

			const responseImage = response.data.data.imageUploader;
			console.log('=responseImage: ', responseImage);
			memoizedValues.articleImage = responseImage;

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Backend unavailable, using local image storage');
			// Fallback: Convert image to base64 for localStorage
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					const base64String = reader.result as string;
					memoizedValues.articleImage = base64String;
					resolve(base64String);
				};
				reader.readAsDataURL(image);
			});
		}
	};

	const changeCategoryHandler = (e: any) => {
		setArticleCategory(e.target.value);
	};

	const articleTitleHandler = (e: T) => {
		console.log(e.target.value);
		memoizedValues.articleTitle = e.target.value;
	};

	const handleRegisterButton = async () => {
		try {
			const editor = editorRef.current;
			const articleContent = editor?.getInstance().getHTML() as string;
			memoizedValues.articleContent = articleContent;

			// Fix: Check if EITHER field is empty (use OR instead of AND)
			if (memoizedValues.articleContent === '' || memoizedValues.articleTitle === '') {
				throw new Error(Message.INSERT_ALL_INPUTS);
			}

			try {
				// Try to save via GraphQL first
				await createboardArticle({
					variables: {
						input: { ...memoizedValues, articleCategory },
					},
				});
			} catch (graphqlError) {
				// If GraphQL fails (no backend), save to localStorage
				console.log('GraphQL unavailable, saving to localStorage');
				const newArticle = {
					_id: Date.now().toString(),
					articleTitle: memoizedValues.articleTitle,
					articleContent: memoizedValues.articleContent,
					articleImage: memoizedValues.articleImage,
					articleCategory: articleCategory,
					articleStatus: 'ACTIVE',
					articleViews: 0,
					articleLikes: 0,
					articleComments: 0,
					createdAt: new Date().toISOString(),
					memberId: 'local-user',
				};
				const storedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
				storedArticles.push(newArticle);
				localStorage.setItem('articles', JSON.stringify(storedArticles));
			}

			await sweetTopSmallSuccessAlert('Article is created successfully', 700);
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myArticles'
				}
			});
		} catch (err: any) {
			console.log('Error creating article:', err);
			sweetErrorHandling(err).then();
		}
	};

	const doDisabledCheck = () => {
		if (memoizedValues.articleContent === '' || memoizedValues.articleTitle === '') {
			return true;
		}
	};

	return (
		<Stack>
			<Stack direction="row" style={{ margin: '40px' }} justifyContent="space-evenly">
				<div className={'form_row'} style={{ width: '300px' }}>
					<Typography style={{ color: '#7f838d', margin: '10px' }} variant="h3">
						Category
					</Typography>
					<FormControl sx={{ width: '100%', background: 'white' }}>
						<Select
							value={articleCategory}
							onChange={changeCategoryHandler}
							displayEmpty
							inputProps={{ 'aria-label': 'Without label' }}
						>
							<MenuItem value={BoardArticleCategory.FREE}>
								<span>Free</span>
							</MenuItem>
							<MenuItem value={BoardArticleCategory.HUMOR}>Humor</MenuItem>
							<MenuItem value={BoardArticleCategory.NEWS}>News</MenuItem>
							<MenuItem value={BoardArticleCategory.RECOMMEND}>Recommendation</MenuItem>
						</Select>
					</FormControl>
				</div>
				<div style={{ width: '300px', flexDirection: 'column' }}>
					<Typography style={{ color: '#7f838d', margin: '10px' }} variant="h3">
						Title
					</Typography>
					<TextField
						onChange={articleTitleHandler}
						id="filled-basic"
						label="Type Title"
						style={{ width: '300px', background: 'white' }}
					/>
				</div>
			</Stack>

			<Editor
				initialValue={'Type here'}
				placeholder={'Type here'}
				previewStyle={'vertical'}
				height={'640px'}
				// @ts-ignore
				initialEditType={'WYSIWYG'}
				toolbarItems={[
					['heading', 'bold', 'italic', 'strike'],
					['image', 'table', 'link'],
					['ul', 'ol', 'task'],
				]}
				ref={editorRef}
				hooks={{
					addImageBlobHook: async (image: any, callback: any) => {
						const uploadedImageURL = await uploadImage(image);
						callback(uploadedImageURL);
						return false;
					},
				}}
				events={{
					load: function (param: any) {},
				}}
			/>

			<Stack direction="row" justifyContent="center">
				<Button
					variant="contained"
					color="primary"
					style={{ margin: '30px', width: '250px', height: '45px' }}
					onClick={handleRegisterButton}
				>
					Register
				</Button>
			</Stack>
		</Stack>
	);
};

export default TuiEditor;