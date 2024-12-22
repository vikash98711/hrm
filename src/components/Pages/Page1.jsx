import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';

const Page1 = () => {
  const { Formik } = formik;

  const schema = yup.object().shape({
    productName: yup.string().required('Product Name is required'),
    category: yup.string().required('Category is required'),
    amount: yup
      .number()
      .required('Amount is required')
      .positive('Amount must be positive'),
    city: yup.string().required('City is required'),
    brand: yup.string().required('Brand is required'),
    productDescription: yup.string().required('Product Description is required'),
    thumbnailImage: yup.mixed().required('Thumbnail Image is required'),
    detailsImage: yup.mixed().required('Details Image is required'),
    terms: yup.bool().required().oneOf([true], 'Terms must be accepted'),
  });

  return (
    <>
    
    <Formik
      validationSchema={schema}
      onSubmit={(values) => console.log(values)}
      initialValues={{
        productName: '',
        category: '',
        amount: '',
        city: '',
        brand: '',
        productDescription: '',
        thumbnailImage: null,
        detailsImage: null,
        terms: false,
      }}
    >
      
      {({ handleSubmit, handleChange, setFieldValue, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit} className='box-downshadow p-2'>
          
          <Row className="mb-3">
            {/* Product Name */}
            <Form.Group as={Col} md="6" controlId="validationFormikProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={values.productName}
                onChange={handleChange}
                isValid={touched.productName && !errors.productName}
                isInvalid={touched.productName && !!errors.productName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.productName}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Category */}
            <Form.Group as={Col} md="6" controlId="validationFormikCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={values.category}
                onChange={handleChange}
                isValid={touched.category && !errors.category}
                isInvalid={touched.category && !!errors.category}
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
                <option value="toys">Toys</option>
                {/* Add more categories as needed */}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.category}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            {/* Amount */}
            <Form.Group as={Col} md="6" controlId="validationFormikAmount">
              <Form.Label>Amount</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Amount"
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  isInvalid={touched.amount && !!errors.amount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* City */}
            <Form.Group as={Col} md="6" controlId="validationFormikCity">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                name="city"
                value={values.city}
                onChange={handleChange}
                isInvalid={touched.city && !!errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            {/* Brand */}
            <Form.Group as={Col} md="6" controlId="validationFormikBrand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Brand"
                name="brand"
                value={values.brand}
                onChange={handleChange}
                isInvalid={touched.brand && !!errors.brand}
              />
              <Form.Control.Feedback type="invalid">
                {errors.brand}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Product Description */}
            <Form.Group as={Col} md="6" controlId="validationFormikProductDescription">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Product Description"
                name="productDescription"
                value={values.productDescription}
                onChange={handleChange}
                isInvalid={touched.productDescription && !!errors.productDescription}
              />
              <Form.Control.Feedback type="invalid">
                {errors.productDescription}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            {/* Thumbnail Image */}
            <Form.Group as={Col} md="6" controlId="validationFormikThumbnailImage">
              <Form.Label>Product Thumbnail Image</Form.Label>
              <Form.Control
                type="file"
                name="thumbnailImage"
                onChange={(event) => setFieldValue("thumbnailImage", event.currentTarget.files[0])}
                isInvalid={touched.thumbnailImage && !!errors.thumbnailImage}
              />
              <Form.Control.Feedback type="invalid">
                {errors.thumbnailImage}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Details Image */}
            <Form.Group as={Col} md="6" controlId="validationFormikDetailsImage">
              <Form.Label>Product Details Image</Form.Label>
              <Form.Control
                type="file"
                name="detailsImage"
                onChange={(event) => setFieldValue("detailsImage", event.currentTarget.files[0])}
                isInvalid={touched.detailsImage && !!errors.detailsImage}
              />
              <Form.Control.Feedback type="invalid">
                {errors.detailsImage}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          {/* Terms and Conditions */}
          <Form.Group className="mb-3" controlId="validationFormikTerms">
            <Form.Check
              required
              name="terms"
              label="Agree to terms and conditions"
              onChange={handleChange}
              isInvalid={touched.terms && !!errors.terms}
              feedback={errors.terms}
              feedbackType="invalid"
            />
          </Form.Group>

          <Button type="submit">Submit form</Button>
        </Form>
      )}
    </Formik>
    </>
  );
};

export default Page1;
