import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from "@angular/core";
import Cropper from "cropperjs";
import { from, Subscription } from "rxjs";
import { finalize } from "rxjs/operators";

export interface CroppResult {
  imageData: Cropper.ImageData;
  cropData: Cropper.CropBoxData;
  blob?: Blob;
  dataUrl?: string;
}

@Component({
  selector: "app-cropper",
  templateUrl: "./cropper.component.html",
  styleUrls: ["./cropper.component.scss"]
})
export class CropperComponent implements AfterViewInit, OnDestroy {
  @Input() aspectRatio: number = 1;
  @Input() cropHeight: number = 208;
  @Input() cropWidth: number = 208;
  @Input() imgUrl: string =
    "https://fengyuanchen.github.io/cropperjs/images/picture.jpg";
  @Output() cropped = new EventEmitter<CroppResult>();
  @Output() closed = new EventEmitter<void>();

  processing: boolean;
  cropper: Cropper;
  initZoomValue: number = 0.2651515;
  zoomValue: number = 0.2651515;
  zoomStep: number = 0.01;
  exportSubscription: Subscription;

  @ViewChild("image") image: ElementRef;

  ngAfterViewInit() {
    this.image.nativeElement.addEventListener(
      "zoom",
      e => this.syncZoomRange(e),
      false
    );
  }

  private syncZoomRange($event) {
    if (!$event) return;
    const { ratio } = $event.detail;
    if (ratio > 1.1 || ratio < 0) {
      $event.preventDefault();
      return;
    }
    this.zoomValue = ratio;
  }

  imageLoaded($event: Event) {
    if (!$event) return;
    const image = $event.target as HTMLImageElement;
    this.initCropper(image);
  }

  private initCropper(image: HTMLImageElement) {
    if (!image) return;
    image.crossOrigin = "anonymous";
    const cropperOptions: Cropper.Options = {
      dragMode: "move",
      restore: false,
      guides: false,
      center: false,
      minCropBoxHeight: this.cropHeight,
      minCropBoxWidth: this.cropWidth,
      highlight: true,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      checkCrossOrigin: false,
      aspectRatio: this.aspectRatio,
      viewMode: 3,
      background: false
    };

    this.destroyCropper();
    this.cropper = new Cropper(image, cropperOptions);
  }

  setZoom($event) {
    if (!$event) return;
    this.zoomValue = $event;
    this.cropper.zoomTo(this.zoomValue);
  }

  close() {
    this.zoomValue = this.initZoomValue;
    this.cropper.reset();
    this.closed.emit();
  }

  exportCanvas(base64?: any) {
    const imageData = this.cropper.getImageData();
    const cropData = this.cropper.getCropBoxData();
    const canvas = this.cropper.getCroppedCanvas();
    const roundedCanvas = this.getRoundedCanvas(canvas);
    const data = { imageData, cropData };

    const promise = new Promise(resolve => {
      if (base64) {
        return resolve({
          dataUrl: roundedCanvas.toDataURL("image/png")
        });
      }
      roundedCanvas.toBlob(blob => resolve({ blob }));
    });
    this.toggleProcessingState();
    const observable = from(promise);
    this.exportSubscription = observable
      .pipe(finalize(() => this.toggleProcessingState()))
      .subscribe((res: any) => {
        this.cropped.emit({ ...data, ...res });
        this.close();
      });
  }

  private toggleProcessingState() {
    this.processing = !this.processing;
  }

  private getRoundedCanvas(sourceCanvas) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const width = this.cropWidth,
      height = this.cropHeight;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = "destination-in";
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    return canvas;
  }

  private destroyCropper() {
    if (!this.cropper) return;
    this.cropper.destroy();
    this.cropper = null;
  }

  ngOnDestroy() {
    this.destroyCropper();
    if (this.exportSubscription) this.exportSubscription.unsubscribe();
    if (this.image) {
      this.image.nativeElement.removeEventListener(
        "zoom",
        e => this.syncZoomRange(e),
        false
      );
    }
  }
}
