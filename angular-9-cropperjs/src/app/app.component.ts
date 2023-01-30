import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ModalService } from "./modal/modal.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit{

  src:any;
  modalId:string = 'modal';
  constructor(private _modalService:ModalService){}

  ngOnInit() {}

  ngAfterViewInit() {
    this.openModal(`${this.modalId}-1`);
  }

  showCroppResult($event){
    if(!$event)return;
    this.createImageFromBlob($event.blob);
    this.openModal(this.modalId);
  }

  private  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.src = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  openModal(id: string) {
    this._modalService.open(id);
  }

  closeModal(id: string) {
    this._modalService.close(id);
  }
}