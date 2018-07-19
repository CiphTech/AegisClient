import { Component, OnInit } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount } from '../model/domain';
import { AuthService } from '../services/auth.service';
import { DialogService } from '../services/dialog.service';
import { IAegisChannel, AegisReceived } from '../model/channels';
import { StringHelper } from '../utility';
import { AegisEvent, IEventHandler, ITypedSubscription } from '../model/events';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

	public textMessage: string;	
  public convSvc: AuthService;
  public dialogSvc: DialogService;
	public selectedConv: AegisConversation = new AegisConversation("default");
  public selectedAcc: AegisAccount;
	public selectTrue: boolean = false; // для выделения message при выборе
  public stringNull: boolean = false; // для отображения ошибки ввода
  public columnVisible: string = "c1"; //времяночка
  public titleInterlocutor: string;

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

  sendMessage() {
  	if (StringHelper.isNullOrEmpty(this.textMessage)) {
  		this.stringNull = true;
  		return;
  	}

    let msg = new AegisMessage(this.selectedConv.nameConv, this.textMessage);

    let channel: IAegisChannel = this.dialogSvc.getChannel(this.selectedAcc);

    let handler = function(arg: AegisReceived, context?: any) {
      //console.log('New message has been received. Conv: ' + arg.conversation.nameConv + 'Msg: ' + arg.messages[0].textMessage);
      this.titleInterlocutor = arg.conversation.nameConv;
      
      for (var i = 0; i < arg.messages.length; i++) {
          this.selectedConv.addMessage(arg.messages[i]);
        }
    }

    let subscription = channel.onNewMessage.subscribe(handler, this);

    let result = channel.sendMessage(this.selectedConv, msg);

    subscription.unsubscribe();

    if (!result.isSucceed)
    {
      console.log('Cannot send message. Code: ' + result.code + '; Error: ' + result.message);
      return;
    }

    this.selectedConv.addMessage(msg);
    this.textMessage = "";
  	this.stringNull = false;

  }

    getClassIncoming(msg:AegisMessage) {

      return {"bg-danger" : msg.isIncoming};
      
    }

  addConv(acc: AegisAccount, nameConv: string) {
    let conv = new AegisConversation(nameConv, '108');
  	acc.addConv(conv);
  }

}
