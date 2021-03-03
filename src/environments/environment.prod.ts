import { product } from './product';

export const environment = {
  product,
  production: true,
  backends: {
    main: {
      host: '192.168.178.88',
      port: 8080,
    },
  },
};
