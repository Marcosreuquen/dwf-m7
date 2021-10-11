import { Dropzone } from "dropzone";

(async () => {
  console.log("hola");
  const form = document.querySelector(".form");
  let filePic;
  // la url la exige la librería
  const myDropzone = new Dropzone(".foto-input", {
    url: "/falsa",
    autoProcessQueue: false,
  });
  myDropzone.on("addedfile", function (file) {
    // usando este evento pueden acceder al dataURL directamente
    filePic = file;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const targets = event.target as any;
    console.log(filePic);
    const dataURL = filePic.dataURL;
    const fullName = targets.fullName.value;
    const bio = targets.bio.value;
    console.log({ fullName, bio, dataURL });

    const req = await fetch("http://localhost:8080/profile", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ fullName, bio, dataURL }),
    });
    console.log(req);
  });

  const formIdReq = document.querySelector(".form-show");
  formIdReq.addEventListener("submit", async (event: any) => {
    event.preventDefault();
    const id = event.target.id.value;
    try {
      const req = await fetch(`http://localhost:8080/profile?id=${id}`);
      const res = await req.json();
      console.log(res);
      const imgInput = document.querySelector(".foto-input");
      const img = document.createElement("img");
      let imgURL: any = await fetch(res.dataURL);
      imgURL = imgURL.url;
      console.log(imgURL);
      img.src = imgURL;
      if (imgInput.firstChild) {
        imgInput.firstChild.remove();
        imgInput.appendChild(img);
      } else {
        imgInput.appendChild(img);
      }

      form.fullName.value = res.fullName;
      form.bio.value = res.bio;
    } catch (err) {
      console.log(err);
    }
  });
})();
// input__textarea
// foto-input

// <form class="form">
// <label class="label">
//   Nombre
//   <input type="text" name="fullName" class="input__fullName" />
// </label>
// <label class="label">
//   Bio
//   <textarea name="bio" class="input__textarea"></textarea>
// </label>
// <div class="foto-input">Arrastrár foto aquí</div>
// <button class="form__submit">Enviar</button>
// </form>
// <form class="form-show">
// <input type="text" name="id" class="id" />
// <button class="show">Show Profile</button>
// </form>
