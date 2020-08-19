import React, { useEffect, useState } from 'react';
import { useDebounce } from './utils';
import './App.css';

const LoadingState = () => {
  return (
    <div>
      Loading...
    </div>
  )
}

const ErrorState = ({ error }) => {
  return (
    <div>
      {error}
    </div>
  )
}

const Ingredient = ({ ingredient }) => {
  return <li>{ingredient.name}</li>
}

const MainContent = ({ ingredients }) => {
  return (
    <ul>
    { ingredients && ingredients.map((ingredient, index) => {
        return <Ingredient key={`ingredient-${index}`} ingredient={ingredient} />
      })
    }
  </ul>
  )
}

const App = () => {
  const [inputValue, setInputValue] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null);
  const handleChange = (event) => {
    if (event.target.value === '') {
      setIngredients([])
    }
    setInputValue(event.target.value)
  }
  const debouncedInputValue = useDebounce(inputValue, 500)

  useEffect(() => {
    const limit = 20
    const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY
    let ingredientSearchString = `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=${apiKey}`
  
    if (debouncedInputValue) {
      setIsLoading(true)
      ingredientSearchString += `&query=${debouncedInputValue}&number=${limit}`
  
      try {
        fetch(ingredientSearchString)
        .then(result => result.json())
        .then((res) => {
          setIngredients(res)
          setIsLoading(false)
        })
      } catch (err) {
        console.err(err)
        setError(err)
        setIsLoading(false)
      }
    }
  }, [debouncedInputValue])

  return (
    <div>
      <input
        type='search'
        value={inputValue}
        placeholder='Search...'
        onChange={handleChange}
        autoFocus={true}
      />
      { isLoading &&
        <LoadingState />
      }
      { error &&
        <ErrorState error={error} />
      }
      { !error && !isLoading &&
        <MainContent ingredients={ingredients} />
      }
    </div>
  )
}

export default App;
