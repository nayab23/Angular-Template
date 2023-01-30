import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CropperComponent } from './cropper/cropper.component';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal/modal.service';
import { LoaderComponent } from './loader/loader.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, CropperComponent, ModalComponent, LoaderComponent, RangeSliderComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ModalService]
})
export class AppModule { }
