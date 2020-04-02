import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { GET_USER_RECIPES } from '../../queries'

const UserRecipes = ({ username }) => {
    const { loading, error, data } = useQuery(GET_USER_RECIPES, {
        variables: {username}
    })

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error</p>
    // console.log(data)
    return (
        <ul>
            <h3>User Recipes</h3>
            
            {data.getUserRecipes.map(recipe => (
                <li key={recipe._id}>
                    <Link to={`/recipes/${recipe._id}`}>
                        <p>{recipe.name}</p>
                    </Link>
                    <p>{recipe.likes}</p>
                </li>
            ))}
        </ul>
    )
}

export default UserRecipes
