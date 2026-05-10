"use strict";

const { v4: uuidv4 } = require("uuid");
const { hash } = require("../utils/passwd");

module.exports = {
  async up(queryInterface) {
    const password = await hash("admin123"); // Hash the password using the utility function

    await queryInterface.bulkInsert("users", [
      {
        id: uuidv4(),
        name: "Admin",
        email_id: "admin@gmail.com",
        password,
        type: "ADMIN",
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email_id: "admin@gmail.com",
    });
  },
};
