import './index.css'

const SalaryRangeItem = props => {
  const {salary, id, changeSalaryRange} = props

  const onRadioChange = () => {
    changeSalaryRange(id)
  }

  return (
    <li>
      <input
        name="salary-range"
        type="radio"
        value={salary}
        onChange={onRadioChange}
      />
      <label className="salary">{salary}</label>
    </li>
  )
}

export default SalaryRangeItem
