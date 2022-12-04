import React, { useRef, useState } from 'react'
import {Button, Divider, Input, Select, Space} from 'antd'
import Image from 'next/image';
import { useAppContext } from '../../components/context/AppContext';

export default function Project({categories, project}) {
    const { setErr, toggleLoading, setSuccess } = useAppContext()
    const [data, setdata] = useState(project);
    const [items, setItems] = useState(categories);
    const [name, setName] = useState('');
    const [preview, setpreview] = useState(project.picture);
    const inputRef = useRef(null);
    const onNameChange = (event) => {
        setName(event.target.value);
    };
    const addItem = (e) => {
        e.preventDefault();
        if(!name) return
        setItems([...items, {_id: name}]);
        setName('');
        setTimeout(() => {
        inputRef.current?.focus();
        }, 0);
    };
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
        if(!data.projectName || !data.category || !data.picture) return setErr('missed field!')
        const formData = new FormData();
        project.projectName !== data.projectName && formData.append('projectName', data.projectName)
        project.picture !== data.picture && formData.append('picture', data.picture)
        project.category !== data.category && formData.append('category', data.category)
        console.log(formData)
        toggleLoading(true)
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/projects/${project._id}`, {
                method: 'PATCH',
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
      <p className="text-2xl font-bold mx-3">Update Project</p>
      <form className="ml-3 mt-7 space-y-3" onSubmit={submit}>
        <div className="space-y-2">
            <p className='font-bold text-lg'>Title</p>
            <Input placeholder='title' className='rounded w-full' value={data.projectName} onChange={(e) => setdata({...data, projectName: e.target.value})}/>
        </div>
        <div className="space-y-2">
            <p className="font-bold text-lg">Category</p>
            <Select
                defaultValue={data.category}
                onSelect={(val) => setdata({...data, category: val})}
                placeholder="Category"
                className='w-full rounded'
                dropdownRender={(menu) => (
                    <>
                    {menu}
                    <Divider
                        style={{
                        margin: '8px 0',
                        }}
                    />
                    <Space
                        style={{
                        padding: '0 8px 4px',
                        }}
                    >
                        <Input
                        placeholder="Please enter item"
                        ref={inputRef}
                        value={name}
                        onChange={onNameChange}
                        />
                        <Button type="text" onClick={addItem}>
                            Add item
                        </Button>
                    </Space>
                    </>
                )}
                options={items.map((item) => ({
                    label: item._id,
                    value: item._id,
                }))}
                />
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
        <button className='bg-mog-green px-5 py-3 rounded text-white font-bold' type='submit'>Update</button>
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/projects/categories/get`)
        const data = await res.json()
        const resP = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/projects/${params.id}`)
        const dataP = await resP.json()
        return {
          props: {
            categories: data.data.categories,
            project: dataP.data.project
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