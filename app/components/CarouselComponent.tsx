"use client";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";


interface CarouselProps {
  imagesUrls: string[]
}

export default function CarouselComponent(props: CarouselProps) {
  return (
    <>
      <Carousel
        showArrows={true}
        showIndicators={false}
        infiniteLoop={true}
        dynamicHeight={false}
        showThumbs={false}
        className="w-full h-2"
      >
        {props.imagesUrls.map((image) => (
          <div key={image} className="flex items-center justify-center h-full w-full">
              <Image
                key={image}
                alt="Asset image"
                src={image}
                width={1280}
                height={720}
                className="max-h-[300px] object-contain"
              /> 
            </div>
        ))}
      </Carousel>
    </>
  );
}
