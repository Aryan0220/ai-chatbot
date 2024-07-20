"use client";
import React, { useEffect, useState } from 'react';
import { auth, googleProvider, emailProvider } from '@/firebaseConfig';
import { signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, User, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { setSession } from '@/lib/session';
import Loading from '@/app/loading';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signIn, setSignIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if(isMounted){
          router.push('/');
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [isMounted ,router]);

  const generateSessionId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const currUser = result.user;
      if (currUser) {
        const sessionId = generateSessionId();
        await setSession(sessionId, { uid: currUser.uid });
        document.cookie = `sessionId=${sessionId}; path=/`;
    }
  }catch (error) {
    console.error('Error logging in with Google', error);
  }
}

  const handleLoginWithEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const currUser = result.user;
      if (currUser) {
        const sessionId = generateSessionId();
        await setSession(sessionId, { uid: currUser.uid });
        document.cookie = `sessionId=${sessionId}; path=/`;
      }
    } catch (error) {
      console.error('Error logging in with email and password', error);
    }
  };

  const handleSignUpWithEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    try{
      await createUserWithEmailAndPassword(auth, email, password);
    }
    catch(error){
      console.error('Error signing in with email and password', error);
    }
  }

  if(!isMounted){
    return null;
  }

  if (user) {
    return <Loading />; 
  }

  
  return (
    <div className='flex flex-col h-full w-full items-center justify-center'>
      <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{signIn ? "Login" : "Sign Up" }</CardTitle>
        <CardDescription>{signIn ? "Login to use the App" : "Sign Up to use the App" }</CardDescription>
      </CardHeader> 
      <CardContent>
        {
        signIn ? 
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
            <Button variant="outline" className='w-full' type="submit">Login</Button>
          </div>
        </form>
         : 
         <form onSubmit={handleSignUpWithEmail}>
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
            <Button variant="outline" className='w-full' type="submit">Sign Up</Button>
          </div>
        </form>}
      </CardContent>
      <CardFooter className="flex flex-col gap-y-1 justify-center">
        <p>-or-</p>
        <Button className='w-full mt-4 mb-2' onClick={handleLoginWithGoogle} >
          {signIn ? "Login with Google" : "Sign Up with Google"}
          </Button> 
        <p className='text-blue-600 underline cursor-pointer select-none' onClick={() => setSignIn(!signIn)}>{signIn ?
        "New User Create a Account"
        :
        "Already a user Login instead"
        }</p>
        
      </CardFooter>
    </Card>
    </div>
  );
};

export default Login;
