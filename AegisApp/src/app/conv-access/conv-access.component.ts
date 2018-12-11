import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, HostListener } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount, AegisResult } from '../model/domain';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-conv-access',
  templateUrl: './conv-access.component.html',
  styleUrls: ['./conv-access.component.scss']
})
export class ConvAccessComponent implements OnInit {

	public convName: string;
	private _accId: number;

	@ViewChild('fileInput') fileInput: ElementRef;
	@Input() multiple: boolean;
	@Input() disabled: boolean;
	@Output() checkChange: EventEmitter<File[]> = new EventEmitter();

	files: File[];
	isDraggedOver: Boolean;

	constructor (private route: ActivatedRoute, private router: Router, private convSvc: AuthService) {	}

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
			this._accId = parseInt(this.route.snapshot.paramMap.get('accId'));
			
	}

	addConv() {

		const msg = `Creating new conversation [ID: ${this._accId}; Title: ${this.convName}]`;
		console.log(msg);

		let acc = this.convSvc.getAcc(this._accId);

		this.convSvc.createConv(acc, this.convName)
			.then(conv => acc.addConv(conv))
			.catch(err => console.log(err));
  }

}
