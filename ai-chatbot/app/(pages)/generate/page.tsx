"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { storeUserHistory, getUserGenerationCount, incrementUserGenerationCount, resetGenerationCounts } from '@/utils/rate-limit';
import Loading from '@/app/loading';
import { getSession } from '@/lib/session';


const getDifferenceInHours = (startTime: number, endTime: number): number => {
  const millisecondsInAnHour = 1000 * 60 * 60;
  const differenceInMilliseconds = endTime - startTime;
  return differenceInMilliseconds / millisecondsInAnHour;
}

const Generate: React.FC = () => {
    const { user, loading } = useAuth();
    const [prompt, setPrompt] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const router = useRouter();
  
    useEffect(() => {

      let cook = document.cookie;
      cook = cook.split("=")[1];
      console.log(cook);
      const session = async () => {
        let data = await getSession(cook);
        console.log(data?.expiration);
        let hours = Math.abs(getDifferenceInHours(data?.expiration, Date.now()));
        if(hours >= 1){
          if (!user) return;
          const userId = user.email!;
          await resetGenerationCounts(userId);
        }
      }
      console.log(Date.now());
      session();

    },[user])

    // const handleReset = async () => {
    //     if(!user) return;
    //     const userId = user.email!;
    //     await resetGenerationCounts(userId);
    // }

    const handleGenerate = async () => {
        
      if (!user) return;
  
      const userId = user.email!;
      const generationCount = await getUserGenerationCount(userId);
  
      if (generationCount >= 3) {
        alert('You have reached the limit of 3 generations per hour.');
        return;
      }
  
      const randomImages = [
        '/images/2.jpg',
        '/images/3.jpg',
        '/images/5.jpg',
      ];
      const randomIndex = Math.floor(Math.random() * randomImages.length);
      const selectedImage = randomImages[randomIndex];
  
      setGeneratedImage(selectedImage);
  
      await storeUserHistory(userId, prompt, selectedImage);
      await incrementUserGenerationCount(userId);
    };
  
    return (
      <div className='flex h-full w-full justify-center gap-y-4 flex-col items-center'>
        <div className='flex flex-col gap-y-4 justify-center items-center'>
        <h1 className='font-bold text-6xl text-center'>Generate Image</h1>
        {loading ? (
          <Loading />
        ) : user ? (
          <>
          <div className='flex w-[23rem] flex-col gap-y-2 items-end'>
            <Input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Enter your prompt"
                required
                />
            <Button className='w-min' onClick={handleGenerate}>Generate</Button>
          </div>
            {/* <button onClick={handleReset}>Reset</button> */}
            
          </>
        ) : (
            <>
                <p>To Generate Image Please Login</p>
                <Button className='text-lg' variant="default" onClick={() => {router.push('/login')}}>Login</Button>
            </>
        )}
        </div>
        <div className='border-2 border-input bg-accent text-accent-foreground flex items-center justify-center p-3 w-[25rem] h-[15rem]  rounded-lg'>
        {generatedImage ? <div className='flex'>
                <Image className='rounded-md' width={400} height={200} src={generatedImage} alt="Generated" />
            </div>
            :
            <p>Generated Image will be displayed here</p>
            }
        </div>
      </div>
    );
  };
  
  export default Generate;
