import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import Error from '../Error'
import { SIGNUP_USER } from '../../queries'

const Signup = props => {
    const [signupUser, {loading, error}] = useMutation(SIGNUP_USER)
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    })

    const  { username, email, password, passwordConfirmation } = values

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value})
    }

    const onSubmit = (event, signupUser) => {
        event.preventDefault()
        signupUser({
            variables: { username, email, password }
        }).then( async ({data}) => {
            console.log(data)
            localStorage.setItem('token', data.signupUser.token)
            await props.refetch()
            setValues({
                ...values,
                username: '',
                email: '',
                password: '',
                passwordConfirmation: ''
            })
            props.history.push('/')
        }).catch(e => {
            // console.log(e)
        })
    }

    const validateForm = () => {
        const isValidate = 
            !username || !email || !password || password !== passwordConfirmation 
        return isValidate
    }
    
    return (
        <div className='App'>
            <h2 className='App'>Signup</h2>
            {loading && <div>Loading...</div>}
            <form 
            className='form' 
            onSubmit={event => onSubmit(event, signupUser)}>
                <input 
                    type='text' 
                    name='username' 
                    placeholder='Username' 
                    value={username}
                    onChange={handleChange('username')} 
                />
                <input 
                    type='email' 
                    name='email' 
                    placeholder='Email Address' 
                    value={email}
                    onChange={handleChange('email')} 
                />
                <input 
                    type='password' 
                    name='password' 
                    placeholder='Password' 
                    value={password}
                    onChange={handleChange('password')} 
                />
                <input 
                    type='password' 
                    name='passwordConfirmation' 
                    placeholder='Confirm Password' 
                    value={passwordConfirmation}
                    onChange={handleChange('passwordConfirmation')} 
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
export default withRouter(Signup)
