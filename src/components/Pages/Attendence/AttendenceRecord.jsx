import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { url } from '../../URL/Url';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are included

const itemsPerPage = 8;

function AttendenceRecord() {
  const [attendence, setAttendence] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const getAttendenceRecord = async () => {
    try {
      const response = await axios.get(`${url}/api/userLogin/AttenceRecord`);
      setAttendence(response.data.Attendence);
    } catch (error) {
      console.error('Error fetching attendance record:', error);
    }
  };

  useEffect(() => {
    getAttendenceRecord();
  }, []);

  // Calculate the number of pages
  const totalPages = Math.ceil(attendence.length / itemsPerPage);

  // Get the current data for the page
  const currentData = attendence.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className='d-flex align-items-center flex-wrap box-shadow-common-strip p-3 mb-3'>
        <i className="fa-solid fa-file-lines"></i>
        <h5 className='ms-2 mt-1 fs-11'>Attendance Record</h5>
      </div>

      <div className='p-5 box-shadow-common' style={{ maxHeight: '500px', overflowY: 'scroll' }}>
        <Table responsive striped bordered hover className='attendence-record-body'>
          <thead className='text-center'>
            <tr>
              <th>employeeId</th>
              <th>firstName</th>
              <th>lastName</th>
              <th>role</th>
              <th>email</th>
              <th>department</th>
              <th>loginDate</th>
              <th>loginTime</th>
              <th>logoutDate</th>
              <th>logoutTime</th>
              <th>totalHours</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {currentData.length > 0 ? (
              currentData.map((val) => (
                <tr key={val._id}>
                  <td>{val.employeeId}</td>
                  <td>{val.firstName}</td>
                  <td>{val.lastName}</td>
                  <td>{val.role}</td>
                  <td>{val.email}</td>
                  <td>{val.department}</td>
                  <td>{val.loginDate}</td>
                  <td>{val.loginTime}</td>
                  <td>{val.logoutDate}</td>
                  <td>{val.logoutTime}</td>
                  <td>{val.totalHours}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className='d-flex justify-content-center mb-3'>
        <Pagination>
          <Pagination.First
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }).map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </>
  );
}

export default AttendenceRecord;
