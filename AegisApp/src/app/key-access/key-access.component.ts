import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, HostListener } from '@angular/core';
@Component({
	selector: 'app-key-access',
	templateUrl: './key-access.component.html',
	styleUrls: ['./key-access.component.scss']
})
export class KeyAccessComponent implements OnInit {

	@ViewChild('fileInput') fileInput: ElementRef;
	@Input() multiple: boolean;
	@Input() disabled: boolean;
	@Output() checkChange: EventEmitter<File[]> = new EventEmitter();

	files: File[];
	isDraggedOver: Boolean;

	constructor() { }

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
	}

}
