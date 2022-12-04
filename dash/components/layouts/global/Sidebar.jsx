import {
    ChevronDownIcon,
    ChevronRightIcon,
  } from "@heroicons/react/solid";
import Link from "next/link";
  import { useRouter } from "next/router";
  import { useState } from "react";
import Cookies from "universal-cookie";
  
  
  
  export default function Sidebar() {
    const [active, setactive] = useState('/');
    const router = useRouter()
   
    const goTo = (path) => {
      setactive(path)
      router.push(path)
    }
    const logout = () => {
      const cookies = new Cookies();
      cookies.set('jwt', '')
      router.push('/login')
    }
    return (
      <div className='sm:w-[280px] md:w-[320px] sm:h-[calc(100vh-32px)] py-2 sm:py-0 bg-mog-green rounded'>
        <div className="my-10 text-white">
          <p className="text-center text-3xl font-semibold">Dashboard</p>
          <div className="mt-16">
            <div className={`${active === '/' && 'bg-gray-900'} px-5 py-2 text-xl font-semibold`}>
              <div className="cursor-pointer" onClick={() => goTo('/')}>Projects</div>
            </div>
            <div className={`${active === '/reviews' && 'bg-gray-900'} px-5 py-2 text-xl font-semibold`}>
              <div className="cursor-pointer" onClick={() => goTo('/reviews')}>Reviews</div>
            </div>
            <div className={`${active === '/services' && 'bg-gray-900'} px-5 py-2 text-xl font-semibold`}>
              <div className="cursor-pointer" onClick={() => goTo('/services')}>Services</div>
            </div>
            <div className={`${active === '/users' && 'bg-gray-900'} px-5 py-2 text-xl font-semibold`}>
              <div className="cursor-pointer" onClick={() => goTo('/users')}>Users</div>
            </div>
            <div className={`${active === '/settings' && 'bg-gray-900'} px-5 py-2 text-xl font-semibold`}>
              <div className="cursor-pointer" onClick={() => goTo('/settings')}>Settings</div>
            </div>
          </div>
          <div className="mt-7" onClick={logout}>
            <button className="mx-auto py-2 bg-gray-900 block px-5 rounded text-xl ">Logout</button>
          </div>
        </div>
      </div>
    );
  }
  