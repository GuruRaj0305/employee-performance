const { User } = require("../../models/index.model");
const authService = require("../auth/auth.service");

const employeeAttributes = ["id", "name", "emailId", "type", "active", "createdAt", "updatedAt"];
const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const listEmployees = () => {
  const employees = User.findAll({
    where: { type: "EMPLOYEE" },
    attributes: employeeAttributes,
    order: [["createdAt", "DESC"]],
  });
  return employees;
};

const createEmployee = async (data) => {
  const result = await authService.registerUser(data);

  return {
    user: await User.findByPk(result.user.id, {
      attributes: employeeAttributes,
    }),
  };
};

const assertEditableEmployee = (user, currentUserId) => {
  if (user.id === currentUserId) {
    const error = new Error("You cannot manage your own account from employee management");
    error.statusCode = 400;
    throw error;
  }

  if (user.type !== "EMPLOYEE") {
    const error = new Error("Only employee accounts can be managed here");
    error.statusCode = 400;
    throw error;
  }
};

const updateEmployee = async (id, data, currentUserId) => {
  const user = await User.findByPk(id);

  if (!user) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  assertEditableEmployee(user, currentUserId);

  if (data.email !== undefined) {
    const normalizedEmail = normalizeEmail(data.email);
    const existingUser = await User.findOne({ where: { emailId: normalizedEmail } });

    if (existingUser && existingUser.id !== id) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  await user.update({
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.email !== undefined ? { emailId: normalizeEmail(data.email) } : {}),
    ...(data.password !== undefined ? { password: data.password } : {}),
    ...(data.active !== undefined ? { active: data.active } : {}),
  });

  return User.findByPk(id, {
    attributes: employeeAttributes,
  });
};

const removeEmployee = async (id, currentUserId) => {
  const user = await User.findByPk(id);

  if (!user) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  assertEditableEmployee(user, currentUserId);

  await user.update({ active: false });
};

module.exports = {
  listEmployees,
  createEmployee,
  updateEmployee,
  removeEmployee,
};
