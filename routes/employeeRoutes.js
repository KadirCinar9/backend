// Backend (Express) - employeeRoutes.js

const express = require('express');
const Employee = require('../models/Employee'); 
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { department, position } = req.query;
    const query = {};
    
    if (department) {
      // Using regex for case-insensitive search on department
      query.department = { $regex: department, $options: 'i' };  // 'i' option makes it case-insensitive
    }
    
    if (position) {
      // Using regex for case-insensitive search on position
      query.position = { $regex: position, $options: 'i' };  // 'i' option makes it case-insensitive
    }

  
    
    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
});






// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new employee
router.post(
  '/employees',
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('position').notEmpty().withMessage('Position is required'),
    body('salary').isFloat({ gt: 0 }).withMessage('Salary must be a positive number'),
    body('date_of_joining').isISO8601().withMessage('Date of joining must be a valid date'),
    body('department').notEmpty().withMessage('Department is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;
    const employee = new Employee({ first_name, last_name, email, position, salary, date_of_joining, department });

    try {
      await employee.save();
      res.status(201).json({
        message: 'Employee created successfully.',
        employee_id: employee._id,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update employee details by ID
router.put(
  '/employees/:id',
  [
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('salary').optional().isFloat({ gt: 0 }).withMessage('Salary must be a positive number'),
    body('date_of_joining').optional().isISO8601().withMessage('Date of joining must be a valid date'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!employee) return res.status(404).json({ message: 'Employee not found.' });
      res.json({ message: 'Employee details updated successfully.' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete employee by ID
router.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });
    res.json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
