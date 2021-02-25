# StarterProject

This is intended to be a quickstart project that already includes some basic amenities.

What is included:

- `@angular/material` with custom scss theme and dark/light mode (dar/light state tracked in localStorage)
- applicatio header/footer
- home page with navigation and aside drawers (drawer state tracked between visits in localStorage)
- shows dev warning in footer if `environment.?production != true`

basic "product" information used in various places stored in `/environments/product.ts`

```
export const product = {
  name: 'StarterProject',
  description: 'Just a starter project',
  maintainer: 'you@example.com',
  version: '0.1',
  copyrightNotice: '© MyGreatCompany 2021, all rights reserved',
};
```
