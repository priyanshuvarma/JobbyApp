import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import AllJobsSection from '../AllJobsSection'
import FilterGroup from '../FilterGroup'

import Profile from '../Profile'

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
    activeEmployementType: ['FREELANCE', 'INTERNSHIP'],
    activeSalaryRange: '4000000',
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
      console.log(fetchedData)

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
    activeEmployementType.forEach(eachType=>(
       const apiUrl =  `https://apis.ccbp.in/jobs?employment_type=${eachType}&minimum_package=${activeSalaryRange}&search=${searchInput}`
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

      const {jobsList}=this.state
      const updatedJobsList=[...jobsList,updatedData]
      this.setState({jobsList:updatedJobsList,jobsApiStatus: jobsApiStatusConstants.success})

    ))



      
      console.log(updatedData)
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
        <img src={profileImage} />
        <p>{name}</p>
        <p>{shortBio}</p>
      </div>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsList()
    }
  }

  renderAllJobsView = () => {
    const {searchInput, jobsList} = this.state

    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobsList

    return (
      <div>
        <div className="search-input-container">
          <input
            value={searchInput}
            type="search"
            className="search-input"
            placeholder="Search"
            onChange={this.onChangeSearchInput}
            onKeyDown={this.onEnterSearchInput}
          />
          <BsSearch className="search-icon" />
        </div>
      </div>
    )
  }

  profileFailureView = () => (
    <div className="products-error-view-container">
      <h1>profile failure</h1>
    </div>
  )

  renderJobsFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="products failure"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
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

  render() {
    return (
      <>
        <Header />
        <div className="profile-filter-job-container">
          {this.renderProfile()}
          <hr className="hr-line" />>
          <div>
            <FilterGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
            />
          </div>
          <AllJobsSection />
          {this.renderAllJobsSection()}
        </div>
      </>
    )
  }
}

export default Jobs
