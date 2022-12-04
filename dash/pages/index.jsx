
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useAppContext } from '../components/context/AppContext'

export default function Home({ projects }) {
  const { setErr, toggleLoading, setSuccess } = useAppContext()
  const [displayedProjects, setdisplayedProjects] = useState(projects);

  const onDelete = async (id) => {
    try{
      toggleLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/projects/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      toggleLoading(false)
      if(!res.ok){
          throw data
      }
      if(data.data){
          setdisplayedProjects(displayedProjects.filter(p => p._id !== id))
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
      <p className="text-2xl font-bold mx-3">All Projects</p>
      <div className='mt-3 font-semibold mx-3 w-max text-white bg-mog-green px-4 py-2 rounded'>
        <Link href='/projects/create'>Create new project</Link>
      </div>
      <div className="mt-5 flex flex-wrap gap-y-3">
        {displayedProjects.length > 0 && displayedProjects.map(project => (
          <div className="relative w-[260px] h-[350px] rounded-lg mx-3" key={project._id}>
            <Image src={project.picture} className='rounded-lg' fill alt='' objectFit='cover' />
            <div className="absolute top-0 right-0 p-2 flex space-x-3">
              <button className='bg-mog-green text-white px-3 py-1 rounded font-semibold' onClick={() => onDelete(project._id)}>Delete</button>
              <div className='bg-white text-mog-green px-3 py-1 rounded font-semibold'>
                <Link href={`/projects/${project._id}`}>Edit</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/projects`)
  const data = await res.json()
  return {
    props: {
      projects: data.data.projects
    }
  }
}
