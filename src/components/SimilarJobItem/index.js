import {BsStar, BsBriefcase} from 'react-icons/bs'
import {IoLocationOutline} from 'react-icons/io5'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    title,
    location,
    jobDescription,
    companyLogoUrl,
    rating,
    employmentType,
  } = jobDetails

  return (
    <li className="similar-product-item">
      <div className="top-card-bg">
        <div className="top-part-card">
          <img
            className="company-logo"
            alt="similar job company logo"
            src={companyLogoUrl}
          />
          <div>
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <BsStar className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="desc-container">
          <h1 className="desc-heading">Description</h1>
          <p className="description">{jobDescription}</p>
        </div>
        <div className="location-package-container">
          <div className="location-internship-container">
            <div className="location-container">
              <IoLocationOutline className="location-icon" />
              <p className="location">{location}</p>
            </div>
            <div className="internship-container">
              <BsBriefcase className="internship-icon" />
              <p className="internship">{employmentType}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
