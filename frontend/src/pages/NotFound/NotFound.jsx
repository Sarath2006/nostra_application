import React from 'react'
import { useNavigate } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="notfound-wrapper">
      <div className="notfound-container">
        <div className="notfound-content">
          <p className="notfound-label">OOPS! PAGE NOT FOUND</p>
          <h1 className="notfound-code">404</h1>
          <p className="notfound-description">
            WE ARE SORRY, BUT THE PAGE YOU REQUESTED WAS<br />NOT FOUND
          </p>
          <button className="notfound-button" onClick={handleGoHome}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
