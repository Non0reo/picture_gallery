import { createClient } from '@supabase/supabase-js'

export class Database {
  supabaseClient = createClient(import.meta.env.VITE_STORAGE_URL, import.meta.env.VITE_STORAGE_KEY);
  private _bucket = this.supabaseClient.storage.from('pictures');

  constructor() {

  }

  async getAllPictures() {
    const { data, error } = await this._bucket.list();
    if (error) return this._onError(error);

    // const downloadPromises = data?.map(file => new Promise<Blob>((resolve) => resolve(this.download(file.name)) ))
    const downloadPromises = data?.map(file => this.download(file.name));
    const pictureList = await Promise.allSettled(downloadPromises);

    console.log(pictureList);
  }

  async download(name: string) {
    const { data, error } = await this._bucket.download(name);
    if (error) return this._onError(error);

    return data;
  }

  private _onError(error: any) {
    console.error('Got error while manipulating database:\n' + error.message);
    console.error(error.stack);
    return null
  }
} 