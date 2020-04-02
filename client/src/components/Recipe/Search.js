import React, {useState} from 'react'

import { ApolloConsumer } from 'react-apollo'
import { SEARCH_RECIPES } from '../../queries'
import SearchItem from './SearchItem'

const Search = props => {
    const [searchResult, setSearchResult] = useState([])
    const handleChange = ({searchRecipes}) => {
        setSearchResult(searchRecipes)
    }

    return (
        <ApolloConsumer>
            {client => (
                <div className='App'>
                    <input 
                        type='search' 
                        placeholder= 'Search for Recipes' 
                        onChange={ async event => {
                            event.persist()
                            const { data } = await client.query({
                                query: SEARCH_RECIPES,
                                variables: { searchTerm: event.target.value }
                            })
                            handleChange(data)
                        }}
                    />
                    <ul>
                        {searchResult.map(recipe => 
                            <SearchItem key={recipe._id} {...recipe}/>
                        )}
                    </ul>
                </div>
            )}
        </ApolloConsumer>
    )
}

export default Search
