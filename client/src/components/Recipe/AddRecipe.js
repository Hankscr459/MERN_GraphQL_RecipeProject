import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries'
import withAuth from '../withAuth'
import Error from '../Error'
import CKEditor from 'react-ckeditor-component'

const AddRecipe = props => {
    const [addRecipe, {loading, error}] = useMutation(ADD_RECIPE, {
        update: (cache, {data: { addRecipe }}) => {
            // console.log(cache)
            const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES })
            // console.log('from cache' , getAllRecipes)
            // console.log('from data', addRecipe)
            cache.writeQuery({
                query: GET_ALL_RECIPES,
                data: {
                    getAllRecipes: [addRecipe, ...getAllRecipes]
                    // getAllRecipes: getAllRecipes.concat([addRecipe])
                }
            })
        }
    })
    const [values, setValues] = useState({
        name: '',
        category: 'Breakfast',
        imageUrl: '',
        description: '',
        username: ''
    })
    const [instructions, setInstructions] = useState('')
    const { name, imageUrl, category, description } = values
    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value})
    }

    const handleEditorChange = event => {
        const newContent = event.editor.getData()
        setInstructions(newContent)
    }

    const username = props.session.getCurrentUser.username
    // console.log(props)
    
    useEffect((username) => {
        setValues(prev => ({ ...prev, username }))
    }, [username])

    const onSubmit = (event, addRecipe) => {
        event.preventDefault()
        addRecipe({
            variables: { name, imageUrl, category, description, instructions, username },
            refetchQueries: [
                { query: GET_USER_RECIPES, variables: { username } }
            ]
        }).then(({data}) => {
            // console.log(data)
            setValues({
                ...values,
                name: '',
                category: '',
                description: '',
            })
            setInstructions('')
            props.history.push('/')
        }).catch(e => {
            // console.log(e)
        })
    }

    const validateForm = () => {
        const isInvalid = !name || !category || !imageUrl || !description || !instructions
        return isInvalid
    }

    return (
        <div className='App'>
            <h2 className='App'>Add Recipe</h2>
            {loading && <div>Loading...</div>}
            <form 
                className='form'
                onSubmit={event => onSubmit(event, addRecipe)}
            >
                <label htmlFor='name'>Recipe Name</label>
                <input 
                    type='text' 
                    name='name' 
                    placeholder='Recipe Name' 
                    onChange={handleChange('name')} 
                    value={name}
                />
                <input 
                    type='text' 
                    name='imageUrl' 
                    placeholder='Recipe Image' 
                    onChange={handleChange('imageUrl')} 
                    value={imageUrl}
                />
                <select 
                    name='category' 
                    onChange={handleChange('category')} 
                    value={category}
                >
                    <option value='Breakfast'>Breakfast</option>
                    <option value='Lunch'>Lunch</option>
                    <option value='Dinner'>Dinner</option>
                    <option value='Snack'>Snack</option>
                </select>
                <input 
                    type='text' 
                    name='description' 
                    placeholder='Add description' 
                    onChange={handleChange('description')} 
                    value={description}
                />
                <label htmlFor='instructions'>Add Instructions</label>
                <CKEditor
                    name='instructions'
                    content={instructions}
                    events={{ change: handleEditorChange }}
                />
                <button 
                    disabled={loading || validateForm()}
                    type='submit' 
                    className='button-primary'
                >
                    Submit
                </button>
            </form>
            {error && <Error error={error}/>}
        </div>
    )
}

export default withAuth(session => session && 
session.getCurrentUser)(
    withRouter(AddRecipe)
)

// <textarea 
//     name='instructions' 
//     placeholder='Add instructions' 
//     onChange={handleChange('instructions')} 
//     value={instructions}
// />