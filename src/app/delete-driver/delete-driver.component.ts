import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Driver } from '../models/driver';
@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './delete-driver.component.html',
  styleUrl: './delete-driver.component.css'
})
export class DeleteDriverComponent {
  driversDB: Driver[] = [];
  constructor(private dbService: DatabaseService, private router: Router){}

  onGetDrivers(){
    return this.dbService.getDrivers().subscribe((data: any) => {
      this.driversDB = data;
    });
  }

  onDeleteDriver(item: any){
    this.dbService.deleteDriver(item._id).subscribe(result => {
      this.onGetDrivers();
      this.router.navigate(["/list-drivers"]);
    });
  }

  ngOnInit(){
    this.onGetDrivers();
  }
}
