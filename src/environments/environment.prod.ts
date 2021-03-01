import { product } from './product';

export const environment = {
  product,
  production: true,
  backends: {
    main: {
      host: new URL(location.href).hostname,
      port: 8080,
    },
  },
};
