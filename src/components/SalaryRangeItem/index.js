import './index.css'

const SalaryRangeItem = props => {
  const {salary, id, changeSalaryRange} = props

  const onRadioChange = () => {
    changeSalaryRange(id)
  }

  return (
    <li>
      <label>
        <input
          name="salary-range"
          type="radio"
          value={salary}
          onChange={onRadioChange}
        />
        <span className="salary">{salary}</span>
      </label>
    </li>
  )
}

export default SalaryRangeItem
