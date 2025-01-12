import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import {MantineProvider} from '@mantine/core';
import Home from '@/canvas/home'
import '@/index.css'
import '@mantine/core/styles.css';



const paths=[{
  path : '/', 
  element: (<Home/>),
},]


const BrowserRouter = createBrowserRouter(paths);

const App =() =>{
  return (
    <MantineProvider>
      <RouterProvider router={BrowserRouter}/>
    </MantineProvider>
  )
}


export default App;