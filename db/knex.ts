import * as config from '../knexfile.js';
import * as Knex from 'knex';

const env = process.env.NODE_ENV || 'development';

export default Knex(config[env]);