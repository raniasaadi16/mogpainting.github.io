import 'antd/dist/antd.css'
import { Router } from 'next/router'
import { useState } from 'react'
import { AppContextProvider } from '../components/context/AppContext'
import Loading from '../components/layouts/global/Loading'
import Layout from '../components/layouts/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [loading, setloading] = useState(false)
  Router.events.on('routeChangeStart', () => {
    setloading(true)
  })
  Router.events.on('routeChangeComplete', () => {
    setloading(false)
  })
  const getLayout = Component.getLayout || ((page) => (
    <AppContextProvider>
      <Layout>
        {loading && <Loading/>}
        {page}
      </Layout>
    </AppContextProvider>
  ))

  return (
    getLayout(<Component {...pageProps} />)
  )
}

export default MyApp
