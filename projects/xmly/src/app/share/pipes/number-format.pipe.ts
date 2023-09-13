import { Pipe, PipeTransform } from '@angular/core';
import { round } from 'lodash'

type unitTypes = '万' | '亿';
enum Exponent {
  '万' = 10000,
  '亿' = 100000000,
}

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, unit: unitTypes = '万', precicion = 1): number {
    return round(value / Exponent[unit], precicion)
  }

}
