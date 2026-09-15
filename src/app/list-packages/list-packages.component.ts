import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KgToGramPipe } from '../pipes/kg-to-gram.pipe';
import { UpperCasePipe } from '../pipes/upper-case.pipe';

@Component({
  selector: 'app-list-packages',
  standalone: true,
  imports: [FormsModule, KgToGramPipe, UpperCasePipe],
  templateUrl: './list-packages.component.html',
  styleUrl: './list-packages.component.css'
})
export class ListPackagesComponent {
  packagesDB: any[] = [];
  getDriverIsClicked: boolean = false;
  driverForAPackage: any;
  packageToBeDelete: any;
  packageSelected: any;
  isLoading:boolean = true;
  packagesLoading: boolean = true;

  constructor(private dbService: DatabaseService, private router: Router){}

  onGetPackages(){
    return this.dbService.getPackages().subscribe((data: any) => {
      this.packagesDB = data;
      this.packagesLoading = false;
    });
  }

  onDeletePackage(item: any){
    this.packageToBeDelete = item._id;
    this.dbService.deletePackage(item._id).subscribe(result => {
      this.onGetPackages();
    });
    if(this.packageToBeDelete == this.packageSelected){
      this.packageSelected = null;
    }
  }

  onGetDriver(aPackage: any){
    this.packageSelected = aPackage._id;
    this.getDriverIsClicked = true;
    this.dbService.getPackage(aPackage._id).subscribe((data: any) => {
      console.log(data);
      this.driverForAPackage = data.driverId;
      this.isLoading = false;
      console.log(this.driverForAPackage);
    });
  }

  ngOnInit(){
    this.onGetPackages();
  }
}
