"use client";
import React, { useEffect, useState } from 'react';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUserHistory } from '@/utils/rate-limit';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Loading from '@/app/loading';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [totalPrompt, setTotalPrompt] = useState(0);
  const router = useRouter();
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  useEffect(() => {

    setIsMounted(true);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userId = currentUser?.email!;
        const history = await getUserHistory(userId);
        setTotalPrompt(history.length);
        if (history.length >= 3) {
          setFirst(history.at(-1).prompt);
          setSecond(history.at(-2).prompt);
          setThird(history.at(-3).prompt);
        }
      } else {
        if (isMounted) {
          router.push('/login');
        }
      }
    });

    return () => {
      unsubscribe();
    }
  }, [isMounted, router]);

  if (!isMounted) {
    return null;
  }

  if (!user) {
    return <Loading />;
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
      {totalPrompt > 0 ?
    <>
    <h2 className='text-xl'>Most recent Prompts</h2>
    <div className="border rounded-lg overflow-hidden">
    <Table className='w-[30rem]'>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20rem]">Prompt</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
          <TableRow>
            <TableCell className="font-medium">{first}</TableCell>
            <TableCell className="flex flex-col items-end"><p className='bg-gray-600 w-min px-1.5 rounded-full'>Completed</p></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{second}</TableCell>
            <TableCell className="flex flex-col items-end"><p className='bg-gray-600 w-min px-1.5 rounded-full'>Completed</p></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{third}</TableCell>
            <TableCell className="flex flex-col items-end"><p className='bg-gray-600 w-min px-1.5 rounded-full'>Completed</p></TableCell>
          </TableRow>
      </TableBody>
    </Table>
    </div>
    </>
    :
    <></>  
    }
    </div>
  );
};

export default Profile;
