import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Package } from '../models/package';

@Component({
  selector: 'app-delete-package',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './delete-package.component.html',
  styleUrl: './delete-package.component.css'
})
export class DeletePackageComponent {
  packagesDB: any[] = [];
  constructor(private dbService: DatabaseService, private router: Router){}

  onGetPackages(){
    return this.dbService.getPackages().subscribe((data: any) => {
      this.packagesDB = data;
    });
  }

  onDeletePackage(item: any){
    this.dbService.deletePackage(item._id).subscribe(result => {
      this.onGetPackages();
      this.router.navigate(["/list-packages"]);
    });
  }

  ngOnInit(){
    this.onGetPackages();
  }
}
