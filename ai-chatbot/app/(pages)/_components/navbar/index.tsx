"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { logout } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export const Navbar =()=>{
    const { user, loading } = useAuth();
    const router = useRouter();


    return (
        <nav className="fixed top-0 w-full h-12 z-[49] bg-background border-b-2 px-2 lg:px-4 flex justify-between items-center shadow-sm ">
            <p className="cursor-pointer select-none" onClick={() => {router.push('/')}}>Home</p>
            <div className="flex flex-row gap-x-1.5 justify-end items-center w-full">
                <Button size="sm" onClick={() => {router.push('/generate')}} variant="ghost">Generate</Button>
                {user ? 
                    <>
                    <Button size="sm" onClick={() => {router.push('/profile')}} variant="ghost">Profile</Button>
                    <Button size="sm" onClick={logout} variant="default">Logout</Button>
                    </>
                :
                    <>
                    <Button onClick={() => {router.push('/login')}} size="sm" variant="default">Login</Button>
                    </>
                }
            </div>
        </nav>
    );
}; 