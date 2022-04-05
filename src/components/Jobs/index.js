import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import AllJobsSection from '../AllJobsSection'
import EmploymentTypeItem from '../EmploymentTypeItem'
import SalaryRangeItem from '../SalaryRangeItem'
import NoJobView from '../NoJobView'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const jobsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: [],
    profileApiStatus: profileApiStatusConstants.initial,
    jobsList: [],
    jobsApiStatus: jobsApiStatusConstants.initial,
    activeEmployementType: [],
    activeSalaryRange: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getProfileDetails = async () => {
    this.setState({
      profileApiStatus: profileApiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImage: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedData,
        profileApiStatus: profileApiStatusConstants.success,
      })
    } else {
      this.setState({
        profileApiStatus: profileApiStatusConstants.failure,
      })
    }
  }

  getJobsList = async () => {
    this.setState({
      jobsApiStatus: jobsApiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeEmployementType, activeSalaryRange, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmployementType.join()}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(product => ({
        companyLogoUrl: product.company_logo_url,
        employmentType: product.employment_type,
        id: product.id,
        jobDescription: product.job_description,
        location: product.location,
        packagePerAnnum: product.package_per_annum,
        rating: product.rating,
        title: product.title,
      }))
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: jobsApiStatusConstants.success,
      })
    } else {
      this.setState({
        jobsApiStatus: jobsApiStatusConstants.failure,
      })
    }
  }

  renderProfileDetailsView = () => {
    const {profileDetails} = this.state
    const {name, profileImage, shortBio} = profileDetails
    return (
      <div className="profile-bg">
        <img alt="profile" src={profileImage} />
        <p>{name}</p>
        <p>{shortBio}</p>
      </div>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = () => {
    this.getJobsList()
  }

  renderAllJobsView = () => {
    const {searchInput, jobsList} = this.state
    const lengthOfList = jobsList.length

    return (
      <div className="jobs-card-section">
        <div className="search-input-container">
          <input
            value={searchInput}
            type="search"
            className="search-input"
            placeholder="Search"
            onChange={this.onChangeSearchInput}
          />
          <button
            onClick={this.onEnterSearchInput}
            className="search-button"
            testid="searchButton"
            type="button"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        {lengthOfList !== 0 ? (
          jobsList.map(each => (
            <ul>
              <AllJobsSection key={each.key} jobDetail={each} />
            </ul>
          ))
        ) : (
          <NoJobView />
        )}
      </div>
    )
  }

  profileFailureView = () => (
    <div className="products-error-view-container">
      <button
        type="button"
        onClick={this.renderProfileDetailsView}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderJobsFailureView = () => (
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
      <button type="button" onClick={this.getJobsList} className="retry-button">
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllJobsSection = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case jobsApiStatusConstants.success:
        return this.renderAllJobsView()
      case jobsApiStatusConstants.failure:
        return this.renderJobsFailureView()
      case jobsApiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfile = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case profileApiStatusConstants.success:
        return this.renderProfileDetailsView()
      case profileApiStatusConstants.failure:
        return this.profileFailureView()
      case profileApiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  changeEmpType = id => {
    const {activeEmployementType} = this.state
    if (activeEmployementType.toString().includes(id) === false) {
      const updatedEmpType = [...activeEmployementType, id]
      this.setState({activeEmployementType: updatedEmpType}, this.getJobsList)
    } else {
      const myIndex = activeEmployementType.indexOf(id)
      const toDeleteEmpType = activeEmployementType.splice(myIndex, 1)
      const updatedEmpType = activeEmployementType.filter(
        each => each !== toDeleteEmpType,
      )
      this.setState({activeEmployementType: updatedEmpType}, this.getJobsList)
    }
  }

  changeSalaryRange = id => {
    this.setState({activeSalaryRange: id}, this.getJobsList)
  }

  render() {
    return (
      <>
        <Header />
        <div className="profile-job-card-container">
          <div className="profile-filter-job-container">
            {this.renderProfile()}
            <hr className="hr-line" />
            <h1 className="type-of-emp-heading">Type of Employment</h1>
            <ul>
              {employmentTypesList.map(eachType => (
                <EmploymentTypeItem
                  key={eachType.employmentTypeId}
                  id={eachType.employmentTypeId}
                  name={eachType.label}
                  changeEmpType={this.changeEmpType}
                />
              ))}
            </ul>
            <hr className="hr-line" />
            <h1 className="type-of-emp-heading">Salary Range</h1>
            <ul>
              {salaryRangesList.map(eachRange => (
                <SalaryRangeItem
                  key={eachRange.salaryRangeId}
                  id={eachRange.salaryRangeId}
                  salary={eachRange.label}
                  changeSalaryRange={this.changeSalaryRange}
                />
              ))}
            </ul>
          </div>
          {this.renderAllJobsSection()}
        </div>
      </>
    )
  }
}

export default Jobs
