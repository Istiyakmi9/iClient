import { Directive, ElementRef, Input, HostListener } from "@angular/core";

@Directive({ selector: "input[NumberType]" })
export class NumberOnlyDirective {
  @Input() FloatType: boolean;
  AllowedKeys: Array<number> = [8, 46, 37, 39];
  constructor(private elemRef: ElementRef) {}

  @HostListener("keydown", ["$event"]) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if (this.FloatType) {
      if (this.AllowedKeys.indexOf(e.which) !== -1) {
        return;
      } else {
        if (e.which === 190) {
          let textvalue = event.currentTarget.value;
          if (textvalue.indexOf(".") !== -1) e.preventDefault();
          else return;
        } else {
          let value = Number(e.key);
          if (!isNaN(Number(e.key)) && value >= 0 && value < 9) return;
          else e.preventDefault();
        }
      }
    }
  }
}
