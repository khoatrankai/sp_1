/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import BodyProject from '@/components/Management/Project/Body/Body';
import { fetchProjectTypes } from '@/redux/store/slices/projectSlices/get_type.slice';
import { fetchUserInfo } from '@/redux/store/slices/userSlices/get_users.slice';
import { AppDispatch } from '@/redux/store/store';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';


export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(()=>{
    dispatch(fetchUserInfo())
    dispatch(fetchProjectTypes ())
  },[])
  return (
    <div>
        <BodyProject/>
    </div>
  )
}