import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Button } from 'bootstrap';

const BulkEmail = () => {
  const [emailBody, setEmailBody] = useState('');

  const handleBodyChange = (value) => {
    setEmailBody(value);
  };

  return (
    <>
      <div className="container box-shadow-common-strip p-3 mb-3">
        <div className="d-flex text-center justify-content-center mb-3">
          <div>
            <input className="form-control" type="file" id="formFile" />
          </div>
          <button
            style={{ backgroundColor: '#e3273A', border: 'none' }}
            className="btn text-white ms-2"
          >
            <i className="fa-solid fa-file-csv"></i> File Upload
          </button>
        </div>

        {/* Text Editor */}
        <ReactQuill
          theme="snow"
          value={emailBody}
          onChange={handleBodyChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image', 'video'],
              ['clean'],
            ],
          }}
          formats={[
            'header',
            'bold',
            'italic',
            'underline',
            'strike',
            'list',
            'bullet',
            'link',
            'image',
            'video',
          ]}
          placeholder="Compose your email here..."
          style={{ height: '300px', marginBottom: '20px' }}
        />

        <button
          style={{ backgroundColor: '#e3273A', border: 'none' }}
          className="btn text-white"
        >
          Send Email
        </button>
      </div>
    </>
  );
};

export default BulkEmail;
