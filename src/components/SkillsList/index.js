import './index.css'

const SkillsList = props => {
  const {skillDetail} = props
  const {name, skillImageUrl} = skillDetail

  return (
    <li className="skill-item">
      <img className="skill-image" src={skillImageUrl} alt={name} />
      <p className="skill-name">{name}</p>
    </li>
  )
}

export default SkillsList
