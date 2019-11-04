import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AccountType } from '../model/domain';


@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})

export class CheckInComponent implements OnInit {

  private accSvc: AuthService;
  public tokenStr: string;

  constructor(acc: AuthService) {
    this.accSvc = acc;
  }

  public createVkAcc(): void {
    this.accSvc.createAcc('VKontakte', AccountType.Vk, this.tokenStr);
  }

  public createFbAcc(): void {
    this.accSvc.createAcc('Facebook', AccountType.Facebook);
  }

  public createTestAcc(): void{
    this.accSvc.createAcc('Test', AccountType.Test);
  }

  ngOnInit() {
  }
}
