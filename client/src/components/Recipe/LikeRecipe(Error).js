import React, {useState, useEffect} from 'react'
import { useMutation } from '@apollo/react-hooks'
import { LIKE_RECIPE, UNLIKE_RECIPE, GET_RECIPE } from '../../queries'
import withSession from '../withSession'

const LikeRecipe = ({ refetch, session, _id }) => {
    const [values, setValue] = useState({
            username: '',
            Liked: false
        },

    )
    const { username, Liked } = values
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
        if(Liked) {
            likeRecipe({
                variables: { _id, username }
            }).then( async ({data}) => {
                console.log(data)
                await refetch()
            })
        } else {
            // unlike recipe mutation
            unlikeRecipe({
                variables: { _id, username }
            }).then(async ({ data }) => {
                console.log(data)
                await refetch()
            })
            console.log('unlike')
        }
    }

    const handleClick = (likeRecipe,unlikeRecipe) => {
        setValue(
            prevState => ({
                ...prevState,
                Liked: !prevState.Liked
            }),
            () => handleLike(likeRecipe,unlikeRecipe)
        )
    }

    useEffect(() => {
        if(session.getCurrentUser) {
            const { username, favorites } = session.getCurrentUser
            console.log(username)
            const prevLiked = favorites.findIndex(favorite => favorite._id === _id) > -1
            setValue({ username, Liked: prevLiked})
        }
    },[session.getCurrentUser, _id])
    // console.log(props)
    return (
        username && (
            <button onClick={() => handleClick(likeRecipe,unlikeRecipe)}>
                {Liked ? 'UnLiked' : 'Like' }
            </button>
        )
    )
}

export default withSession(LikeRecipe)
