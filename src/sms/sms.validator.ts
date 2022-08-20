export const createSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
        },
      },
      required: ['phone'],
    },
  },
  required: ['body'],
};

export const retrieveSchema = {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        code: { type: 'string' },
      },
      required: ['code'],
    },
  },
  required: ['pathParameters'],
};
