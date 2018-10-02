import { EndpointSchema } from './types';

export const Endpoints: EndpointSchema[] = [
  {
    name: 'CoinBaseSource',
    curve: [1, 1, 10000],
    queryList: [
      {
        query: 'price',
        params: ['{coin}', '{time}'],
        response: ['{price}', '{notaryHash}'],
        getResponse: () => ['response text']
      },
      {
        query: 'volume',
        params: ['{coin}', '{period}'],
        response: ['{volume}', '{notaryHash}'],
        getResponse: () => ['response text']
      },
    ]
  },
];