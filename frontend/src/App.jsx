import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './Home';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  
  return (
    <ChakraProvider >
      <Box> 
        <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Routes> 
      </Box>
    </ChakraProvider>
  )
}
export default App;