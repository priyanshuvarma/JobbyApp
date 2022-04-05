import {BsStar, BsBriefcase, BsBoxArrowUpRight} from 'react-icons/bs'
import {IoLocationOutline} from 'react-icons/io5'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import SkillsList from '../SkillsList'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
    skills: [],
  }

  componentDidMount() {
    this.getJobData()
  }

  getSkillsData = dat => ({
    name: dat.name,
    skillImageUrl: dat.image_url,
  })

  getFormattedSimilarData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeDescription: data.life_at_company.description,
    lifeDescImage: data.life_at_company.image_url,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.job_details)
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(
        eachSimilarJob => this.getFormattedSimilarData(eachSimilarJob),
      )
      const skillsData = fetchedData.job_details.skills.map(eachSkill =>
        this.getSkillsData(eachSkill),
      )

      this.setState({
        jobData: updatedData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
        skills: skillsData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobDetailsView = () => {
    const {jobData, similarJobsData, skills} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      title,
      rating,
      jobDescription,
      lifeDescription,
      location,
      packagePerAnnum,
      lifeDescImage,
    } = jobData

    return (
      <div>
        <div className="top-card-bg">
          <div className="top-part-card">
            <img
              className="company-logo"
              alt="job details company logo"
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
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line" />
          <div className="desc-container">
            <div className="desc-visit-container">
              <h1 className="desc-heading">Description</h1>
              <div className="visit-container">
                <a href={companyWebsiteUrl} className="visit">
                  Visit
                </a>
                <BsBoxArrowUpRight className="box-arrow" />
              </div>
            </div>
            <p className="description">{jobDescription}</p>
          </div>
          <div>
            <h1 className="skills">Skills</h1>
            <ul className="skills-list">
              {skills.map(eachSkill => (
                <SkillsList key={eachSkill.name} skillDetail={eachSkill} />
              ))}
            </ul>
          </div>
          <div>
            <h1 className="life-heading">Life at Company</h1>
            <div className="life-desc-image-container">
              <p className="life-desc">{lifeDescription}</p>
              <img
                className="life-desc-image"
                alt="life at company"
                src={lifeDescImage}
              />
            </div>
          </div>
        </div>
        <div className="similar-job-container">
          <h1 className="similar-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobsData.map(eachSimilarItem => (
              <SimilarJobItem
                key={eachSimilarItem.id}
                jobDetails={eachSimilarItem}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onClickRetry = () => {
    this.getJobData()
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        onClick={this.onClickRetry}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
