import {useState, useEffect} from 'react'

import phonebookService from './services/phonebook'

const Notification = ({message}) => {
  const styleSuccess = {
    color: 'green',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    fontSize: 20,
    marginBottom: 8
  }
  const styleFail = {
    color: 'red',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    fontSize: 20,
    marginBottom: 8
  }
  if (message === null) {
    return null
  }
  const style = message[0] ? styleSuccess : styleFail
  return (
    <div style={style}>
      {message[1]}
    </div>
  )
}

const Person = ({person, deletePerson}) => 
  <div>
    {person.name} {person.number} 
    <button onClick={() => deletePerson(person)}>delete</button>
  </div>


const Persons = ({persons, filters, deletePerson}) =>
  persons
    .filter(person => person.name.toLowerCase().includes(filters.toLowerCase()))
    .map(person => <Person key={person.id} person={person}
      deletePerson={deletePerson} />)

const Filter = ({handle}) =>
  <div>
    filter shown with <input onChange={handle} />
  </div>


const PersonForm = (props) => {
  const {newName, newNumber, addPerson,
    handleNameChange, handleNumberChange} = props
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">
          add
        </button>
      </div>
    </form>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filters, setFilters] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    phonebookService.getAll().then(data => {
      setPersons(data)
    })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFiltersChange = (event) => setFilters(event.target.value)

  const replaceNumber = (id, newData) => {
    if (window.confirm(`${newData.name} is already added to phonebook, replace the old number with a new one?`)) {
      phonebookService
        .replace(id, newData)
        .then(changedData => {
          setPersons(persons.map(person => person.id !== id ? person : changedData))
          setMessage([true, `Changed ${newData.name}`])
        })
        .catch(error => {
          setMessage([false, `Information of ${newData.name} has already been removed from server`])
          setPersons(persons.filter(p => p.id !== id))
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName, number: newNumber
    }
    const duplicate = persons.find(person => person.name === newPerson.name)
    if (duplicate) {
      replaceNumber(duplicate.id, newPerson)
    } else {
      phonebookService.create(newPerson).then(addedPerson =>{
        setPersons(persons.concat(addedPerson))
        setNewName('')
        setNewNumber('')
        setMessage([true, `Added ${addedPerson.name}`])
      })
    }
    setTimeout(() => {
      setMessage(null)
    }, 4000)
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      phonebookService.del(person.id).then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
      })
    }
  }

  return (
    <div>
        <h2>Phonebook</h2>
        <Notification message={message} />
        <Filter handle={handleFiltersChange} />
        <h2>Add a new</h2>
        <PersonForm newName={newName} newNumber={newNumber} addPerson={addPerson}
          handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
        />
        <h2>Numbers</h2>
        <Persons persons={persons} filters={filters} deletePerson={deletePerson} />
    </div>
  )
}

export default App