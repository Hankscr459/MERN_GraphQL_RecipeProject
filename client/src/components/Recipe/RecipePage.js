import React from 'react'
import { withRouter } from 'react-router-dom'

import { useQuery } from '@apollo/react-hooks'
import { GET_RECIPE } from '../../queries'
import LikeRecipe from './LikeRecipe'

const RecipePage = ({match}) => {
    const { _id } = match.params
    // console.log(_id)
    const {loading, error, data} = useQuery(GET_RECIPE, {
        variables: {_id}
    })
    
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error</p>

    // console.log(data)

    return (
        <div className='App'>
            <div 
                style={{ background: `url(${data.getRecipe.imageUrl}) center center / cover no-repeat` }}
                className='recipe-image'
            />
            <div className='recipe'>
                <div className='recipe-header'>
                    <h2 className='recipe-name'>
                        <strong>{data.getRecipe.name}</strong>
                    </h2>
                    <h5>
                        <strong>Category: {data.getRecipe.category}</strong>
                    </h5>
                    <p>Likes: {data.getRecipe.likes}<span role='img' aria-label='heart'>❤️</span></p>
                    <p>
                        Created By: <strong>{data.getRecipe.username}</strong>
                    </p> 
                    <blockquote className='recipe-description'>
                        Description: {data.getRecipe.description}
                    </blockquote>
                    <h3 className='recipe-instructions__title'>Instructions</h3>
                    <div className='recipe-instructions'>
                        {data.getRecipe.instructions}
                    </div>
                </div>
                <LikeRecipe _id={_id}/>
            </div>
        </div>
    )
}


export default withRouter(RecipePage)
