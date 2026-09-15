import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kgToGram',
  standalone: true
})
export class KgToGramPipe implements PipeTransform {

  transform(value: number): number {
    return (value*1000);
  }

}
