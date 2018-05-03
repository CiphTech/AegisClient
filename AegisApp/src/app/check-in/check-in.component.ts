import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})

export class CheckInComponent implements OnInit {

  accSvc:AuthService;

  constructor(acc:AuthService) { 
  	this.accSvc= acc;
  }


  ngOnInit() {
  }
  
}