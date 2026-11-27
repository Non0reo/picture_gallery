console.log('UPLOAD')


const fileInput = document.querySelector('input') as HTMLInputElement;
const uploadButton = document.getElementById('upload');
const selectedImage = document.querySelector('#selected-image') as HTMLImageElement;
let uploadedFile: File;

fileInput?.addEventListener('change', (e) => {
  
  const fileList = fileInput.files ?? [];
  uploadedFile = fileList[0];
  console.log(e, uploadedFile);

  const url = URL.createObjectURL(uploadedFile);
  selectedImage.src = url;
})

uploadButton?.addEventListener('click', e => {
  console.log(e, window)

  const data = new FormData()
  data.append('file', uploadedFile);

  const url = new URL(window.location.href);
  url.port = "1425";
  url.pathname = "/api/send";

  console.log(url);

  fetch(url, {
    method: 'POST',
    body: data
  })
});