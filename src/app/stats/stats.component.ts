import { Component } from '@angular/core';
import { FirebaseDataService } from '../services/firebase-data.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Driver } from '../models/driver';
import { Package } from '../models/package';

interface Stats{
  create: number;
  retrieve: number;
  update: number;
  delete: number;

}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})

export class StatsComponent {
  stats: Stats = {create:0, retrieve: 0, update: 0, delete: 0};
  driversDB: Driver[] = [];
  packagesDB: Package[] = [];
  isLoading = true;

  constructor(private dbService: FirebaseDataService, private driverPackageDatabase: DatabaseService, private router: Router){}
  onGetStats(){
    this.isLoading = true;
    return this.dbService.getStats().subscribe((data: any) => {
      this.stats = data;
      this.isLoading = false;
      console.log(this.stats);
    });
  }

  onGetDrivers(){
    this.isLoading = true;
    return this.driverPackageDatabase.getDrivers().subscribe((data: any) => {
      this.driversDB = data;
      this.isLoading = false;
    });
  }

  onGetPackages() {
    this.isLoading = true;
    return this.driverPackageDatabase.getPackages().subscribe((data: any) => {
      this.packagesDB = data;
      this.isLoading = false;
    });
  }

  ngOnInit(){
    this.onGetStats();
    this.onGetDrivers();
    this.onGetPackages();
  }
}
