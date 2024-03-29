# zap-sql-oracle
Latest sql oracle template with coinmarketcap endpoint example 
( example provider address: "0x3fda6E7e9E5AEca8c6B3CD8c32079fB97a4cb221", endpoint: "CoinBaseSource" )

3 decoupled components to receive queries, respond to queries, and maintain endpoint data.
Working off a `queries` table which can be used to service other schema based endpoints and an endpoint specific data table( different across endpoints, here we have the `cryptiks` pricing data )


## Oracle

Recieves SQL queries to be made against its database at a designated time in the future in a `queries` table with following schema
```
+----------------+------------------+------+-----+---------------------+----------------+
| Field          | Type             | Null | Key | Default             | Extra          |
+----------------+------------------+------+-----+---------------------+----------------+
| id             | int(10) unsigned | NO   | PRI | NULL                | auto_increment |
| queryId        | varchar(255)     | NO   |     | NULL                |                |
| sql            | text             | NO   |     | NULL                |                |
| status         | int(10) unsigned | NO   |     | NULL                |                |
| received       | timestamp        | NO   |     | CURRENT_TIMESTAMP   |                |
| query_time     | timestamp        | NO   |     | 0000-00-00 00:00:00 |                |
| query_executed | timestamp        | YES  |     | NULL                |                |
| message        | text             | YES  |     | NULL                |                |
+----------------+------------------+------+-----+---------------------+----------------+
```
From incoming query, this script will pull:
- `sql` from the query's `query` field
- `query_time` from the query's endpointParams[0] field element
- `queryId` from the query's id field
    
and insert these fields into its `queries` table with a `status`=0 and `query_time`= above integer timestamp

## Responder

Monitors queries table for queries of status=0 and query_time < now

If rows are found, statement in `sql` column will be executed on the oracle's endpoint table( contains data for that endpoint)
and submits result as response to dispatch with `queryId`

In this example, we have a coinmarketcap price ticker table, `cryptik`
````
+-----------+------------------------+------+-----+-------------------+----------------+
| Field     | Type                   | Null | Key | Default           | Extra          |
+-----------+------------------------+------+-----+-------------------+----------------+
| id        | int(10) unsigned       | NO   | PRI | NULL              | auto_increment |
| primary   | varchar(255)           | YES  | MUL | NULL              |                |
| secondary | varchar(255)           | YES  |     | NULL              |                |
| price     | decimal(15,5) unsigned | YES  |     | NULL              |                |
| marketcap | decimal(20,5) unsigned | YES  |     | NULL              |                |
| timestamp | timestamp              | NO   |     | CURRENT_TIMESTAMP |                |
+-----------+------------------------+------+-----+-------------------+----------------+
````
In this case, an account might query the oracle's `cryptik` endpoint with the following

- query field: `select price from cryptik where primary="BTC" and secondary="USD"`
- endpointParams[0] field element: `1541011258`

this account should expect to get a response ~ timestamp 1541011258

## Fetcher
This is the script which keeps the endpoint data table (`cryptik` in example) up to date

## Services to run

For Oracle, `npm run start`

For responder, `node scripts/respond-script.js`

For fetcher `node scripts/fetch-script.js`

`services` folder providers cron wrappers for responder and fetcher

