// pages/profile.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // Mark that the component is mounted

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        if (isMounted) {
          router.push('/login'); // Redirect to login if not authenticated
        }
      }
    });

    return () => unsubscribe();
  }, [isMounted, router]);

  if (!isMounted) {
    return null; // Avoid rendering until the component is mounted
  }

  if (!user) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <div>
      <h1>Profile</h1>
      <p className='cursor-pointer' onClick={() => {router.push('/')}}>Explore</p>
      <div>
        <Image width={100} height={100} src={user.photoURL || ''} alt={user.displayName || 'User'} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        <h2>{user.displayName}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
