"use client";

import Button from "../components/Button";
import { useUploadThing } from "@/utils/uploadthing";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormSubmitData {
  name: string;
  description: string;
  file: FileList;
  thumbnail: FileList;
  images: FileList;
}

export default function UploadMain(){

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
    },
    onUploadError: (e) => {
      console.log(e)
    },
  });

  const {register, handleSubmit} = useForm<FormSubmitData>();

  async function onSubmit(data: FormSubmitData) {
    const fileRes = await startUpload(Array.from(data.file))
    const thumbnailRes = await startUpload(Array.from(data.thumbnail))
    const imagesRes = await startUpload(Array.from(data.images))
    if(!fileRes || !thumbnailRes || !imagesRes){
      return;
    }

    const assetData = {
      name: data.name,
      description: data.description,
      file: fileRes,
      thumbnail: thumbnailRes,
      images: imagesRes
    }

    fetch("/api/asset", {
      method: "POST",
      body: JSON.stringify(assetData),
    }).then((res) => {
      if (res.status !== 200) {
        res.text().then((error) => toast.error(error));
      }
    });
  }
  

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* <input type="file" {...register('file')} multiple directory="" webkitdirectory=""/> TODO allow for directory upload*/}
        <input
          type="text"
          id="name"
          {...register('name')}
          placeholder="Asset name..."
          required
        />
        <input
          type="text"
          id="description"
          {...register('description')}
          placeholder="Asset description..."
          required
        />
        <input
          type="file"
          id="file"
          {...register('file')}
          required
        />
        <input
          type="file"
          id="images"
          {...register('images')}
          accept="image/*"
          multiple
          required
        />
        {/* <label
        className="cursor-pointer border-2 p-2 rounded border-black w-fit"
        id="file-input-label"
        htmlFor="files"
      >
        Select asset files
      </label> */}

        <input
          type="file"
          id="thumbnail"
          {...register('thumbnail')}
          accept="image/*"
          required
        />
        {/* <label
        className="cursor-pointer border-2 p-2 rounded border-black w-fit"
        id="file-input-label"
        htmlFor="thumbnail"
      >
        Select a thumbnail
      </label> */}
        <Button type="submit">asd</Button>
      </form>
    </>
  )}