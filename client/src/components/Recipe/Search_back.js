import React, { useState, useEffect, createRef } from 'react'
import { useQuery } from 'react-apollo'
 
import { SEARCH_RECIPES } from '../../graphql/queries'
 
import RecipeList from './RecipesList'
 
const Search = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, loading, error } = useQuery(SEARCH_RECIPES, {
    variables: { searchTerm }
  })
  const inputRef = createRef()
 
  // automatically focuses on the search field on render
  useEffect(() => {
    inputRef.current.focus()
    // eslint-disable-next-line
  }, [])
 
  // i put my conditional render here instead so it's easier to find
  // much neater also imo
  const renderRecipes = () => {
    return !error && loading ? (
      <p>Loading...</p>
    ) : error && !loading ? (
      <p>Error while searching for recipes!</p>
    ) : (
      // i put my recipes list into a reusable component instead
      // basically what react is all about in the first place
      <RecipeList recipes={data.searchRecipe} />
    )
  }
 
  return (
    <div>
      <label>Search for a Recipe</label>
      <input
        type='text'
        ref={inputRef}
        placeholder='Recipe'
        onChange={event => setSearchTerm(event.target.value)}
        value={searchTerm}
      />
      <div>{renderRecipes()}</div>
    </div>
  )
}
 
export default Search