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

	constructor(name:string){
		this._name = name;
		this._messages = new Array();
	}

	public addMessage(msg:AegisMessage) {
		this._messages.push(msg);
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
	private _conv:AegisConversation[];

	constructor(account:string){
		this._account = account;
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
