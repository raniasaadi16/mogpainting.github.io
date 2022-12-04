
import Link from 'next/link'
import { useState } from 'react'
import { useAppContext } from '../../components/context/AppContext';

export default function Users({ users }) {
  const { setErr, toggleLoading, setSuccess } = useAppContext()
  const [displayedUsers, setdisplayedUsers] = useState(users);

  const onDelete = async (id) => {
    try{
      toggleLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/users/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      toggleLoading(false)
      if(!res.ok){
          throw data
      }
      if(data.data){
          setdisplayedUsers(displayedUsers.filter(p => p._id !== id))
          setSuccess(data.msg)
      }
    }catch(err){
      toggleLoading(false)
      setErr(err.message)
      console.log(err)
    }
  }
  return (
    <div>
      <p className="text-2xl font-bold mx-3">All Users</p>
      <div className='mt-3 font-semibold mx-3 w-max text-white bg-mog-green px-4 py-2 rounded'>
        <Link href='/users/create'>Create new user</Link>
      </div>
      <div className="mt-5 flex flex-wrap gap-y-3 gap-3">
        {displayedUsers.length > 0 && displayedUsers.map(user => (
          <div className="flex space-x-5 bg-gray-100 rounded py-2 px-4" key={user._id}>
            <p className="text-xl font-bold">{user.email}</p>
            <button className='bg-mog-green text-white px-3 py-1 rounded font-semibold' onClick={() => onDelete(user._id)}>Delete</button>
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
    const resS = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/users`)
    const data = await resS.json()
    return {
      props: {
        users: data.data.users
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
