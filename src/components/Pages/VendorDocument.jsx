import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const vendorData = [
  { id: 1, active: 'Yes', type: 'Aadhaar Cards' },
  { id: 2, active: 'No', type: 'Company incorporation certificate (COI)' },
  { id: 3, active: 'Yes', type: 'GST Certificate' },
  { id: 4, active: 'Yes', type: 'Letter Head' },
  { id: 5, active: 'Yes', type: 'other' },
  { id: 6, active: 'Yes', type: 'Pan Card' },
  { id: 7, active: 'Yes', type: 'Trade Mark' },
];

const itemsPerPage = 4;

const VendorDocument = () => {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Calculate the number of pages
  const totalPages = Math.ceil(vendorData.length / itemsPerPage);

  // Get the current data for the page
  const currentData = vendorData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vendorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'VendorData');
    XLSX.writeFile(wb, 'VendorData.xlsx');
  };

  // Function to export to CSV
  const exportToCSV = () => {
    const csv = Papa.unparse(vendorData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'VendorData.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className='d-flex justify-content-between flex-wrap mb-3'>
        <h5>Required Documents for Vendors</h5>
        <Button
          style={{ backgroundColor: '#e3273A', border:'none' }}
          className='text-white'
          onClick={handleShow}
        >
          <i className="fa-solid fa-plus"></i> Add Document
        </Button>
      </div>
      <div className='p-5'>
        <Table responsive striped bordered hover>
          <thead className='text-center'>
            <tr>
              <th>#</th>
              <th>Active</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {currentData.map((vendor) => (
              <tr key={vendor.id}>
                <td>
                  <i className="fa-regular fa-pen-to-square"></i>&nbsp;&nbsp;
                  <i className="fa-solid fa-trash-can-arrow-up"></i>
                </td>
                <td>
                  <Form>
                    <Form.Check
                      type="switch"
                      id={`custom-switch-${vendor.id}`}
                      checked={vendor.active === 'Yes'}
                      readOnly
                      className={vendor.active === 'Yes' ? 'switch-active' : 'switch-inactive'}
                    />
                  </Form>
                </td>
                <td>{vendor.type}</td>
              </tr>
            ))}
          </tbody>
        </Table>

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

        <div className='d-flex justify-content-between mb-3'>
          <Button onClick={exportToExcel} variant="success">
          <i className="fa-solid fa-file-arrow-down"></i> Export to Excel
          </Button>
          <Button onClick={exportToCSV} variant="primary">
          <i className="fa-solid fa-file-arrow-down"></i> Export to CSV
          </Button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Document Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Document Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Document Type"
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VendorDocument;
