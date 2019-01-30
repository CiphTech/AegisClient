import { AegisConversation, AegisMessage, AegisResult } from './domain';

export interface IAegisChannel {
	sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult>;

	getMessages(): Promise<AegisMessage[]>;
}

export class AegisStubChannel implements IAegisChannel {

	private msgBuffer: AegisMessage[];

	public sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult> {
		console.log(`[AegisStubChannel] Conversation '${conversation.nameConv}' Message '${message.textMessage}'`);

		this.createReceivedMsg();

		return new Promise<AegisResult>((resolve) => resolve(AegisResult.ok()));
	}

	public getMessages(): Promise<AegisMessage[]> {
		let messages = [].concat(this.msgBuffer);
		let prom = new Promise<AegisMessage[]>((resolve, reject) => {
			resolve(messages);
		})

		this.msgBuffer = [];

		return prom;
	}

	private createReceivedMsg(): void{
		let msgDate = new Date();
		let recMsg = new AegisMessage('Received message', `Message at ${msgDate}`, 'Channel', msgDate, 'no_id');
		
		this.msgBuffer.push(recMsg);
	}

	constructor(){
		this.msgBuffer = [];
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