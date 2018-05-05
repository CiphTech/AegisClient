import { Component, OnInit } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount} from '../model/domain';
import { AuthService } from '../services/auth.service';
import {DialogService} from '../services/dialog.service';
import {IAegisChannel} from '../model/channels';
import { StringHelper } from '../utility';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

	textMessage:string;	
  convSvc: AuthService;
  dialogSvc: DialogService;
	selectedConv:AegisConversation = new AegisConversation("default");
  selectedAcc: AegisAccount;
	selectTrue: boolean = false; // для выделения message при выборе
  stringNull: boolean = false; // для отображения ошибки ввода
  columnVisible: string = "c1";

  constructor(convSvc: AuthService, dialogSvc: DialogService) {
    this.convSvc = convSvc;
    this.dialogSvc = dialogSvc;
  }

  ngOnInit() {
  }

  selectConv(conv: AegisConversation, acc: AegisAccount){
  	this.selectedConv = conv;
    this.selectedAcc = acc;
  	this.selectTrue = true;
  }

  sendMessage (){
  	if (StringHelper.isNullOrEmpty(this.textMessage)) {
  		this.stringNull = true;
  		return;
  	}

  	let msg = new AegisMessage(this.selectedConv.nameConv,this.textMessage,"from");

    let channel = this.dialogSvc.getChannel(this.selectedAcc);

    let result = channel.sendMessage(this.selectedConv, msg);

    if (!result.isSucceed)
    {
      console.log('Cannot send message. Code: ' + result.code + '; Error: ' + result.message);
      return;
    }

  	this.selectedConv.addMessage(msg);
  	this.textMessage="";
  	this.stringNull = false;
  }

  addConv (acc: AegisAccount, nameConv:string){
  	let conv = new AegisConversation(nameConv);
  	acc.addConv(conv);
  }

}
