import { useState, useEffect, MouseEventHandler } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { SignInButton } from '../components/SignInButton'

const DashBoard = () => {
    const [count, setCount] = useState(0)
    const { isAuthenticated, user } = useAuth0()
    
    useEffect(() => {
        console.log('isAuthenticated', isAuthenticated)
        console.log('user', user)
    }, [isAuthenticated, user])
    
    const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
        setCount((count) => count + 1)
    }
    
    return (
        <>
        <div>
            <h1>Workout with Mental Health</h1>
            <Link to="/workouts">Workouts</Link>
            <SignInButton />
        </div>
        <div className="card">
            <button onClick={handleClick}>count is {count}</button>
            <p>
            Edit <code>src/pages/Home.tsx</code> and save to test HMR
            </p>
        </div>
        </>
    )
    }

    export default DashBoard;