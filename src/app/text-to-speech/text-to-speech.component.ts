import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { Driver } from '../models/driver';
import {io} from 'socket.io-client';

@Component({
  selector: 'app-text-to-speech',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './text-to-speech.component.html',
  styleUrl: './text-to-speech.component.css'
})
export class TextToSpeechComponent {
  driversDB:Driver[] = [];
  textToConvert: string = '';  
  getSpeechIsClicked: boolean = false;
  audioData: string | null = null;
  audioFileName: string = 'output.mp3';
  socket: any;
  convertedFilePath: string = ''

  constructor(private dbService: DatabaseService){
    this.socket = io();
    this.socket.on('text2speechResponse', (data: any) => {
      console.log('audio data received at text to speech component');
      setTimeout(() => {
        this.convertedFilePath = '';
        this.convertedFilePath = data.audioFileUrl;
        console.log(data.audioFileUrl);
        this.reloadAudio(data.audioFileUrl);

      }, 500);
    })
  }

  onGetSpeech(driverLicense: string){ // send message to backend through socket
    this.textToConvert = driverLicense;
    this.socket.emit('text2speechRequest', {driverLicense: this.textToConvert});
    this.getSpeechIsClicked = true;
  }

  onGetDrivers(){
    console.log("onGetDrivers() from text-to-speech")
    return this.dbService.getDrivers().subscribe((data: any) => {
      this.driversDB = data;
    });
  }

  ngOnInit(){
    this.onGetDrivers();
  }

  reloadAudio(data: any){
    const audioElement = document.getElementById('audioPlayer') as HTMLAudioElement;
    const audioSource = document.getElementById('audioSource') as HTMLSourceElement;
    audioSource.src = '';

    setTimeout(() => {
      audioElement.pause();
      audioSource.src = data;
      audioElement.load();
    }, 500);
  }

}
