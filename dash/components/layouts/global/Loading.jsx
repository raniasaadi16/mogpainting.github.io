import Image from "next/image"

export default function Loading() {
    return (
        <div className='absolute z-40 top-0 left-0 bg-black opacity-60 h-full w-full flex justify-center items-center'>
            <div className='h-screen relative z-50'>
                {/* <Image src='/img/loading.svg' width={150} height={150} /> */}
                <h1 className='text-xl text-white text-center mt-5'>Loading...</h1>
            </div>
        </div>
    )
}
