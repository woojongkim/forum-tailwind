import { CKEditor } from "@ckeditor/ckeditor5-react";
import { uploadFile } from "./storage";

const uploadPlugin = (editor) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return CustomUploadAdapter(loader);
    }
}

const CustomUploadAdapter = (loader) => {
    return new Promise((resolve, reject) => {
        const data = new FormData();
        loader.file.then((file : File) => {
            const url = uploadFile(file, 'woody-storage');
            resolve({default: url});
        })
    })
}

export {uploadPlugin};