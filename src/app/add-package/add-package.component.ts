import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Package } from '../models/package';
import { Driver } from '../models/driver';
@Component({
  selector: 'app-add-package',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-package.component.html',
  styleUrl: './add-package.component.css'
})
export class AddPackageComponent {
  package: Package = new Package();
  drivers: any[] = [];
  constructor(private dbService: DatabaseService, private router: Router){}

  onSavePackage(){
    this.dbService.addPackage(this.package).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['list-packages']);
    });
  }

  onGetDrivers(){
    return this.dbService.getDrivers().subscribe((data: any) => {
      this.drivers = data;
    });
  }

  ngOnInit(){
    this.onGetDrivers();
  }
}
