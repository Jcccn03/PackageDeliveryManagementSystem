import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {io} from 'socket.io-client';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-translate-description',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './translate-description.component.html',
  styleUrl: './translate-description.component.css'
})
export class TranslateDescriptionComponent {
  msg: string = '';
  lang: string = '';
  response: string = '';
  socket: any;
  packagesDB: any[] = [];
  translateIsClicked: boolean = false;
  translatedTexts: any[] = [];

  constructor(private dbService: DatabaseService){
    this.socket = io();
    this.socket.on('translationResponse', (data: any) => {
      console.log(data);
      this.response = data.translatedText;
      this.translatedTexts.push({text: this.msg, language: this.lang, translation: this.response});
    });

  }

  sendRequest(packageDescription: string){
    if(!this.lang){
      alert("Please select a target language.");
      return;
    }

    if(!packageDescription || packageDescription.length == 0){
      alert("The package selected does not have a description.");
      return;
    }

    this.translateIsClicked = true;
    this.msg = packageDescription;
    console.log(this.msg);
    console.log(this.lang);
    this.socket.emit('translateRequest', {description: this.msg, language: this.lang});
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
