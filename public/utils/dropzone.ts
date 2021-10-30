import { Dropzone } from "dropzone";
import { state } from "../state";

export async function dropzonedImg(formulario: string, imgInput: string) {
  const form = document.querySelector(formulario);
  const pic = document.querySelector(imgInput);
  // la url la exige la librería
  const myDropzone = new Dropzone(imgInput, {
    url: "/falsa",
    autoProcessQueue: false,
    // previewTemplate: document.querySelector("#img").innerHTML,
    thumbnail: function (file, dataUrl) {
      // Display the image in your file.previewElement
      state.data.imgURL = dataUrl;
    },
  });
}
