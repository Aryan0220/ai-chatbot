"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./context/auth-context";
import { signInWithGoogle, logout } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Explore: React.FC = () => {
  const { user, loading } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchImages = async () => {
      const mockImages = [
        '/images/1.jpg',
        '/images/2.jpg',
        '/images/3.jpg',
        '/images/5.jpg'
      ];
      setImages(mockImages);
    };

    fetchImages();
  }, []);

  return (
    <div className="h-full w-full px-4">
      <h1>Explore AI Generated Images</h1>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <p className="cursor-pointer" onClick={() => {router.push('/profile')}}>Profile</p>
          <button onClick={logout}>Sign out</button>
        </>
      ) : (
        <button onClick={() => {router.push('/login')}}>Sign in</button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <Image width={400} height={200} className="object-cover transition-transform hover:translate-x-2 hover:-translate-y-2 rounded-md" key={index} src={image} alt="Generated" />
        ))}
      </div>
    </div>
  );
};

export default Explore;
