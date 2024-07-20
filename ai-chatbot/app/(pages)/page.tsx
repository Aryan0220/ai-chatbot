"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "../loading";

const Explore: React.FC = () => {
  const { user, loading } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchImages = async () => {
      const mockImages = [
        '/images/2.jpg',
        '/images/3.jpg',
        '/images/5.jpg'
      ];
      setImages(mockImages);
    };

    fetchImages();
  }, []);

  return (
    <div className="flex flex-col gap-y-5 h-full w-full px-4">
      <h1 className="text-6xl font-bold">Explore AI Generated Images</h1>
      {loading ? (
        <Loading />
      ) 
      : 
        <div className="mt-8 ml-8 grid justify-items-center place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <Image 
          width={500} 
          height={200}
          className="object-cover transition-transform hover:translate-x-1 hover:translate-y-2 rounded-md" 
          key={index} 
          src={image} 
          alt="Generated" />
      ))}
    </div>
      }
    </div>
  );
};

export default Explore;
