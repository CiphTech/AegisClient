import {StringHelper} from '../utility';
import {IAegisToken} from './tokens';
import { IAegisChannel, AegisMessageContainer } from './channels';
import { AegisEvent } from './events';
import { AegisPerson } from './person';
import { PersonsService } from '../services/persons.service';
import { ConversationsService } from '../services/conversations.service';
import { MessagesService } from '../services/messages.service';

export class AegisMessage {

	private _title:string;
	private _text:string;
	private _from:string;
	private _dt:Date;
	private _conversationId:string;

	constructor(title:string, text:string, from?:string, dt?: Date, chatId?: string){
		this._title = title;
		this._text = text;
		this._from = from;

		this._dt = dt != null ? dt : new Date();
		this._conversationId = chatId;
	}

	public get isIncoming() : boolean {
		return this._from !== undefined;
	}
	
	public get textMessage() : string {
		return this._text;
	}
	
	public get date() : Date {
		return this._dt;
	}
	
	public get conversationId() : string {
		return this._conversationId;
	}
}

export class AegisConversation {
	
	private _name:string;
	private _messages: AegisMessage[];
	private _chatId: string;

	constructor(name: string, id?: string) {

		if (StringHelper.isNullOrEmpty(id))
			this._chatId = 'no_id';
		else
			this._chatId = id;

		this._name = name;
		this._messages = new Array();
	}

	public addMessage(msg:AegisMessage) {
		this._messages.push(msg);
	}

	public get id() : string {
		return this._chatId;
	}

	public get nameConv() : string {
		return this._name;
	}

	public get messages() : AegisMessage[] {
		return this._messages;
	}

	public get messageCount() : number {
		return this._messages.length;
	}
}

export enum AccountType {
	Test = 0,
	Vk = 1,
	Facebook = 2
}

export class AegisAccount {

	private readonly _type: AccountType;
	private readonly _account:string;
	private readonly _conv:AegisConversation[];
	private _receiveTimer: NodeJS.Timer;

	private constructor(existingConv: AegisConversation[],
		private readonly persons: PersonsService, 
		private readonly conv: ConversationsService, 
		private readonly msg: MessagesService){

		this._conv = existingConv;
		this._receiveTimer = setInterval(() => {this.receiveLoop();}, 5000);
	}

	public get convAcc() : AegisConversation[] {
		return this._conv;
	}

	public get accName() : string {
		return this._account;
	}

	public get accType() : AccountType {
		return this._type;
	}

	public static async Create(persons: PersonsService, msg: MessagesService, conv: ConversationsService): Promise<AegisAccount> {
		let existingConv = await conv.getConversations();

		return new AegisAccount(existingConv, persons, conv, msg);
	}

	public async getFriends(): Promise<AegisPerson[]> {
		return await this.persons.getPersons();
	}

	public async createConv(title: string, friends: AegisPerson[]): Promise<void> {
		let conv = await this.conv.createConversation(title, friends.map(x => x.id));

		this._conv.push(conv);
	}

	public async sendMessage(conv: AegisConversation, title: string, body: string): Promise<void> {
		let msg = await this.msg.sendMessage(conv.id, title, body);

		conv.addMessage(msg);
	}

	private async receiveLoop(): Promise<void> {
		this._conv.forEach(async c => await this.receiveMsg(c, 0));
	}

	private async receiveMsg(conversation: AegisConversation, counter: number): Promise<void> {
		let messages = await this.msg.getMessages(conversation.id, counter);

		messages.forEach(msg => conversation.addMessage(msg));
	}
} 

export class AegisResult {
	private _code: number;
	private _message: string;

	public get code() : number {
		return this._code;
	}

	public get message() : string {
		return this._message;
	}

	public get isSucceed() : boolean {
		return this._code === 0;
	}

	constructor(code: number, message?: string) {
		this._code = code;

		if (!StringHelper.isNullOrEmpty(message))
			this._message = message;
	}

	public static ok(): AegisResult{
		return new AegisResult(0);
	}

	public static fail(code: number, message?: string): AegisResult {
		return new AegisResult(code, message);
	}
}