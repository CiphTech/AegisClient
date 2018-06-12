import { AegisConversation, AegisAccount, AegisMessage, AegisResult } from './domain';
import { IAegisToken } from './tokens';
import { AegisEvent } from './events';

export interface IAegisChannel {
	setCreds(token: IAegisToken): void;

	sendMessage(conversation: AegisConversation, message: AegisMessage): AegisResult;

	onNewMessage: AegisEvent<AegisReceived>;
}

export class AegisStubChannel implements IAegisChannel {

	private _conversations: AegisConversation[] = [];

	public setCreds(token: IAegisToken): void {
		console.log('Token was set: ' + token.getString());
	}

	public sendMessage(conversation: AegisConversation, message: AegisMessage): AegisResult {
		console.log('[AegisStubChannel] Conversation \'' + conversation.nameConv + '\' Message \'' + message.textMessage + '\'');

		let recMsg = new AegisMessage('Received message', 'Message at ' + new Date(), 'Channel');
		let msgArr: AegisMessage[] = [];
		msgArr.push(recMsg);

		let received = new AegisReceived(conversation, msgArr);

		return AegisResult.ok();
	}

	public onNewMessage: AegisEvent<AegisReceived>;
}

export class AegisChannelFactory {

	public static createChannel(account: AegisAccount): IAegisChannel{
		console.log('Creating new channel for account ' + account.accName);
		return new AegisStubChannel();
	}
}

export class AegisReceived {

	public conversation: AegisConversation;

	public messages: AegisMessage[];

	constructor(conv: AegisConversation, msgs: AegisMessage[]) {
		this.conversation = conv;
		this.messages = msgs;
	}
}