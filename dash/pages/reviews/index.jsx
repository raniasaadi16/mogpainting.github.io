
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useAppContext } from '../../components/context/AppContext';

export default function Reviews({ reviews }) {
  const { setErr, toggleLoading, setSuccess } = useAppContext()
  const [displayedReviews, setdisplayedReviews] = useState(reviews);

  const onDelete = async (id) => {
    try{
      toggleLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/reviews/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      toggleLoading(false)
      if(!res.ok){
          throw data
      }
      if(data.data){
          setdisplayedReviews(displayedReviews.filter(p => p._id !== id))
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
      <p className="text-2xl font-bold mx-3">All Reviews</p>
      <div className='mt-3 font-semibold mx-3 w-max text-white bg-mog-green px-4 py-2 rounded'>
        <Link href='/reviews/create'>Create new review</Link>
      </div>
      <div className="mt-5 flex flex-wrap gap-y-3">
        {displayedReviews.length > 0 && displayedReviews.map(review => (
          <div key={review._id} className='mx-3 p-4 bg-gray-100 rounded'>
            <div className="p-2 flex justify-center mb-2 space-x-7">
              <button className='bg-mog-green text-white px-3 py-1 rounded font-semibold' onClick={() => onDelete(review._id)}>Delete</button>
              <div className='bg-mog-green text-white px-3 py-1 rounded font-semibold'>
                <Link href={`/reviews/${review._id}`}>Edit</Link>
              </div>
            </div>
            <div className="relative w-[100px] h-[100px] rounded-full mx-auto">
              <Image src={review.picture} className='rounded-full' fill alt='' objectFit='cover' />
            </div>
            <p className="my-2 text-lg font-bold text-center">{review.name}</p>
            <p className="text-center w-[300px] mx-auto">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps({ req }){
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/reviews`)
    const data = await res.json()
    return {
      props: {
        reviews: data.data.reviews
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
