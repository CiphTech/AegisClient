export class AegisEvent<T> {

	private _callbacks: IEventHandlerDesc<T>[] = [];

	public subscribe(handler: IEventHandler<T>, subscriber: any): ITypedSubscription<T> {

		let self = this;

		let res: ITypedSubscription<T> = {
			handler: handler,
			evt: self,
			unsubscribe: function() { self.unsubscribe(handler); }
		}

		this._callbacks.push({ handler: handler, subscriber: subscriber });

		return res;
	}

	public unsubscribe(handler: IEventHandler<T>): void {

		let callbacks: IEventHandlerDesc<T>[] = [];

		for(let i = 0; i < this._callbacks.length; i++){
			if (this._callbacks[i].handler !== handler)
				callbacks.push(this._callbacks[i]);
		}

		this._callbacks = callbacks;
	}

	public raise: IEventHandler<T> = function(arg: T, context?: any){
		let callbacks: IEventHandlerDesc<T>[] = this._callbacks;

		for (let i = 0; i < callbacks.length; i++){
			callbacks[i].handler.apply(callbacks[i].subscriber, [arg, context]);
		}
	}
}

export interface ISubscription {
	unsubscribe(): void;
}

export interface ITypedSubscription<T> extends ISubscription {
	handler: IEventHandler<T>;
	evt: AegisEvent<T>;
}

export interface IEventHandler<T> {
	(arg: T, context?: any);
}

interface IEventHandlerDesc<T> {
	handler: IEventHandler<T>;
	subscriber: any;
}