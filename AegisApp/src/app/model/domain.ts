import {StringHelper} from '../utility';
import {IAegisToken} from './tokens';

export class AegisMessage {

	private _title:string;
	private _text:string;
	private _from:string;

	constructor(title:string, text:string, from:string){
		this._title = title;
		this._text = text;
		this._from = from;
	}
	public get textMessage() : string {
		return this._text;
	}
}

export class AegisConversation {
	
	private _name:string;
	private _messages: AegisMessage[];
	private _chatId: string;

	constructor(name: string)
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

export class AegisAccount {

	private _account:string;
	private _token: IAegisToken;
	private _conv:AegisConversation[];

	constructor(accountName: string, accountToken: IAegisToken){
		this._account = accountName;
		this._token = accountToken;
		this._conv = new Array();
	}

	public addConv(conv:AegisConversation) {
		this._conv.push(conv);
	}

	public get convAcc() : AegisConversation[] {
		return this._conv;
	}

	public get accName() : string {
		return this._account;
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