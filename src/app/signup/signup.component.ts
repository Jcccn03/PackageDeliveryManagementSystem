import { Component } from '@angular/core';
import { FirebaseDataService } from '../services/firebase-data.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupObj: any = {
    'username': "",
    'password': "",
    'confirmPassword': "",
  };

  constructor(private dbService: FirebaseDataService, private router: Router){}
  onSignUp(){
    debugger;
    this.dbService.getSignUp(this.signupObj).subscribe((res: any) => {
      
      if(res.message == "Sign up successfully"){
        console.log("from onSignUp(): Signup successfully");
        alert('Sign up successfully')
        this.router.navigate(['/login']);
      }else if(res.message == 'User already exists. Please login.'){
        alert(res.message);
      } else{
        console.log(res.message);
        alert(res.message);
      }
    })
  }

  onLogin(){
    this.router.navigate(['login']);
  }
}
