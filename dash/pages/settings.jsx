import React, { useState } from 'react'
import {Input} from 'antd'
import { useAppContext } from '../components/context/AppContext';
import Cookies from 'universal-cookie';

export default function Settings({ user }) {
    const { setErr, toggleLoading, setSuccess } = useAppContext()
    const [data, setdata] = useState({email: user.email, password: '', confirmPassword: ''});
    
    
    
    const submitEmail = async (e) => {
        e.preventDefault()
        if(!data.email) return setErr("email can't be empty!")
        let sendedData = {}
        sendedData.email = data.email
        toggleLoading(true)
        const cookies = new Cookies();
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/users/updateMe`, {
                method: 'PATCH',
                body: JSON.stringify(sendedData),
                headers:{
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SERVER_ORIGIN,
                    authorization: `bearer ${cookies.get('jwt')}`
                },
            })
            const user = await res.json()
            toggleLoading(false)
            if(!res.ok){
                throw user
            }
            if(user.data){
                setSuccess(user.message)
            }
            
        }catch(err){
            toggleLoading(false)
            setErr('something went very wrong , please try again')
            console.log(err)
        }
    }

    const submitPass = async (e) => {
        e.preventDefault()
        if(data.password !== data.confirmPassword) return setErr("passwords aren't the same!")
        if(!data.password || !data.confirmPassword) return
        let sendedData = {}
        sendedData.password = data.password
        toggleLoading(true)
        const cookies = new Cookies();
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/users/updateMe`, {
                method: 'PATCH',
                body: JSON.stringify(sendedData),
                headers:{
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SERVER_ORIGIN,
                    authorization: `bearer ${cookies.get('jwt')}`
                },
            })
            const user = await res.json()
            toggleLoading(false)
            if(!res.ok){
                throw user
            }
            if(user.data){
                setSuccess(user.message)
            }
            
        }catch(err){
            toggleLoading(false)
            setErr('something went very wrong , please try again')
            console.log(err)
        }
    }
  return (
    <div>
      <p className="text-2xl font-bold mx-3">Update user information</p>
      <form className="ml-3 mt-7 space-y-3" onSubmit={submitEmail}>
        <div className="space-y-2">
            <p className='font-bold text-lg'>Email</p>
            <Input placeholder='Email' type='email' className='rounded w-full' value={data.email} onChange={(e) => setdata({...data, email: e.target.value})} />
        </div>
        <button className='bg-mog-green px-5 py-3 rounded text-white font-bold' type='submit'>Update Email</button>
      </form>
      <form className="ml-3 mt-7 space-y-3" onSubmit={submitPass}>
        <div className="space-y-2">
            <p className="font-bold text-lg">New Password</p>
            <Input placeholder='New password' type='password' className='rounded w-full' value={data.password} onChange={(e) => setdata({...data, password: e.target.value})} />
        </div>
        <div className="space-y-2">
            <p className="font-bold text-lg">Confirm New Password</p>
            <Input placeholder='Confirm new password' type='password' className='rounded w-full' value={data.confirmPassword} onChange={(e) => setdata({...data, confirmPassword: e.target.value})} />
        </div>
        <button className='bg-mog-green px-5 py-3 rounded text-white font-bold' type='submit'>Update Password</button>
      </form>
    </div>
  )
}

export async function getServerSideProps({params, req}){
    const logRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/users/isLoggedin`, {
        method: 'GET',
        credentials:'include',
        headers: {
            'Access-Control-Allow-Credentials': true,
            "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SERVER_ORIGIN,
            authorization: `bearer ${req.cookies.jwt}`
        },
    })
    const logData = await logRes.json()
    if(logData.data.isAuth){
        return {
          props: {
            user: logData.data.user,
          }
        }
    }else{
        return {
            redirect: {
              permanent: false,
              destination: '/login'
            }
        }
    }
  }