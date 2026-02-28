import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Badge from '@mui/material/Badge';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';
import { Message } from '@mui/icons-material';

const NewMessage = (type: any) => {
	if (type === 'right') {
		return (
			<div
				style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', margin: '10px 0px' }}
			>
				<div className={'msg_right'}></div>
			</div>
		);
	} else {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', margin: '10px 0px' }}>
				<Avatar alt={'jonik'} src={'/img/profile/defaultUser.svg'} />
				<div className={'msg_left'}></div>
			</div>
		);
	}
};

interface MessagePayLoad {
  event: string;
  text: string;
  memberData: Member
}

interface InfoPayLoad {
  event: string;
  totalClients: number;
  memberData: Member;
  action: string;
}

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayLoad[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);


	/** LIFECYCLES **/

	useEffect(() => {
		socket.onmessage = (msg) => {
          const data = JSON.parse(msg.data);
		  console.log('Websocket message:', data);
          
		  switch (data.event) {
			case 'info':
				const newInfo: InfoPayLoad = data;
				setOnlineUsers(newInfo.totalClients);
				break;
			case 'getMessages':
				const list: MessagePayLoad[] = data.list;
				setMessagesList(list);
				break;
			case 'message':
				const newMessage: MessagePayLoad = data;
				messagesList.push(newMessage);
				setMessagesList([ ...messagesList]);
				break;	
		  }
	  }
	}, [socket, messagesList])
	 
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
	};

	const getInputMessageHandler = useCallback(
		(e: any) => {
			const text = e.target.value;
			setMessageInput(text);
		},
		[messageInput],
	);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key == 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		if (!messageInput) sweetErrorAlert(Messages.error4);
		else {
			socket.send(JSON.stringify({ event: 'message', data: messageInput }));
			setMessageInput('');
		}
	};

	return (
		<Stack className="chatting">
			{openButton ? (
				<button className="chat-button" onClick={handleOpenChat}>
					{open ? (
						<CloseFullscreenIcon />
					) : (
						<img 
							src="/img/icons/chat-icon.png" 
							alt="Chat" 
							style={{ 
								width: '32px', 
								height: '32px', 
								objectFit: 'contain' 
							}} 
						/>
					)}
				</button>
			) : null}
			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				<div className={'chat-top'}>
					<div style={{ fontFamily: 'Nunito' }}>Online Chat</div>
				<RippleBadge 
				style={{ margin: "-18px 0 0 21px"}} 
				badgeContent={onlineUsers}
				/>
				</div>
				<div className={'chat-content'} id="chat-content" ref={chatContentRef}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							<div style={{ display: 'flex', flexDirection: 'row', margin: '10px 0px' }}>
								<div className={'welcome'}>Welcome to Live chat!</div>
							</div>
							{messagesList.map((ele: MessagePayLoad) => {
								const { text, memberData } = ele;
								const memberImage = memberData?.memberImage
								? `${REACT_APP_API_URL}/${memberData.memberImage}`
								: '/img/profile/defaultUser.svg';
								
								return memberData?._id === user?._id ? (
								<div
									style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', margin: '10px 0px' }}
								>
									<div className={'msg-right'}>{text}</div>
								</div>
								) : (
								<div style={{ display: 'flex', flexDirection: 'row', margin: '10px 0px' }}>
									<Avatar alt={'jonik'} src={memberImage} />
									<div className={'msg-left'}>{text}</div>
								</div>
							    )
							})}
						</Stack>
					</ScrollableFeed>
				</div>
				<div className={'chat-bott'}>
					<input
						type={'text'}
						name={'message'}
						className={'msg-input'}
						value={messageInput}
						placeholder={'Type message'}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button className={'send-msg-btn'} onClick={onClickHandler}>
						<SendIcon style={{ color: '#fff' }} />
					</button>
				</div>
			</Stack>
		</Stack>
	);
};

export default Chat;
