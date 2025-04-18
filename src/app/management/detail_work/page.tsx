/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import Introduce from '@/components/Management/Work/Introduce/Introduce';
import { fetchTypeWork } from '@/redux/store/slices/activitySlices/type_work.slice';
import { fetchUserInfo } from '@/redux/store/slices/userSlices/get_users.slice';
import { AppDispatch } from '@/redux/store/store';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';


export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(()=>{
    dispatch(fetchUserInfo())
    dispatch(fetchTypeWork())
  },[])
  return (
    <div>
        <Introduce/>
    </div>
  )
}