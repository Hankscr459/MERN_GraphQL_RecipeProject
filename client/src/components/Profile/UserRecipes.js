import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER } from '../../queries'
import Spinner from '../Spinner'

const UserRecipes = ({ username }) => {
    const [values, setValues] = useState({
        _id: '',
        name:'',
        imageUrl: '',
        category: '',
        description: '',
    })
    const [ Modal, setModal] = useState(false)
    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value})
    }

    const loadRecipe = recipe => {
        // console.log(recipe)
        setValues({...recipe})
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
    }

    const [ deleteUserRecipe, attrs={} ] = useMutation(DELETE_USER_RECIPE, {
        update: (cache, {data: {deleteUserRecipe}}) => {
            const {getUserRecipes} = cache.readQuery({
                query: GET_USER_RECIPES,
                variables: { username }
            })
            cache.writeQuery({
                query: GET_USER_RECIPES,
                variables: { username },
                data: {
                    getUserRecipes: getUserRecipes.filter(
                        recipe => recipe._id !== deleteUserRecipe._id
                    )
                }
            })
        }
    })
    const { loading, error, data } = useQuery(GET_USER_RECIPES, {
        variables: {username}
    })

    if (loading) return <Spinner />
    if (error) return <p>Error</p>
    // console.log(data)

    const handleDelete = (deleteUserRecipe, recipe) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe')
        if (confirmDelete) {
            deleteUserRecipe({
                variables: {_id: recipe._id },
                refetchQueries: [
                    {query: GET_ALL_RECIPES },
                    {query: GET_CURRENT_USER}
                ]
            }).then(({data}) => {
                // console.log(data)
            })
        }
    }
    
    return (
        <ul>
            { Modal && <EditRecipeModel recipe={values} closeModal={closeModal} handleChange={handleChange} />}
            <h3>User Recipes</h3>
            {!data.getUserRecipes.length && <p><strong>You have 
                not added any recipes yet</strong></p>}
            {data.getUserRecipes.map(recipe => (
                <li key={recipe._id}>
                    <Link to={`/recipes/${recipe._id}`}>
                        <p>{recipe.name}</p>
                    </Link>
                    <p style={{marginBottom: '0'}}>{recipe.likes}</p>
                    <div className=''>
                        <button onClick={() => loadRecipe(recipe)} className='button-primary'>Update</button>
                        <p 
                            className='delete-button'
                            onClick={() => handleDelete(deleteUserRecipe, recipe)}
                        >
                            {attrs.loading ? "Deleting..." : 'X'}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    )
}

const EditRecipeModel = ({ recipe, handleChange, closeModal}) => (
    <div className='modal modal-open'>
        <div className='modal-inner'>
            <div className='modal-content'>
                <form className='modal-content-inner'>
                    <h4>Edit Recipe</h4>
                        <label htmlFor='name'>Recipe Name</label>
                    <input 
                        type='text' 
                        name='name' 
                        placeholder='Recipe Name' 
                        onChange={handleChange('name')}
                        value={recipe.name}
                    />
                    <input 
                        type='text' 
                        name='imageUrl' 
                        placeholder='Recipe Image' 
                        onChange={handleChange('imageUrl')}
                        value={recipe.imageUrl}
                    />
                    <select 
                        name='category' 
                        onChange={handleChange('category')}
                        value={recipe.category}
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
                        value={recipe.description}
                    />
                    <hr />
                    <div className='modal-buttons'>
                        <button type='submit' className='button-primary'>Update</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)

export default UserRecipes
