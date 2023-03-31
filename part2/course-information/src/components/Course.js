const Header = ({ name }) => <h2>{name}</h2>

const Total = ({ parts }) =>
<strong>
  total of {parts.reduce((total, item) => total + item.exercises, 0)} exercises
</strong>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <div>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </div>

const Course = ({course}) =>
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>

export default Course