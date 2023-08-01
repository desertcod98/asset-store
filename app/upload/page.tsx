"use client";

import { FieldValues, useForm } from "react-hook-form";
import Button from "../components/Button";
import { toast } from "react-hot-toast";
import { type } from "os";

interface FormSubmitData{
  name: string;
  description: string;
  files: FileList;
  thumbnail: FileList;
  images: FileList;
}

export default function Upload() {
  const { register, handleSubmit, reset } = useForm<FormSubmitData>({
    defaultValues: {
      name: "",
      description: "",
      files: undefined,
      thumbnail: undefined,
      images: undefined
    },
  });

  function onSubmit(data: FormSubmitData) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    for (const file of data.files){
      formData.append("files", file);
    }
    formData.append("thumbnail", data.thumbnail[0]);
    for (const image of data.images){
      formData.append("images", image);
    }
    console.log(formData);
    fetch("/api/asset", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status !== 200) {
        res.text().then((error) => toast.error(error));
      }
    });
  }

  //TODO make this not horrible
  //TODO make user able to select category

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="flex flex-col gap-5"
    >
      {/* <input type="file" {...register('file')} multiple directory="" webkitdirectory=""/> TODO allow for directory upload*/}
      <input
        type="text"
        {...register("name")}
        placeholder="Asset name..."
        required
      />
      <input
        type="text"
        {...register("description")}
        placeholder="Asset description..."
        required
      />
      <input
        type="file"
        {...register("files")}
        id="files"
        multiple
        required
      />
      <input
        type="file"
        {...register("images")}
        id="images"
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
        {...register("thumbnail")}
        id="thumbnail"
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
  );
}
