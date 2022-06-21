module.exports = function () {
  return {
    flywayArgs: {
      url: 'jdbc:postgresql://localhost/postgres',
      // url: 'jdbc:mysql://localhost/db_name',
      schemas: 'public',
      user: 'postgres',
      password: 'welcome'
    }
  };
};
