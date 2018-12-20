import { AegisConversation, AegisAccount, AegisMessage, AegisResult } from './domain';
import { IAegisToken } from './tokens';
import { AegisEvent } from './events';
import {HttpClient } from '@angular/common/http';
import {AegisVkChannel} from './channels.vk';

export interface IAegisChannel {
	setCreds(token: IAegisToken): void;

	sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult>;

	onNewMessage: AegisEvent<AegisReceived>;
}

export class AegisStubChannel implements IAegisChannel {

	public setCreds(token: IAegisToken): void {
		console.log('Token was set: ' + token.getString());
	}

	public sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult> {
		console.log('[AegisStubChannel] Conversation \'' + conversation.nameConv + '\' Message \'' + message.textMessage + '\'');

		let msgDate = new Date();
		let recMsg = new AegisMessage('Received message', `Message at ${msgDate}`, 'Channel', msgDate);
		let msgArr: AegisMessage[] = [];
		msgArr.push(recMsg);

		let received = new AegisReceived(conversation, msgArr);

		this.onNewMessage.raise(received);

		return new Promise<AegisResult>((resolve, reject) => resolve(AegisResult.ok()));
	}

	public onNewMessage: AegisEvent<AegisReceived> = new AegisEvent<AegisReceived>();
}

export class AegisReceived {

	public conversation: AegisConversation;

	public messages: AegisMessage[];

	constructor(conv: AegisConversation, msgs: AegisMessage[]) {
		this.conversation = conv;
		this.messages = msgs;
	}
}