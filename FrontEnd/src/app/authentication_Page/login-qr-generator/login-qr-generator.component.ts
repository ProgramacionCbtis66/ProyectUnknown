import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-qr-generator',
  templateUrl: './login-qr-generator.component.html',
  styleUrls: ['./login-qr-generator.component.css']
})
export class LoginQRGeneratorComponent implements OnInit {

  constructor() { 
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
  }

}
