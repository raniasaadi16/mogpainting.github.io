
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useAppContext } from '../../components/context/AppContext';
import { Icon } from '@iconify/react';

export default function Services({ services }) {
  const { setErr, toggleLoading, setSuccess } = useAppContext()
  const [displayedServices, setdisplayedServices] = useState(services);

  const onDelete = async (id) => {
    try{
      toggleLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/services/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      toggleLoading(false)
      if(!res.ok){
          throw data
      }
      if(data.data){
          setdisplayedServices(displayedServices.filter(p => p._id !== id))
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
      <p className="text-2xl font-bold mx-3">All Services</p>
      <div className='mt-3 font-semibold mx-3 w-max text-white bg-mog-green px-4 py-2 rounded'>
        <Link href='/services/create'>Create new service</Link>
      </div>
      <div className="mt-5 flex flex-wrap gap-y-3">
        {displayedServices.length > 0 && displayedServices.map(service => (
          <div className="relative w-[350px] mx-3" key={service._id}>
            <div className="relative w-full h-[230px] rounded-lg">
              <Image src={service.picture} className='rounded-lg' fill alt='' objectFit='cover' />
              <div className="absolute top-0 right-0 p-2 flex space-x-3">
                <button className='bg-mog-green text-white px-3 py-1 rounded font-semibold' onClick={() => onDelete(service._id)}>Delete</button>
                <div className='bg-white text-mog-green px-3 py-1 rounded font-semibold'>
                  <Link href={`/services/${service._id}`}>Edit</Link>
                </div>
              </div>
            </div>
            <div className="relative top-[-20px] w-[85%] mx-auto">
              <div className="icon w-[48px] h-[40px] flex justify-center items-center rounded mx-auto" style={{background: `#${service.color}`}}>
                <Icon icon={service.icon} className='w-5 h-5 text-white'/>
              </div>
              <div className="text-center mt-2">
                <p className="text-2xl font-bold">{service.serviceName}</p>
                <p>{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps({req, res}){
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
    const resS = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/services`)
    const data = await resS.json()
    return {
      props: {
        services: data.data.services
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
