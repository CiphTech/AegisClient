import { AegisConversation, AegisMessage, AegisResult } from './domain';

export interface IAegisChannel {
	sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult>;

	getMessages(): Promise<AegisMessage[]>;
}

export class AegisStubChannel implements IAegisChannel {

	public sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult> {
		console.log(`[AegisStubChannel] Conversation '${conversation.nameConv}' Message '${message.textMessage}'`);

		return new Promise<AegisResult>((resolve) => resolve(AegisResult.ok()));
	}

	public getMessages(): Promise<AegisMessage[]> {
		let msgDate = new Date();
		let recMsg = new AegisMessage('Received message', `Message at ${msgDate}`, 'Channel', msgDate);
		let msgArr: AegisMessage[] = [];
		msgArr.push(recMsg);

		let prom = new Promise<AegisMessage[]>((resolve, reject) => {
			resolve(msgArr);
		})

		return prom;
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