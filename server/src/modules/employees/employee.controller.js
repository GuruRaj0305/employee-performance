const employeeService = require("./employee.service");

const listEmployees = async (req, res) => {
  try {
    const employees = await employeeService.listEmployees();

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: employees,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const result = await employeeService.createEmployee(req.body);

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: result.user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const removeEmployee = async (req, res) => {
  try {
    await employeeService.removeEmployee(req.params.id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Employee removed successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  listEmployees,
  createEmployee,
  updateEmployee,
  removeEmployee,
};
