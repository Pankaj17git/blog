import React from 'react'
import {  useSelector } from "react-redux";

const Dashboard = () => {
  const {  error, user } = useSelector((state) => state.auth);
  
  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user && <p>Welcome {user.username}</p>}
    </>
  )
}

export default Dashboard
