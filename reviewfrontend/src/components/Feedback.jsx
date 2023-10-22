import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import styles from '../assets/feedback.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Feedback = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [activeOption, setActiveOption] = useState('User Interface Feedback');
    const [star_rating, setStarRating] = useState(0);
    const [comment, setComment] = useState('');
    const [apiResponse, setApiResponse] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [systemFeedback, setSystemFeedback] = useState(null);
    const review_file = JSON.parse(localStorage.getItem('uploadFile'))?.unique_id;

    const handleStarClick = (rating) => {
        setStarRating(rating);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    useEffect(() => {
        // Fetch system feedback only when 'System Feedback' is active
        if (activeOption === 'System Feedback') {
            fetchSystemFeedback();
        }
    }, [activeOption]);

    const handleActiveOptionChange = (option) => {
        setActiveOption(option);
        // Reset the starRating and comment
        setStarRating(0);
        setComment('');
        setApiError(null);
        setApiResponse(null);
    }
    
    const fetchSystemFeedback = async () => {
        const apiEndpoint = `${apiUrl}/systemfeedback/`;
        setLoading(true);
        try {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            if (response.ok) {
                setSystemFeedback(data.feedback || 'No feedback available.'); // Assuming the API returns a field named 'feedback'
            } else {
                setApiError(data.error || 'There was an error fetching the feedback.');
            }
        } catch (error) {
            setApiError('An unexpected error occurred. Please try again later.');
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        // Determine the appropriate API endpoint and request body based on the current sidebar option
        let apiEndpoint;
        let requestBody;

        switch (activeOption) {
            case 'User Interface Feedback':
                apiEndpoint = `${apiUrl}/interfacefeedback/`;
                requestBody = {
                    review_file,
                    comment
                };
                break;
            case 'Review feedback about input file':
                apiEndpoint = `${apiUrl}/reviewfeedback/`;
                requestBody = {
                    review_file,
                    star_rating,
                    comment
                };
                break;
            default:
                return;
        }

        // Clear previous responses/errors and start loading
        setApiResponse(null);
        setApiError(null);
        setLoading(true);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok) {
                setApiResponse(data.message || 'Feedback submitted successfully!');
            } else {
                setApiError(data.error || 'There was an error submitting your feedback.');
            }

        } catch (error) {
            setApiError('An unexpected error occurred. Please try again later.');
            console.error('Error submitting feedback:', error);
        } finally {
            setLoading(false);
        }
    };


    const renderContent = () => {
        switch (activeOption) {
            case 'System Feedback':
                return (
                    <div className={styles.div}>
                        <h2 className={styles.h2}>System generated a Feedback based on analyzed review</h2>
                        <p className={styles.systemFeedback}>{systemFeedback}</p>
                        {
                            apiError && <p className={styles.error}>{apiError}</p>
                        }
                    </div>
                );
            case 'User Interface Feedback':
                return (
                    <div className={styles.feedbackDiv}>
                        <h2 className={styles.h2}>Please give the feedback about our interface and the results</h2>
                        <label className={styles.label}>Comment:</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Type your comment..."
                            value={comment}
                            onChange={handleCommentChange}
                        ></textarea>
                        <button className={styles.button} onClick={handleSubmit}>Submit</button>
                        {
                            loading && <p className={styles.loading}>Submitting feedback...</p>
                        }
                        {
                            apiResponse && <p className={styles.success}>{apiResponse}</p>
                        }
                        {
                            apiError && <p className={styles.error}>{apiError}</p>
                        }
                    </div>
                );
            case 'Review feedback about input file':
                return (
                    <div className={styles.feedbackDiv}>
                        <h2 className={styles.h2}>Leave your review and rating about the input file:</h2>

                        <label className={styles.label}>Rating:</label>
                        <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FontAwesomeIcon
                                    key={star}
                                    icon={faStar}
                                    className={star <= star_rating ? styles.activeStar : ''}
                                    onClick={() => handleStarClick(star)}
                                />
                            ))}
                        </div>

                        <label className={styles.label}>Comment:</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Type your review..."
                            value={comment}
                            onChange={handleCommentChange}
                        ></textarea>

                        <button className={styles.button} onClick={handleSubmit}>Submit</button>
                        {
                            loading && <p className={styles.loading}>Submitting feedback...</p>
                        }
                        {
                            apiResponse && <p className={styles.success}>{apiResponse}</p>
                        }
                        {
                            apiError && <p className={styles.error}>{apiError}</p>
                        }

                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`${styles.div}`}>
          <Navbar activePage="Feedback" />
          <div className={`${styles.container} backgroundImage`}>
            <div className={styles.sidebar}>
              <ul className="list-group mb-5">
                <li className={activeOption === 'User Interface Feedback' ? "list-group-item active" : "list-group-item"} onClick={() => handleActiveOptionChange('User Interface Feedback')}>User Interface Feedback</li>
                <li className={activeOption === 'Review feedback about input file' ? "list-group-item active" : "list-group-item"} onClick={() => handleActiveOptionChange('Review feedback about input file')}>Review feedback about input file</li>
              </ul>
            </div>
            <main className={styles.main}>
              {renderContent()}
            </main>
          </div>
        </div>
      );
      
    // return (
    //     <div className={styles.div}>
    //         <Navbar activePage="Feedback" />
    //         <div className={styles.container}>
    //             <div className={styles.sidebar}>
    //                 <ul className="list-group mb-5">
    //                     {/* <li className={activeOption === 'System Feedback' ? "list-group-item active" : "list-group-item"} onClick={() => handleActiveOptionChange('System Feedback')}>System Feedback</li> */}
    //                     <li className={activeOption === 'User Interface Feedback' ? "list-group-item active" : "list-group-item"} onClick={() => handleActiveOptionChange('User Interface Feedback')}>User Interface Feedback</li>
    //                     <li className={activeOption === 'Review feedback about input file' ? "list-group-item active" : "list-group-item"} onClick={() => handleActiveOptionChange('Review feedback about input file')}>Review feedback about input file</li>
    //                 </ul>
    //             </div>
    //             <main className={styles.main}>
    //                 {renderContent()}
    //             </main>
    //         </div>
    //     </div>
    // );
}

export default Feedback;
