import React, {useState, useEffect} from 'react'
import './App.css'

import { Query } from 'react-apollo'
import { GET_ALL_RECIPES } from '../queries'
import posed from 'react-pose'
import RecipeItem from './Recipe/RecipeItem'
import Spinner from './Spinner'

const RecipeList = posed.ul({
  shown: {
    x: '0%',
    straggerChildren: 100
  },
  hidden: {
    x:'-100%'
  }
})

const App = () => {
  const [values, setValues] = useState({
    on: false
  })

  const { on } = values

  const slideIn = () => {
    setValues({ on: !on })
  }

  useEffect(() => {
    setTimeout(slideIn, 200)
  }, [])

  return (
    <div className="App">
      <h1 className='main-title'>
        Find Recipes You <strong>Love</strong>
      </h1>
      <Query query={GET_ALL_RECIPES}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />
          if (error) return <div>error</div>
          // console.log(data)
          return (
            <RecipeList 
              pose={on ? 'shown' : 'hidden'}
              className='cards'
            >
              {data.getAllRecipes.map(recipe => (
                <RecipeItem  key={recipe._id} {...recipe} />
              ))}
            </RecipeList>
          )
        }}
      </Query>
    </div>
  );
}

export default App;
