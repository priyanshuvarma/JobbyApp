import './index.css'

const NoJobView = () => (
  <div className="no-job-view-container">
    <img
      alt="no jobs"
      src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
    />
    <h1 className="no-job-heading">No Jobs Found</h1>
    <p className="no-job-sub-heading">
      We could not find any jobs. Try other filters.
    </p>
  </div>
)

export default NoJobView
