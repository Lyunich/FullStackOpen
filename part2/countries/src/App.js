import axios from 'axios'
import {useState, useEffect} from 'react'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState(null)
  const [chosenCountry, setChosenCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/all`)
      .then(response => {
        setCountries(response.data)
  })
  }, [])

  useEffect(() => {
    if (chosenCountry) {
      const coords = chosenCountry.capitalInfo.latlng
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [chosenCountry])

  if (!countries) {
    return null
  }


  const handleChange = (event) => {
    setQuery(event.target.value)
  }

  const showOneCounty = (event) => {
    setQuery(event.target.value)
  }

  const displayWeather = () => {
    if (weather) {
      console.log(weather)
      return (
        <>
          <div>temperature {weather.main.temp} Celcius</div>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
          <div>wind {weather.wind.speed} m/s</div>
        </>
      )
    }
  }

  const displayCountries = () => {
    if (query === '') {
      return null
    }

    const dispCountries = countries.filter(c => 
      c.name.common.toLowerCase().includes(query.toLowerCase())
    )

    if (dispCountries.length > 10) {
      return 'Too many matches, specify another filter'
    } else if (dispCountries.length > 1) {
      return dispCountries.map(c => 
        <div key={c.cca2}>
          {c.name.common} <button value={c.name.common} onClick={showOneCounty}>show</button>
        </div>
      )
    } else if (dispCountries.length === 1) {
      const c = dispCountries[0]

      if (!chosenCountry || c.name.common !== chosenCountry.name.common) {
        setChosenCountry(c)
      }
      
      return (
        <>
          <h2>{c.name.common}</h2>
          <div>capital {c.capital}</div>
          <div>area {c.area}</div>
          <div>
            <strong>languages:</strong>
            <ul>
              {Object.values(c.languages).map(lang => <li key={lang}>{lang}</li>)}
            </ul>
          </div>
          <img src={c.flags.png} width='140'/>
          <h3>Weather in {c.capital}</h3>
          {displayWeather()}
        </>
      )
    }
  }
  
  return (
    <div>
      <div>
        find countries: <input value={query} onChange={handleChange}/>
      </div>
      <div>
        {displayCountries()}
      </div>
    </div>
  )
}

export default App