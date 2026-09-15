import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseDataService } from '../services/firebase-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginObj: any = {
    'username': "",
    'password': "",
  };

  constructor(private dbService: FirebaseDataService, private router: Router) {}
  onLogin() {
    debugger;
    this.dbService.getLogin(this.loginObj).subscribe((res: any) => {
      if(res.token){
        alert("Login Success");
        localStorage.setItem('a3pdmaAppToken', res.token);
        console.log("Token stored:", res.token);
        this.router.navigate(['home']);
      } else{
        alert(res.message);
      }
    });
  }

  onSignUp(){
    this.router.navigate(['signup'])
  }
}
