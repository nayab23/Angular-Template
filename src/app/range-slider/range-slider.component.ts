import { Component, EventEmitter, Input,  OnInit, Output } from '@angular/core';

export enum RangeSlideAction {
  REDUCE = 'reduce',
  ADD = 'add'
}

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent implements OnInit {
  
  RangeSlideAction=RangeSlideAction;

  @Input() value:number = 0.2651515;
  @Input() min:number = 0.2651515;
  @Input() max:number = 1;
  @Input() step:number = 0.0001;
  @Input() clickStep:number = 0.01;

  @Output() changed = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  doSliderAction(action:RangeSlideAction){
    let value = 0;
    switch (action) {
      case RangeSlideAction.ADD:
        value = this.value + this.clickStep;
        break;
      case RangeSlideAction.REDUCE:
        value = this.value - this.clickStep;
        break;
      default:
        break;
    }
    this.emitChangeEvent(value);
  }
  
  updateValue($event){
    if(!$event) return;
    const value = +$event.target.value;
    this.emitChangeEvent(value);
  }

  private emitChangeEvent(value:number){
    this.value = value;
    this.changed.emit(this.value);
  }
}