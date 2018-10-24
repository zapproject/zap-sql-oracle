import parseSql from './parse-sql';

test('Will Bitcoin be more than $8,500 on 24 May at 22:00?', () => {
  expect(parseSql(
    `SELECT EXISTS(
      SELECT price FROM cryptik
      WHERE primary = 'BTC'
      AND secondary = 'USD'
      AND price > 8500
      AND timestamp > 1527199200
    )`
  )).toEqual({
    primary: 'BTC',
    secondary: 'USD',
    timestamp: 1527199200,
    price: 8500,
    marketcap: null
  });
});

test('What will XRP (Ripple) price be in USD on 15/5 22:00?', () => {
  expect(parseSql(
    `SELECT price WHERE primary = XRP AND secondary = USD AND timestamp > 1526342400`
  )).toEqual({
    primary: 'XRP',
    secondary: 'USD',
    timestamp: 1526342400,
    price: null,
    marketcap: null
  });
});

test('Who will have the biggest market cap on 08 May at 10:00 UTC?', () => {
  expect(parseSql(
    `SELECT primary FROM cryptik WHERE marketcap = (SELECT max(market_cap) FROM cryptik) AND timestamp > 1525773600`
  )).toEqual({
    primary: null,
    secondary: null,
    timestamp: 1525773600,
    price: null,
    marketcap: null
  });
});

test('Will total Market Cap be more than $350 Billion on 18/4 ? * (for market cap, we evaluate primary = x, secondary = USD rows as only non-zero values)', () => {
  expect(parseSql(
    `SELECT EXISTS FROM(
      SELECT mc FROM (
       SELECT SUM(marketcap) AS mc
        FROM cryptik
        WHERE timestamp > 1524009600
        ) sum_mc
        WHERE mc > 350000000000
        );
    );`
  )).toEqual({
    primary: null,
    secondary: null,
    timestamp: 1524009600,
    price: null,
    marketcap: null
  });
});

test('Will Bitcoin be more than $8,500 on 24 May at 22:00?)', () => {
  expect(parseSql(
    `SELECT EXISTS(
      SELECT price FROM cryptik
      WHERE primary = 'BTC'
      AND secondary = 'USD'
      AND price > 8500
      AND timestamp > 1527199200
    )`
  )).toEqual({
    primary: 'BTC',
    secondary: 'USD',
    timestamp: 1527199200,
    price: 8500,
    marketcap: null
  });
});
