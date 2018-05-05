import { AegisConversation, AegisAccount, AegisMessage, AegisResult } from './domain';
import { IAegisToken } from './tokens';

export interface IAegisChannel {
	setCreds(token: IAegisToken): void;

	sendMessage(conversation: AegisConversation, message: AegisMessage): AegisResult;
}