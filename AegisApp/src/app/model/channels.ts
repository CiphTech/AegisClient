import { AegisConversation, AegisMessage, AegisResult } from './domain';
import { AegisPerson } from './person';

export interface IAegisChannel {
	sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult>;

	getMessages(): Promise<AegisMessage[]>;

	getFriends(): Promise<AegisPerson[]>;

	getPerson(id: string): Promise<AegisPerson>;

	getConversations(): Promise<AegisConversation[]>;

	createConversation(title: string, friends: AegisPerson[]): Promise<AegisConversation>;
}

export class AegisStubChannel implements IAegisChannel {
	
	private msgBuffer: AegisMessage[];

	public getFriends(): Promise<AegisPerson[]> {
		return new Promise((resolve, reject) => {
            let yoba1 = new AegisPerson(1, 'Yoba', '');
            let yoba2 = new AegisPerson(2, 'Alex', 'MAG');
            let yoba3 = new AegisPerson(3, 'Alex', 'Chusik');

            resolve([yoba1, yoba2, yoba3]);
        });
	}

	public getPerson(id: string): Promise<AegisPerson> {
		throw new Error("Method not implemented.");
	}

	public getConversations(): Promise<AegisConversation[]> {
		return new Promise((resolve, reject) => {
			let conv = new AegisConversation('Init conversation');
			let convList = [conv];
			resolve(convList);
		})
	}

	public createConversation(title: string, friends: AegisPerson[]): Promise<AegisConversation> {
		return new Promise((resolve, reject) => {
			resolve(new AegisConversation(title));
		});
	}

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