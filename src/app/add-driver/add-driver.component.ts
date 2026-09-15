import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Driver } from '../models/driver';
@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-driver.component.html',
  styleUrl: './add-driver.component.css'
})
export class AddDriverComponent {
  driver: Driver = new Driver();

  constructor(private dbService: DatabaseService, private router: Router){}

  onSaveDriver(){
    this.dbService.addDriver(this.driver).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['list-drivers']);
    });
  }
}
