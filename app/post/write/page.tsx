'use client';

import { iImage } from "@/types/img";
import { uploadPlugin } from "@/util/editor";
import { publicStorageUrl } from "@/util/storage";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";

interface Props {
  title: string;
  content: string;
  files: iImage[];
}

const PostWrite = () => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });
  const [imgList, setImgList] = useState([] as iImage[]);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const changeValue = (event : ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setPostData({
      ...postData,
      [name]: value,
    });

    console.log(name, value);
    console.log(postData);
  };

  const uploadFile = async (event : ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    let list = [] as iImage[];
    if (event.target.files && event.target.files.length && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const ext = file.name.split(".").pop();
        const res = await axios.post("/api/storage", { size: file.size, type: file.type, name: file.name });

        const formData = new FormData();
        Object.entries({ file }).forEach(([key, value]) => {
          formData.append(key, value);
        });


        const response = await fetch(res.data.url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          }
        });

        list.push({ _id: res.data._id, src: `${publicStorageUrl}/${res.data._id}.${ext}` });
      }
    }

    console.log("list", list);

    setImgList(list);
  };

  const lazyUploadFile = (event : ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    let list = [] as iImage[];
    if (event.target.files && event.target.files.length && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const imageUrl = URL.createObjectURL(file);
        list.push({ _id: `${i}`, src: imageUrl });
      }
    }

    setImgList(list);
  };

  const submitPost = async () => {
    let prop = {
      ...postData,
      files: [] as iImage[]
    }

    console.log("fileList", fileRef.current?.files);

    if (fileRef.current?.files && fileRef.current?.files.length > 0) {
      for (let i = 0; i < fileRef.current?.files.length; i++) {
        const file = fileRef.current?.files[i];
        const ext = file.name.split(".").pop();
        const res = await axios.post("/api/storage", { size: file.size, type: file.type, name: file.name });
        prop.files.push({ _id: res.data._id, src: `${res.data._id}.${ext}` });

        const formData = new FormData();
        Object.entries({ file }).forEach(([key, value]) => {
          formData.append(key, value);
        });


        fetch(res.data.url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          }
        });
      }
    }

    fetch("/api/post", {
      method: "POST",
      body: JSON.stringify(prop),
    }).then((res) => res.json()).then((res) => {
      console.log("res", res);
      alert("게시글이 등록되었습니다.");
      router.push(`/post/${res._id}`);
    });

  }



  return (
    <div className="flex flex-col flex-wrap content-center justify-center h-full gap-5">
      <div className="max-w-2xl ">
        <input
          type="text"
          placeholder="제목"
          name="title"
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
          onChange={changeValue}
        />
        <CKEditor
          editor={ClassicEditor}
          data="<p>Hello from CKEditor 5!</p>"
          // config={{ // (4)
          //   extraPlugins: [uploadPlugin]
          // }}
          onReady={editor => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
            setPostData({
              ...postData,
              content: data
            })
          }}
          onBlur={(event, editor) => {
            console.log('Blur.', editor);
          }}
          onFocus={(event, editor) => {
            console.log('Focus.', editor);
          }}
        />

        <div className="mb-4">
          <input type="file" ref={fileRef} name="file" accept="image/*" placeholder="select file" multiple onChange={lazyUploadFile}></input>
          <div className="grid grid-cols-4 gap-3">
            {
              imgList.length > 0 && imgList.map((img) => {
                return (
                  <img className="object-scale-down w-40 h-40 col-span-1 rounded-full" key={img._id} src={img.src} />
                );
              })
            }
          </div>
        </div>
        <button
          type="button"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={submitPost}
        >
          작성
        </button>
      </div>
    </div>
  );
};

export default PostWrite;