"use client";

import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form";

interface Fields {
  query: string;
}

export default function SearchBar({value}: {value?: string}) {
  const { register, handleSubmit } = useForm<Fields>();
  const router = useRouter()

  function onSubmit(fields: Fields){
    router.push("/search/"+fields.query)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-2/3'>
      <input
        type="text"
        placeholder="Search assets..."
        value={value}
        {...register("query")}
        className="w-full h-10 rounded border-2 px-2"
      />
    </form>
  );
}
