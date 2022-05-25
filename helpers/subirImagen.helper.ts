import fetch from 'node-fetch'
import FormData from 'form-data'

const key = process.env.IMGKEY || ""

export const subirImagen = async (data: string, nombre: string): Promise<[string, any]> => {

    console.log("Entre")
    let error: any;
    let finalURL: string = "";

    const form = new FormData();
    form.append('image', data);
    let url = `https://api.imgbb.com/1/upload?key=${key}&name=${nombre}`

    const options = {
        method: 'POST',
        body: form
    }
    await fetch(url, {
        ...options
    }).then(async (res: any) => {
    const response = await res.json();
    
    console.log("🚀 ~ file: subirImagen.helper.ts ~ line 28 ~ subirImagen ~ response", response)
    return response
    }).then((data: any) => {
        finalURL = data.data.url
    }).catch(err => { error = err });

    return [finalURL, error]
}