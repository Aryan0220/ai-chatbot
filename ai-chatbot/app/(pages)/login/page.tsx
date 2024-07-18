"use client";
import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '@/firebaseConfig';
import { signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if(isMounted){
          router.push('/profile');
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [isMounted ,router]);

  const handleLoginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error logging in with Google', error);
    }
  };

  const handleLoginWithEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error logging in with email and password', error);
    }
  };


  if(!isMounted){
    return null;
  }

  if (user) {
    return <div>Loading...</div>; 
  }

  return (
    <div className='flex flex-col h-[100vh] w-full items-center justify-center'>
      <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to use the App</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLoginWithEmail}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input
                type='email'
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                id="name" 
                placeholder="Your Email" 
                />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input 
              id="password" 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 justify-center">
        <Button className='w-full' type="submit">Login</Button>
        <Button className='w-full' onClick={handleLoginWithGoogle} variant="outline">Login with Google</Button>
        
      </CardFooter>
    </Card>
    </div>
  );
};

export default Login;
