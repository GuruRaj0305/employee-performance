const { development_db_config, test_db_config, production_db_config } = require("./config");

module.exports = {
  development: development_db_config,
  test: test_db_config,
  production: production_db_config,
};
