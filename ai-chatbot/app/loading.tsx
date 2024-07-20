import Image from "next/image";

const Loading = () => {
    return(
        <div className="bg-gray-300 h-full w-[30rem] p-4 rounded-xl flex flex-col justify-center items-center">
            <Image
                src='/vercel.svg'
                alt="Loading"
                width={120}
                height={120}
                className="animate-pulse duration-700"
            />
        </div>
    )
}

export default Loading;