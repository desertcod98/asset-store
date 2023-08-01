"use client";

import { FieldValues, useForm } from "react-hook-form";
import Button from "../components/Button";
import { toast } from "react-hot-toast";

export default function Upload() {
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      files: null,
      thumbnail: null,
    },
  });

  function onSubmit(data: FieldValues) {
    fetch("/api/asset", {
      method: "POST",
      body: objectToFormData(data),
    }).then((res) => {
      if (res.status !== 200) {
        res.text().then((error) => toast.error(error));
      }
    });
  }

  //TODO make this not horrible

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
      <input type="file" {...register("files")} id="files" multiple required />
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

function objectToFormData(obj: any) {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "string") formData.append(key, value);
    else if (typeof value === "object") formData.append(key, value as Blob);
  });

  return formData;
}
