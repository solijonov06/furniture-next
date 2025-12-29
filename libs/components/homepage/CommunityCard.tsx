import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { vertical, article, index } = props;
	const device = useDeviceDetect();
	
	// Handle different image sources: base64, full URL, or server path
	const getArticleImage = () => {
		if (!article?.articleImage) return '/img/community/default-article.jpg';
		// Check if it's a base64 image
		if (article.articleImage.startsWith('data:image')) return article.articleImage;
		// Check if it's already a full URL
		if (article.articleImage.startsWith('http')) return article.articleImage;
		// Otherwise, prepend the API URL
		return `${process.env.REACT_APP_API_URL}/${article.articleImage}`;
	};
	const articleImage = getArticleImage();

	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	} else {
		if (vertical) {
			return (
				<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
					<Box component={'div'} className={'vertical-card'}>
						<div className={'community-img'} style={{ backgroundImage: `url(${articleImage})` }}>
							<div>{index + 1}</div>
						</div>
						<strong>{article?.articleTitle}</strong>
						<span>Free Board</span>
					</Box>
				</Link>
			);
		} else {
			return (
				<>
					<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
						<Box component={'div'} className="horizontal-card">
							<img src={articleImage} alt="" />
							<div>
								<strong>{article.articleTitle}</strong>
								<span>
									<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
								</span>
							</div>
						</Box>
					</Link>
				</>
			);
		}
	}
};

export default CommunityCard;
