"use client"; // Enables client-side rendering for this component

import React, { useState, useEffect, useCallback } from "react"; // Import React hooks
import Image from "next/image"; // Import Next.js Image component
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"; // Import custom Carousel components
import { Button } from "@/components/ui/button"; // Import custom Button component
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"; // Import icons

// Define the ImageData interface
interface ImageData {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
  };
}

export default function ImageSlider() {
  // State to manage the images fetched from the API
  const [images, setImages] = useState<ImageData[]>([]);
  // State to manage the current image index in the carousel
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // State to manage the play/pause status of the carousel
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const interval = 3000; // Interval for the carousel autoplay

  // Function to fetch images from Unsplash API
  const fetchImages = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}&per_page=10`
      );
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // useEffect to fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // Function to go to the next image
  const nextImage = useCallback((): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // Function to go to the previous image
  const prevImage = useCallback((): void => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // useEffect to handle the autoplay functionality
  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(nextImage, interval);
      return () => clearInterval(id);
    }
  }, [isPlaying, nextImage]);

  // Function to toggle play/pause status
  const togglePlayPause = (): void => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  // JSX return statement rendering the Image Slider UI
  return (
    <div className="flex items-center justify-center min-h-screen shadow-slate-600 bg-sky-950">
      <div className="w-full max-w-2xl mx-auto shadow-slate-600">
        <h1 className="text-3xl font-bold text-center mb-4 text-white">Image Slider</h1>
        <p className="text-center text-slate-100 mb-8 shadow-slate-600">
          A simple dynamic image slider/carousel with Unsplash.
        </p>
        <Carousel className="rounded-lg overflow-hidden relative shadow-slate-600">
        <CarouselContent>
  {images.map((image, index) => (
    <CarouselItem
      key={image.id}
      className={index === currentIndex ? "block" : "hidden"}
    >
      <div className="w-[400px] h-[400px] mx-auto border-4 border-gray-300 rounded-lg overflow-hidden shadow-slate-600">
        <Image
          src={image.urls.regular}
          alt={image.alt_description}
          width={400}
          height={400} // Fixed square container
          className="object-cover w-full h-full shadow-slate-600" // Ensures the image fills the container
        />
      </div>
      <div className="p-4 bg-white/75 text-center shadow-slate-600 mt-4"> {/* Increased padding and added margin-top */}
        <h2 className="text-lg font-bold">{image.user.name}</h2>
        <p className="text-sm">{image.description || image.alt_description}</p>
      </div>
    </CarouselItem>
  ))}
</CarouselContent>

          {/* Previous, Play/Pause, and Next buttons */}
          {/* Previous, Play/Pause, and Next buttons */}
<div className="flex justify-center gap-4 mt-4 mb-8"> {/* Added mb-8 for upward movement */}
  <Button
    variant="ghost"
    size="icon"
    onClick={prevImage}
    className="bg-white/50 hover:bg-gray-300 p-2 rounded-full shadow-md transition-colors shadow-slate-600"
  >
    <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
    <span className="sr-only">Previous</span>
  </Button>

  <Button
    variant="ghost"
    size="icon"
    onClick={togglePlayPause}
    className="bg-white/50 hover:bg-gray-300 p-2 rounded-full shadow-md transition-colors shadow-slate-600"
  >
    {isPlaying ? (
      <PauseIcon className="w-6 h-6 text-gray-800" />
    ) : (
      <PlayIcon className="w-6 h-6 text-gray-800" />
    )}
    <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
  </Button>

  <Button
    variant="ghost"
    size="icon"
    onClick={nextImage}
    className="bg-white/50 hover:bg-gray-300 p-2 rounded-full shadow-md transition-colors shadow-slate-600"
  >
    <ChevronRightIcon className="w-6 h-6 text-gray-800" />
    <span className="sr-only">Next</span>
  </Button>
</div>

        </Carousel>
      </div>
    </div>
  );
}
