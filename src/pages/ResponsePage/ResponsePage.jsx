import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/ResponsePage.css'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/loading';

export default function ResponsePage() {
  const [physioFormData, setPhysioFormData] = useState([]);
  const [treatmentData, setTreatmentData] = useState([]);
  const [loading, setLoading] = useState(true)
  const userId = localStorage.getItem('decoded_token');
  const isSuperUser = localStorage.getItem('isSuperUser') === 'true';
  const [message, setMessage] = useState("A Physio will look to answer your query as soon as they can! In the mean time why don't you check out the useful information we have to offer in our other pages!")
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        let apiUrl = `${process.env.REACT_APP_BACKEND_URL}/physioform/`;

        // If the user is not a superuser, fetch only their most recent physioform data
        if (!isSuperUser) {
          apiUrl += `user/${userId}`;
        }

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          if (data.length > 0) { 
            if (!isSuperUser) {
              // If the user is not a superuser, sort and get the most recent entry
              const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
              const mostRecentPhysioformData = sortedData[0];
              setPhysioFormData([mostRecentPhysioformData]);
              
            } else {
              const physioformsWithoutTreatments = data.filter((physioform) => !physioform.treatment_complete);
              setPhysioFormData(physioformsWithoutTreatments);
              
              
            }
          } else {
            console.error("Physioform data is not an array:", data);
          }
        }
        setLoading(false)
      } catch (error) {
        console.log("Error fetching physioform data", error);
        setLoading(false)
      }
    }

    fetchData();
    // eslint-disable-next-line
  }, [isSuperUser, userId]);

  useEffect(() => {
    // Fetch treatment data for the most recent physioform entry
    if (!isSuperUser && physioFormData && physioFormData.length > 0) {
      const physioFormId = getIdFromUrl(physioFormData[0].url);
      localStorage.setItem("physio_form", physioFormId);

      async function fetchTreatmentData() {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/treatments/physioform/${physioFormId}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
          });

          const data = await response.json();

          if (Array.isArray(data)) {
            if (data.length > 0) { 
            setTreatmentData(data);
            setMessage('')
            
            // localStorage.setItem("physio_form", physioFormId);
          } else {
            console.error("Treatment data is not an array:", data);
          }
        }
        setLoading(false)
        } catch (error) {
          console.log("Error fetching treatment data", error);
          setLoading(false)
        }
      }

      fetchTreatmentData();
    }
  }, [physioFormData, isSuperUser, setTreatmentData]);

  const handleDeletePhysioForm = async () => {
    // Check if physioFormData has at least one element
    if (physioFormData.length > 0) {
      const physioFormId = getIdFromUrl(physioFormData[0].url);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/physioformdelete/${physioFormId}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (response.ok) {
          console.log('Physio Form deleted successfully');
          setPhysioFormData([]);
          navigate("/")
        } else {
          console.error('Error deleting physio form');
        }
      } catch (error) {
        console.error('Error deleting physio form:', error);
      }
    } else {
      console.warn('physioFormData is empty. No physioform to delete.');
    }
  };

  const getIdFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 2]; 
  };

  return (
    <div className="container">
      <h1>Physioform Details</h1>
      {loading ? (
        <Loading /> // Render the loading component while data is being fetched
      ) : (
        // Render your data when loading is false
        <>
      {physioFormData.length > 0 ? (
        physioFormData.map((formData, index) => (
          <div className="physioform-container" key={index}>
            <strong>Name:</strong>{formData.name}<br />
            <strong>Age:</strong>{formData.age}<br />
            <strong>Date:</strong> {formData.date}<br />
            <strong>Body Part:</strong> {formData.body_part}<br />
            <strong>Time:</strong> {formData.time}<br />
            <strong>Trauma:</strong> {formData.trauma}<br />
            <strong>Location:</strong> {formData.location}<br />
            <strong>Scans:</strong> {formData.scans}<br />
            <strong>Aggravating Factors:</strong> {formData.aggs}<br />
            <strong>Easing Factors:</strong> {formData.eases}<br />
            <strong>Past Treatment:</strong> {formData.past_treatment}<br />
            <strong>Medication:</strong> {formData.medication}<br />
            <strong>Work:</strong> {formData.work}<br />
            <strong>Goals:</strong> {formData.goals}<br />
            {/* <strong>Treatment:</strong> {formData.treatment_complete.toString()}<br /> */}
            {!isSuperUser && (
            <>
              <button className='delete-btn' onClick={handleDeletePhysioForm}>Delete</button>
              <Link to="/form/update">
                <button className='link-btn'>Edit</button>
              </Link>
              <p>{message}</p>
            </>
          )}
            {isSuperUser && (
              <Link to={`/treatments/add/${getIdFromUrl(formData.url)}`}>
                <button className="treatment-btn">Add Treatment</button>
              </Link>
            )}
          </div>
        ))
      ) : (
        <p>You have no physio queries. If you would like to make one then please head to the Physio Form page.</p>
      )}

      {!isSuperUser && treatmentData.length > 0 ? (
        <div className="treatment-details">
          <hr />
          <h2>Treatment Details</h2>
          {treatmentData.map((treatment, treatmentIndex) => (
            <div key={treatmentIndex}>
              <strong>Date:</strong> {treatment.date}<br />
              <strong>Response:</strong> {treatment.response}<br />
            </div>
          ))}
        </div>
      ) : (
        <p>{!isSuperUser ? "" : ""}</p>
      )}
        </>
      )}
    </div>
  );
}
