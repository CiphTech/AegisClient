import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, HostListener } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount, AegisResult } from '../model/domain';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AegisPerson, AegisPersonUIContainer } from '../model/person';
import { PersonsService } from '../services/persons.service';


@Component({
  selector: 'app-conv-access',
  templateUrl: './conv-access.component.html',
  styleUrls: ['./conv-access.component.scss']
})
export class ConvAccessComponent implements OnInit {

	public convName: string;
	private _acc: AegisAccount;
	public _friends: AegisPersonUIContainer[];

	@ViewChild('fileInput') fileInput: ElementRef;
	@Input() multiple: boolean;
	@Input() disabled: boolean;
	@Output() checkChange: EventEmitter<File[]> = new EventEmitter();

	files: File[];
	isDraggedOver: Boolean;

	constructor (private route: ActivatedRoute, private router: Router, private convSvc: AuthService, private aegPersons: PersonsService) {	}

	// open native file dialog
	openFileDialog(): void {
	const event = new MouseEvent('click', { bubbles: false });
	this.fileInput.nativeElement.dispatchEvent(event);
	}

	// assign selected file to file variable, emit new file
	onBrowseFiles(event: File[]): void {
	this.files = this.fileInput.nativeElement.files;
	this.checkChange.emit(this.files);
	}

	// assign dropped file to file variable, emit new file
	onDropFiles(event: File[]): void {
	this.files = event;
	this.checkChange.emit(this.files);
	}

	// detect if file is being dragged
	onDragOver(event: boolean) {
	this.isDraggedOver = event;
	}
	
	ngOnInit() {
			let accId = parseInt(this.route.snapshot.paramMap.get('accId'));			
			this._acc = this.convSvc.getAcc(accId);

			let friendsProm = this.aegPersons.getPersons();
			friendsProm.then(friends => this.SetFriends(friends)).catch(err => console.log(err));
	}

	private SetFriends(friends: AegisPerson[]): void{
		this._friends = [];

		friends.forEach(friend => {
			let container = new AegisPersonUIContainer(friend);
			this._friends.push(container);
		});
	}
		
	// checkedFriends = this._friends.filter;

	addConv() {

		const msg = `Creating new conversation [ID: ${this._acc.id}; Title: ${this.convName}]`;
		console.log(msg);

		let checkedFriends = this._friends.filter(friend => friend.IsChecked).map(f => f.Person);

		this._acc.createConv(this.convName, checkedFriends);
  }

}
