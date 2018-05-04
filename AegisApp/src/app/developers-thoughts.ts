/*enum AegisAccountType{

	Vk,
	Fb,
	Skype
}

class AegisAccount{

	private _displayName:string;
	private _type:AegisAccountType;
	private _accessToken:string;
}

class AegisResult {
	private _code: number;
	private _error:string;

	public get code():number{
		return this._code;
	}

	public get error() : string {
		return this._error;
	}

	public get isSucceed() : boolean {
		return this._code === 0;
	}
}

interface IAegisChannel{
	sendMessage(message: AegisMessage): AegisResult;

	setCreds(token: IAccessToken): void;
}

interface IAccessToken {
	getString(): string;
}*/