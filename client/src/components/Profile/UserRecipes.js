import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER } from '../../queries'
import Spinner from '../Spinner'

const UserRecipes = ({ username }) => {
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
            <h3>User Recipes</h3>
            {!data.getUserRecipes.length && <p><strong>You have 
                not added any recipes yet</strong></p>}
            {data.getUserRecipes.map(recipe => (
                <li key={recipe._id}>
                    <Link to={`/recipes/${recipe._id}`}>
                        <p>{recipe.name}</p>
                    </Link>
                    <p style={{marginBottom: '0'}}>{recipe.likes}</p>
                    <p 
                        className='delete-button'
                        onClick={() => handleDelete(deleteUserRecipe, recipe)}
                    >
                        {attrs.loading ? "Deleting..." : 'X'}
                    </p>
                </li>
            ))}
        </ul>
    )
}

export default UserRecipes
