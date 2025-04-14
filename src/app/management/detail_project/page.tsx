/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import Introduce from '@/components/Management/Project/Introduce/Introduce';
import { fetchProductTypes } from '@/redux/store/slices/productSlices/get_type.slice';
import { fetchUserInfo } from '@/redux/store/slices/userSlices/get_users.slice';
import { AppDispatch } from '@/redux/store/store';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';


export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(()=>{
    dispatch(fetchUserInfo())
    dispatch(fetchProductTypes())
  },[])
  return (
    <div>
        <Introduce/>
    </div>
  )
}