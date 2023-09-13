import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

type contentType = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';

@Pipe({
  name: 'safeContent'
})
export class SafeContentPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: string | undefined, type: contentType = 'html'): unknown {
    if (value) {
      switch (type) {
        case 'html':
          return this.sanitizer.bypassSecurityTrustHtml(value);
        case 'style':
          return this.sanitizer.bypassSecurityTrustStyle(value);
        case 'script':
          return this.sanitizer.bypassSecurityTrustScript(value);
        case 'url':
          return this.sanitizer.bypassSecurityTrustUrl(value);
        case 'resourceUrl':
          return this.sanitizer.bypassSecurityTrustResourceUrl(value);
        default:
          return this.sanitizer.bypassSecurityTrustHtml(value);
      }
    } else {
      return
    }
  }
}