import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invaliddata',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './invaliddata.component.html',
  styleUrl: './invaliddata.component.css'
})
export class InvaliddataComponent {
  errorMsg: string | null = null;
  constructor(private route: ActivatedRoute){  }

  ngOnInit() {
    // retrieve error msg from the navigation route
    this.errorMsg = this.route.snapshot.paramMap.get('id');
  }

}
