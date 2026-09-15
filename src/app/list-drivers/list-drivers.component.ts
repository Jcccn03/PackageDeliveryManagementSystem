import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { Driver } from '../models/driver';
import { Router } from '@angular/router';
import { UpperCasePipe } from '../pipes/upper-case.pipe';
import { Package } from '../models/package';
import { KgToGramPipe } from '../pipes/kg-to-gram.pipe';
@Component({
  selector: 'app-list-drivers',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, KgToGramPipe],
  templateUrl: './list-drivers.component.html',
  styleUrl: './list-drivers.component.css'
})
export class ListDriversComponent {
  driversDB: Driver[] = [];
  packageForADriver: Package[] = [];
  getPackageIsClicked: boolean = false;
  isLoading: boolean = true;
  isDriverLoading: boolean = true;
  driverToBeDelete: any;
  driverToFindPackage: any;

  constructor(private dbService: DatabaseService, private router: Router){}

  onGetDrivers(){
    this.isDriverLoading = true;
    return this.dbService.getDrivers().subscribe((data: any) => {
      this.driversDB = data;
      this.isDriverLoading = false;
    });
  }

  onDeleteDriver(item: any){
    this.driverToBeDelete = item._id;
    this.dbService.deleteDriver(item._id).subscribe(result => {
      this.onGetDrivers();
    });
    if(this.driverToBeDelete == this.driverToFindPackage){
      this.driverToFindPackage = null;
    }
  }

  onGetPackages(driver: any){
    this.isLoading = true;
    this.driverToFindPackage = driver._id;
    this.getPackageIsClicked = true;
    this.dbService.getDriver(driver._id).subscribe((data: any) => {
      this.packageForADriver = data.assignedPackages;
      this.isLoading = false;
      console.log(this.packageForADriver);
    });
  }

  ngOnInit(){
    this.onGetDrivers();
  }
}
