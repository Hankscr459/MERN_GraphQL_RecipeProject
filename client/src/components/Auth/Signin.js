import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import Error from '../Error'
import { SIGNIN_USER } from '../../queries'

const Signin = props => {
    const [signinUser, {loading, error}] = useMutation(SIGNIN_USER)
    const [values, setValues] = useState({
        username: '',
        password: ''
    })

    const  { username, password } = values

    const handleChange = event => {
        const { name, value } = event.target
        setValues({...values, [name]: value})
    }

    const onSubmit = (e, signinUser) => {
        e.preventDefault()
        signinUser({
            variables: { username, password }
        }).then( async ({data}) => {
            // console.log(data)
            localStorage.setItem('token', data.signinUser.token)
            await props.refetch()
            setValues({
                ...values,
                username: '',
                password: ''
            })
            props.history.push('/')
        }).catch(e => {
            console.log(e)
        })
    }

    const validateForm = () => {
        const isValidate = 
            !username || !password
        return isValidate
    }
    
    return (
        <div className='App'>
            <h2 className='App'>SignIn</h2>
            {loading && <div>Loading...</div>}
            <form 
                className='form' 
                onSubmit={(e) => onSubmit(e, signinUser)}
            >
                <input 
                    type='text' 
                    name='username' 
                    placeholder='Username' 
                    value={username}
                    onChange={handleChange} 
                />
                <input 
                    type='password' 
                    name='password' 
                    placeholder='Password' 
                    value={password}
                    onChange={handleChange} 
                />
                <button 
                    type='submit' 
                    className='button-primary'
                    disabled={loading || validateForm()}
                >
                    Submit
                </button>
                {error && <Error error={error}/>}
            </form>
        </div>
    )
}
export default withRouter(Signin)
