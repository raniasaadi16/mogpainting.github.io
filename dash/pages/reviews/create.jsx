import React, { useState } from 'react'
import {Input} from 'antd'
import Image from 'next/image';
import { useAppContext } from '../../components/context/AppContext';
const { TextArea } = Input;


export default function Create() {
    const { setErr, toggleLoading, setSuccess } = useAppContext()
    const [data, setdata] = useState({name: '', picture: '', content: ''});
    const [preview, setpreview] = useState('');
  
    
    const upload = e => {
        var reader = new FileReader();
        var url = reader.readAsDataURL(e.target.files[0]);
        if(e.target.files[0].type.split('/')[0] == 'image'){
            reader.onloadend = function (e) {
                setpreview(reader.result);
            }
            setdata({...data, picture: e.target.files[0]})
        }else{
            setErr('please upload a valid picture')
        }
    }
    const submit = async (e) => {
        e.preventDefault()
        if(!data.name || !data.content || !data.picture) return setErr('missed field!')
        const formData = new FormData();
        formData.append('name', data.name)
        formData.append('picture', data.picture)
        formData.append('content', data.content)
        toggleLoading(true)
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/reviews`, {
                method: 'POST',
                body: formData,
                headers:{
                    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SERVER_ORIGIN
                },
            })
            const data = await res.json()
            toggleLoading(false)
            if(!res.ok){
                throw data
            }
            if(data.data){
                setdata({content: '',name: '', picture: ''})
                setpreview('')
                setSuccess(data.msg)
            }
            
        }catch(err){
            toggleLoading(false)
            setErr('something went very wrong , please try again')
            console.log(err)
        }
    }
  return (
    <div>
      <p className="text-2xl font-bold mx-3">Create New Review</p>
      <form className="ml-3 mt-7 space-y-3" onSubmit={submit}>
        <div className="space-y-2">
            <p className='font-bold text-lg'>Name</p>
            <Input placeholder='Name' className='rounded w-full' value={data.name} onChange={(e) => setdata({...data, name: e.target.value})}/>
        </div>
        <div className="space-y-2">
            <p className="font-bold text-lg">Content</p>
            <TextArea placeholder='content' className='rounded w-full' value={data.content} onChange={(e) => setdata({...data, content: e.target.value})}/>
        </div>
        <div>
            <span className='font-semibold md:text-lg mb-2 block'>Picture</span>
            <input type="file" id='file' className='hidden' onChange={upload} />
            <label htmlFor="file" className='py-1 px-3 border border-gray-400 rounded-md cursor-pointer mb-5'>upload</label>
            {preview && (
                <div className='relative h-[100px] w-[200px] mt-5 mb-5'>
                    <Image src={preview} fill objectFit='contain' alt=''/>
                </div>
            )}
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