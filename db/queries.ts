import knex from './knex';
import { QueryEvent } from '../Oracle/types';
import mysql from 'mysql';

export enum QueryStatus {
  Scheduled,
  Running,
  Completed,
};

export function addQuery(event: QueryEvent): any {
  const timestamp = Number(event.endpointParams[0]);
  if (isNaN(timestamp)/* || timestamp * 1000 < Date.now() */) {
    console.log('query timestamp is invalid or in past');
    return Promise.resolve();
  }
  console.log('event.queryId', event.queryId);
  return knex('queries').insert({
    queryId: String(event.queryId),
    sql: event.query,
    status: QueryStatus.Scheduled,
    received: new Date(),
    query_time: new Date(timestamp * 1000),
    query_executed: null,
  }).returning('id');
}

export function getQueriesToRun(timestamp) {
  return knex('queries').where('query_time', '<', new Date(timestamp)).andWhere('status', QueryStatus.Scheduled).select('queryId', 'sql');
}

export async function getQueryData(queryId, sql) {
  return knex('queries').where('queryId', queryId).update('status', QueryStatus.Running)
    .then(() => knex.raw(sql.replace('primary', '`primary`')));
}

export function completeQuery(queryId, message = null) {
  return knex('queries').where('queryId', queryId).update({
    status: QueryStatus.Completed,
    query_executed: new Date(),
    message,
  });
}

export function queryError(queryId, message = null) {
  return knex('queries').where('queryId', queryId).update({
    query_executed: new Date(),
    message,
  });
}