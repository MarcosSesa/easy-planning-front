import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encodeURI',
  standalone: true,
})
export class EncodeURIPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Check if it's already a URL (starts with http or is a Google Maps short URL)
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('maps.')) {
      return value;
    }

    // Otherwise, encode it as a search query
    return encodeURIComponent(value);
  }
}
