import React from 'react'

import { auth } from '../../utils/firebase'
import api from '../../utils/axios'

async function logout() {
  try{
        const {data}= await api.post('/api/auth/logout')
       
        console.log(data)
  }catch(error){
    console.log(error)
  }
}

export default logout