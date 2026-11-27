import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://isczyjfurffqhqmpyrfq.supabase.co', import.meta.env.VITE_STORAGE_KEY)



console.log(supabase)
console.log(await supabase.storage.listBuckets());

// const { data, error } = await supabase.storage.getBucket('pictures').

const bucket = await supabase.storage.from('pictures');
const fileList = await bucket.list()

console.log(fileList)

fileList.data?.forEach(async file => {
  const picture = await bucket.download(`${file.name}`);
  console.log(picture)
})


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

uploadButton?.addEventListener('click', async e => {
  console.log(e, window)

  const infoP = document.querySelector('#info') as HTMLParagraphElement;

  const { name } = uploadedFile;
  const { data, error } = await bucket.upload(name, uploadedFile);

  if (error) infoP.textContent = error.message;
});