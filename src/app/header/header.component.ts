import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseDataService } from '../services/firebase-data.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private dbService: FirebaseDataService, private router: Router){}

  onLogout(){
    return this.dbService.getLogOut().subscribe((data: any) => {
      localStorage.removeItem("a3pdmaAppToken");
      alert(data.message);
      this.router.navigate(['login']);
    });
  }
}
