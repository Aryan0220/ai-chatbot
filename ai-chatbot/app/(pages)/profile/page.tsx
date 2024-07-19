"use client";
import React, { useEffect, useState } from 'react';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUserHistory } from '@/utils/rate-limit';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [totalPrompt, setTotalPrompt] = useState(0);
  const [topThree, setTopThree] = useState([]);
  const router = useRouter();
  const userId = user?.email!;

  const getHistory = async () => {
    const history = await getUserHistory(userId);
    setTotalPrompt(history.length);
    if(history.length >= 3){
      setTopThree(history.slice(0, 3));
    }
  }

  useEffect(() => {
    setIsMounted(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        if (isMounted) {
          router.push('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [isMounted, router]);

  if (!isMounted) {
    return null;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col justify-center h-full w-full items-center gap-y-4'>
      <h1 className='text-6xl font-bold'>Profile</h1>
      <div className='flex justify-center gap-x-3 rounded-xl p-3 border-2 border-input'>
        <Image width={100} height={100} src={user.photoURL || ''} alt={user.displayName || 'User'} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        <div className='flex flex-col justify-center'>
        <h2 className='text-2xl'>{user.displayName}</h2>
        <p className='text-gray-500'>{user.email}</p>
        <p className='text-md'>No. of prompts: {totalPrompt}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
