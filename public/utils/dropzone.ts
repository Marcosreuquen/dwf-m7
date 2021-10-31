import { Dropzone } from "dropzone";
import { state } from "../state";

export async function dropzonedImg(pic, buttonImg) {
  const myDropzone = new Dropzone(pic, {
    url: "/falsa",
    autoProcessQueue: false,
    // previewTemplate: document.querySelector("#img").innerHTML,
    clickable: true,
    clickeableElements: buttonImg,
    thumbnail: function (file, dataUrl) {
      // Display the image in your file.previewElement
      pic.setAttribute("src", dataUrl);
    },
    init: function () {
      buttonImg.addEventListener("buttonClicked", (e) => {
        this.processQueue();
      });
    },
  });
}
