import React, { useState } from 'react'
import {Input} from 'antd'
import { useAppContext } from '../../components/context/AppContext';


export default function Create() {
    const { setErr, toggleLoading, setSuccess } = useAppContext()
    const [data, setdata] = useState({email: '', password: ''});
  
    
    
    const submit = async (e) => {
        e.preventDefault()
        if(!data.email || !data.password) return setErr('missed field!')
        
        toggleLoading(true)
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/users`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SERVER_ORIGIN
                },
            })
            const user = await res.json()
            toggleLoading(false)
            if(!res.ok){
                throw user
            }
            if(user.data){
                setdata({password: '',email: ''})
                setSuccess(user.msg)
            }
            
        }catch(err){
            toggleLoading(false)
            setErr('something went very wrong , please try again')
            console.log(err)
        }
    }
  return (
    <div>
      <p className="text-2xl font-bold mx-3">Create New User</p>
      <form className="ml-3 mt-7 space-y-3" onSubmit={submit}>
        <div className="space-y-2">
            <p className='font-bold text-lg'>Email</p>
            <Input placeholder='Email' type='email' className='rounded w-full' value={data.email} onChange={(e) => setdata({...data, email: e.target.value})} required/>
        </div>
        <div className="space-y-2">
            <p className="font-bold text-lg">Password</p>
            <Input placeholder='password' type='password' className='rounded w-full' value={data.password} onChange={(e) => setdata({...data, password: e.target.value})} required/>
        </div>
        <button className='bg-mog-green px-5 py-3 rounded text-white font-bold' type='submit'>Create</button>
      </form>
    </div>
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
    if(data.data.isAuth){
        return {
          props: {
            user: null
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