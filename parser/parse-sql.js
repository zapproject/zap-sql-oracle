const primaryRe = /primary\s?=\s?['"]?([a-zA-Z]+)['"]?/;
const secondaryRe = /secondary\s?=\s?['"]?([a-zA-Z]+)['"]?/;
const timestampRe = /timestamp\s?[*+\-%<>!=&|~^]\s?['"]?([0-9]+)['"]?/;
const priceRe = /price\s?[*+\-%<>!=&|~^]\s?['"]?([0-9]+)['"]?/;

const parseSql = (sql) => {
  const response = {
    primary: null,
    secondary: null,
    timestamp: null,
    price: null,
    marketcap: null
  };
  const primary = primaryRe.exec(sql);
  response.primary = primary && primary[1] ? primary[1] : null;
  const secondary = secondaryRe.exec(sql);
  response.secondary = secondary && secondary[1] ? secondary[1] : null;
  const timestamp = timestampRe.exec(sql);
  response.timestamp = timestamp && timestamp[1] ? Number(timestamp[1]) : null;
  const price = priceRe.exec(sql);
  response.price = price && price[1] ? Number(price[1]) : null;
  return response;
};

module.exports = parseSql;