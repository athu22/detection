// import React, { useState} from "react";
// import {useNavigate} from "react-router-dom";
// import axios from "axios";

// export default function ML_model(){
//     const [respred,setrespred] = useState('');
//     const navigate = useNavigate();
//     const model_predict = () => {
//         axios.post('http://127.0.0.1:5000/app.py' ,{
//             respred: respred
//         })
//         .then(function (response) {
//             console.log(response);       
//             navigate("/")
//         })
//     }
//     return ( 
//     <div>
//         <h3> Result</h3>
//         <form>
//             <div> <input type="respred" value={respred} onChange={(e) => setrespred(e.target.value)}/></div>
//             <div>
//                 <button type="button" onClick={model_predict}>Predict</button>
//             </div>
//         </form>
//     </div>
//     );
// }
import React, { useState } from 'react';
import './ML_model_css.css';

const App = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [fileDragClass, setFileDragClass] = useState('upload-box');

  const fileDragHover = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setFileDragClass(e.type === 'dragover' ? 'upload-box dragover' : 'upload-box');
  };

  const fileSelectHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target.files || e.dataTransfer.files;
    fileDragHover(e);

    for (let i = 0, f; (f = files[i]); i++) {
      previewFile(f);
    }
  };

  const submitImage = () => {
    if (!imageSrc) {
      window.alert('Please select an image before submit.');
      return;
    }

    setLoading(true);
    setResult('');

    // call the predict function of the backend
    predictImage(imageSrc);
  };

  const clearImage = () => {
    setImageSrc('');
    setResult('');
    setLoading(false);
    setFileDragClass('upload-box');
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImageSrc(URL.createObjectURL(file));
      setLoading(false);
    };
  };

  const predictImage = (imageUrl) => {
    // Convert blob URL to base64
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          
          // Send to backend
          fetch('http://127.0.0.1:5001/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(base64data),
          })
            .then((resp) => {
              if (resp.ok) resp.json().then((data) => displayResult(data));
            })
            .catch((err) => {
              console.log('An error occurred', err.message);
              window.alert('Oops! Something went wrong.');
              setLoading(false);
            });
        };
      })
      .catch((err) => {
        console.log('An error occurred converting image', err.message);
        window.alert('Oops! Something went wrong.');
        setLoading(false);
      });
  };

  const getResultClass = (result) => {
    if (!result) return '';
    if (result === 'No DR') return 'result-success';
    if (result === 'Mild' || result === 'Moderate') return 'result-warning';
    if (result === 'Severe' || result === 'Proliferative DR') return 'result-danger';
    return '';
  };

  const displayResult = (data) => {
    setLoading(false);
    setResult(data.result);
  };

  return (
    <div className="main">
      <div className="title">
        <h3>Diabetic Retinopathy Detection</h3>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginTop: '10px' }}>
          Upload a retinal image to detect diabetic retinopathy
        </p>
      </div>

      <div className="panel">
        <input
          id="file-upload"
          className="hidden"
          type="file"
          accept="image/x-png,image/gif,image/jpeg"
          onChange={(e) => fileSelectHandler(e)}
        />
        <label htmlFor="file-upload" id="file-drag" className={fileDragClass}>
          <div id="upload-caption">
            {imageSrc ? 'Image selected! Click to change' : 'Drop image here or click to select'}
          </div>
          <img id="image-preview" className={imageSrc ? '' : 'hidden'} src={imageSrc} alt="Preview" />
        </label>
      </div>

      <div className="button-container">
        <input 
          type="button" 
          value="Submit" 
          className="button" 
          onClick={submitImage}
          disabled={loading || !imageSrc}
        />
        <input 
          type="button" 
          value="Clear" 
          className="button" 
          onClick={clearImage}
          disabled={loading}
        />
      </div>

      <div id="image-box">
        <img id="image-display" src={imageSrc} alt="Display" className={loading ? 'loading' : ''} />
        <div 
          id="pred-result" 
          className={`${result ? '' : 'hidden'} ${getResultClass(result)}`}
        >
          {result && (
            <>
              <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Result:</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{result}</div>
            </>
          )}
        </div>
        <svg id="loader" className={loading ? '' : 'hidden'} viewBox="0 0 32 32" width="32" height="32">
          <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
        </svg>
      </div>
    </div>
  );
};

export default App;
// export default JS_component;



