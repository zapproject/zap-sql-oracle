module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'oracle',
      password : 'multipass',
      database : 'coinmarketcap'
    },
    migrations: {
      directory: __dirname + '/db/migrations',
      loadExtensions: ['.js'],
    }
  }
}