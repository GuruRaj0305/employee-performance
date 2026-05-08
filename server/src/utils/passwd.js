require('dotenv').config();


const bcrypt = require('bcryptjs');

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10); ;

const hash = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
}

module.exports = {
  hash,
};