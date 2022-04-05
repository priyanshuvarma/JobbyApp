import './index.css'

const EmploymentTypeItem = props => {
  const {name, id, changeEmpType} = props

  const onClickAddOrRemoveCheckbox = () => {
    changeEmpType(id)
  }

  return (
    <li>
      <input
        onChange={onClickAddOrRemoveCheckbox}
        type="checkbox"
        className="checkbox"
        name={name}
        value={name}
      />
      <span className="emp-type"> {name}</span>
    </li>
  )
}

export default EmploymentTypeItem
