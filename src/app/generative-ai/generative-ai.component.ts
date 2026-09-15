import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import {io} from 'socket.io-client';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-generative-ai',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './generative-ai.component.html',
  styleUrl: './generative-ai.component.css'
})
export class GenerativeAiComponent {
  socket: any;
  packagesDB: any[] = [];
  response: string = '';
  constructor(private dbService: DatabaseService){
    this.socket = io();
    this.socket.on('distanceResponse', (data: any) => {
      console.log(data);
      this.response = data.aiResponse;
    });
  }
  

  getDistance(packageDestination: string){
    console.log(packageDestination);
    this.socket.emit('distanceRequest', {location: packageDestination});
  }

  onGetPackages(){
    return this.dbService.getPackages().subscribe((data: any) => {
      this.packagesDB = data;
    });
  }

  ngOnInit(){
    this.onGetPackages();
  }
}
