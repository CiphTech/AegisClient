export class AegisPerson {
    
    private readonly _id: number;
    private readonly _firstName: string;
    private readonly _lastName: string;
    
    public get id() : number {
        return this._id;
    }

    public get firstName() : string {
        return this._firstName;
    }

    public get lastName() : string {
        return this._lastName;
    }

    public get fullName() : string {
        return `${this._firstName} ${this._lastName}`;
    }

    public toString(): string {
        return `[${this.id} '${this.fullName}']`;
    }
    
    constructor(id: number, firstName: string, lastName: string) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
    }
}

export class AegisPersonUIContainer{
    public readonly Person: AegisPerson;
    public IsChecked: boolean;

    constructor(person: AegisPerson) {
        this.Person = person;
        this.IsChecked = false;
    }
}