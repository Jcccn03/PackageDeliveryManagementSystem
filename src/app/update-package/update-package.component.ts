import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-package',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-package.component.html',
  styleUrl: './update-package.component.css'
})
export class UpdatePackageComponent {
  id: string = "";
  packageDestination = "";
  packagesDB: any[] =[];
  constructor(private dbService: DatabaseService, private router: Router){}

  onGetPackages(){
    console.log("From onGetPackages");
    return this.dbService.getPackages().subscribe((data: any) => {
      this.packagesDB = data;
    });
  }

  onSelectUpdate(item: any){
    console.log("From onSelectUpdate");
    console.log(item._id);
    this.id = item._id;
    this.packageDestination = item.packageDestination;
  }

  onUpdatePackage(){
    if(!this.id){
      console.error("Package ID is missing!");
      alert("Please select a package to update");
      return;
    }
    console.log(this.id);
    let obj = {destination: this.packageDestination};
    this.dbService.updatePackage(this.id, obj).subscribe(result => {
      this.onGetPackages();
      this.router.navigate(['/list-packages']);
    });
  }

  ngOnInit(){
    console.log("UpdatePackageComponent initialized");
    this.onGetPackages();
  }
}
