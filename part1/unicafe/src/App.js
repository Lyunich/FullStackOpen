import {useState} from 'react'

const Button = (props) => {
  const {text, handleClick} = props
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = (props) => {
  const {good, bad, neutral} = props
  const all = good + neutral + bad

  if (all < 1) {
    return <div>No feedback given</div>
  }

  return (
  <table><tbody>
    <StatisticLine text='good' value={good} />
    <StatisticLine text='neutral' value={neutral} />
    <StatisticLine text='bad' value={bad} />
    <StatisticLine text='all' value={all} />
    <StatisticLine text='average' value={(good - bad) / all} />
    <StatisticLine text='positive' value={good / all * 100 + ' %'} />
    </tbody></table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
      <h1>statistics</h1>
      
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

export default App