import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-driver.component.html',
  styleUrl: './update-driver.component.css'
})
export class UpdateDriverComponent {
  id: string = "";
  license: string = "";
  department: string = "";

  driversDB: any[] = [];

  constructor(private dbService: DatabaseService, private router: Router){}

  onGetDrivers(){
    console.log("From onGetDrivers()");
    return this.dbService.getDrivers().subscribe((data: any) => {
      this.driversDB = data;
    });
  }

  onSelectUpdate(item: any){
    console.log("From onSelectUpdate");
    console.log(item._id);
    this.id = item._id;
    this.license = item.driverLicense;
    this.department = item.driverDepartment;
  }
  
  onUpdateDriver(){
    if (!this.id) {
      console.error("Driver ID is missing!");
      alert("Please select a driver to update");
      return; // Prevent the update if ID is missing
  }
    console.log(this.id);
    let obj = {driverLicense: this.license, driverDepartment: this.department};
    this.dbService.updateDriver(this.id, obj).subscribe(result => {
      this.onGetDrivers();
      this.router.navigate(['/list-drivers']);
    });
  }

  ngOnInit(){
    console.log("UpdateDriverComponent initialized");
    this.onGetDrivers();
  }
}
