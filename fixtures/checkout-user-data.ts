export const CHECKOUT_USERS = {
  validCustomer: {
    firstName: 'Alice',
    lastName: 'Smith',
    postalCode: '12345',
  },
  validCustomerTwo: {
    firstName: 'John',
    lastName: 'Deere',
    postalCode: '98765',
  },
  missingFirstName: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345',
  },
  missingLastName: {
    firstName: 'Jane',
    lastName: '',
    postalCode: '12345',
  },
  missingPostalCode: {
    firstName: 'Jane',
    lastName: 'Doe',
    postalCode: '',
  },
  allFieldsBlank: {
    firstName: '',
    lastName: '',
    postalCode: '',
  },
} as const;


export type CheckoutUserKey = keyof typeof CHECKOUT_USERS;
export type CheckoutUser = typeof CHECKOUT_USERS[CheckoutUserKey];
