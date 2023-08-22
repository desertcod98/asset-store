"use client";

import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form";

interface Fields {
  query: string;
}

export default function SearchBar() {
  const { register, handleSubmit } = useForm<Fields>();
  const router = useRouter()

  function onSubmit(fields: Fields){
    if(fields.query){
      router.push("/search/"+fields.query)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-2/3'>
      <input
        type="text"
        placeholder="Search assets..."
        {...register("query")}
        className="w-full h-10 rounded border-2 px-2"
      />
    </form>
  );
}
