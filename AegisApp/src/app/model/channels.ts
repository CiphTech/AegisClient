import { AegisConversation, AegisAccount, AegisMessage, AegisResult } from './domain';
import { IAegisToken } from './tokens';

export interface IAegisChannel {
	setCreds(token: IAegisToken): void;

	sendMessage(conversation: AegisConversation, message: AegisMessage): AegisResult;
}

export class AegisStubChannel implements IAegisChannel {
	public setCreds(token: IAegisToken): void{
		console.log('Token was set: ' + token.getString());
	}

	public sendMessage(conversation: AegisConversation, message: AegisMessage): AegisResult {
		console.log('[AegisStubChannel] Conversation \'' + conversation.nameConv + '\' Message \'' + message.textMessage + '\'');
		return AegisResult.Ok();
	}
}

export class AegisChannelFactory {

	public static createChannel(account: AegisAccount): IAegisChannel{
		console.log('Creating new channel for account ' + account.accName);
		return new AegisStubChannel();
	}
}