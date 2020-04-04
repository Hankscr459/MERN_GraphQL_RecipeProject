import React, {useState, useEffect} from 'react'
import { useMutation } from '@apollo/react-hooks'
import { LIKE_RECIPE, UNLIKE_RECIPE, GET_RECIPE } from '../../queries'
import withSession from '../withSession'

const LikeRecipe = ({ refetch, session, _id }) => {
    const [values, setValue] = useState({
            username: '',
            liked: false
        },

    )
    const { username, liked } = values
    const [likeRecipe] = useMutation(LIKE_RECIPE, {
        update: (cache, { data: { likeRecipe } }) => {
            const { getRecipe } = cache.readQuery({
                query: GET_RECIPE,
                variables: {_id}
            })
            
            cache.writeQuery({
                query: GET_RECIPE,
                variables: { _id },
                data: {
                    getRecipe: { ...getRecipe, likes: likeRecipe.likes + 1 }
                }
            })
        }
    })
    const [unlikeRecipe] = useMutation(UNLIKE_RECIPE, {
        update: (cache, { data: { unlikeRecipe } }) => {
            const { getRecipe } = cache.readQuery({
                query: GET_RECIPE,
                variables: {_id}
            })
            
            cache.writeQuery({
                query: GET_RECIPE,
                variables: { _id },
                data: {
                    getRecipe: { ...getRecipe, likes: unlikeRecipe.likes - 1 }
                }
            })
        }
    })

    const handleLike = (likeRecipe,unlikeRecipe) => {
        if(liked) {
            likeRecipe({
                variables: { _id, username }
            }).then( async ({data}) => {
                // console.log(data)
                await refetch()
            })
        } else {
            unlikeRecipe({
                variables: { _id, username }
            }).then(async ({ data }) => {
                // console.log(data)
                await refetch()
            })
        }
    }

    const handleClick = (likeRecipe,unlikeRecipe) => {
        setValue(
            prevState => ({
                ...prevState,
                liked: !prevState.liked
            }),
            handleLike(likeRecipe,unlikeRecipe)
        )
    }

    useEffect(() => {
        if(session.getCurrentUser) {
            const { username, favorites } = session.getCurrentUser
            const liked = favorites.findIndex(favorite => favorite._id === _id) === -1
            setValue({ username, liked})
        }
    },[session.getCurrentUser, _id])
    return (
        username && (
            <button 
                className='like-button'
                onClick={() => handleClick(likeRecipe,unlikeRecipe)}
            >
                {liked ? 'Liked' : 'UnLiked' }
            </button>
        )
    )
}

export default withSession(LikeRecipe)
