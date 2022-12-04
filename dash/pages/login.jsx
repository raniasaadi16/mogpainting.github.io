import React from 'react'
import { Input, Layout } from 'antd'
import { useState } from 'react'
import { AppContextProvider, useAppContext } from '../components/context/AppContext';
import NoAuthLayout from '../components/layouts/NoAuthLayout';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';

export default function Login() {
    const [data, setdata] = useState({email: '', password: ''});
    const { setErr, toggleLoading, setSuccess } = useAppContext()
    const router = useRouter()

    const submit = async (e) => {
        e.preventDefault()
        if(!data.email || !data.password) return setErr('missed field!')

        toggleLoading(true)
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/users/login`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SERVER_ORIGIN
                },
            })
            const userData = await res.json()
            toggleLoading(false)
            if(!res.ok){
                throw userData
            }
            if(userData.data){
                const cookies = new Cookies();
                cookies.set('jwt', userData.data.token);
                setdata({email: '', password: ''})
                router.push('/')
            }
            
        }catch(err){
            toggleLoading(false)
            setErr(err.message)
            console.log(err)
        }
    }
  return (
    <div className='flex justify-center items-center h-screen'>
        <form className='space-y-3' onSubmit={submit}>
            <p className="text-2xl font-bold text-center">Login</p>
            <Input placeholder='Email' type='email' className='w-[300px] rounded block' value={data.email} onChange={(e) => setdata({...data, email: e.target.value})} />
            <Input placeholder='Password' type='password' className='w-[300px] rounded block' value={data.password} onChange={(e) => setdata({...data, password: e.target.value})} />
            <button className='w-[300px] text-center justigy-center py-2 rounded block bg-mog-green text-white font-semibold' type='submit'>Login</button>
        </form>
    </div>
  )
}


Login.getLayout = function getLayout(page){
    return(
        <AppContextProvider>
            <NoAuthLayout>
                {page}
            </NoAuthLayout>
        </AppContextProvider>
    )
}

export async function getServerSideProps({req, res}){
    const reponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/users/isLoggedin`, {
        method: 'GET',
        credentials:'include',
        headers: {
            'Access-Control-Allow-Credentials': true,
            "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SERVER_ORIGIN,
            authorization: `bearer ${req.cookies.jwt}`
        },
    })
    const data = await reponse.json()
    if(!data.data.isAuth){
        return {
          props: {
            user: null
          }
        }
    }else{
        return {
            redirect: {
              permanent: false,
              destination: '/'
            }
        }
    }
}
