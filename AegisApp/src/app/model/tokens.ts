export interface IAegisToken {
	getString(): string;
}

export class SimpleTextToken implements IAegisToken {
	private _token: string;

	constructor(token: string) {
		this._token = token;
	}

	public getString(): string {
		return this._token;
	}
}