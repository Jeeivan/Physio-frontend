import { Link } from "react-router-dom"
import '../../css/Navbar.css'
import React, { useState, useEffect } from "react";

export default function NavBar() {
    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
      if (localStorage.getItem("access_token") !== null) {
        setIsAuth(true);
      }
    }, [isAuth]);
    return (
        <div className="NavBar">
            <h1>WaitLessWellness</h1>
        <nav>
        {isAuth ? (
            <>
            <Link to='/'>Home</Link>
            <Link to='/form'>Physio Form</Link>
            <Link to='/response'>Response Page</Link>
            <Link to='/exercise'>Exercises</Link>
            <Link to='/Management'>Management</Link>
            <Link to='Discussion'>Discussion</Link>
            <Link to='/faq'>FAQ</Link>
            <Link to='/logout'>Logout</Link>
            </>
          ) : (
            <>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Sign Up</Link>
            </>
          )}
        </nav>
        </div>
      )
}