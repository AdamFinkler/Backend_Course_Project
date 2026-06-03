jest.mock('../../../models/user.model');
jest.mock('../../../models/cost.model');

const User = require('../../../models/user.model');
const Cost = require('../../../models/cost.model');

const {
  createUser,
  getAllUsers,
  getUserDetails
} = require('../users.service');

describe('users.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a user when data is valid', async () => {
    User.findOne.mockResolvedValue(null);

    User.create.mockResolvedValue({
      id: 123123,
      first_name: 'Mosh',
      last_name: 'Israeli',
      birthday: new Date('1995-05-10T00:00:00.000Z')
    });

    const result = await createUser({
      id: 123123,
      first_name: 'Mosh',
      last_name: 'Israeli',
      birthday: '1995-05-10'
    });

    expect(result).toEqual({
      id: 123123,
      first_name: 'Mosh',
      last_name: 'Israeli',
      birthday: new Date('1995-05-10T00:00:00.000Z')
    });
  });

  it('throws when user already exists', async () => {
    User.findOne.mockResolvedValue({ id: 123123 });

    await expect(
      createUser({
        id: 123123,
        first_name: 'Mosh',
        last_name: 'Israeli',
        birthday: '1995-05-10'
      })
    ).rejects.toMatchObject({
      id: 'USER_ALREADY_EXISTS'
    });
  });

  it('returns all users', async () => {
    User.find.mockResolvedValue([
      {
        id: 123123,
        first_name: 'Mosh',
        last_name: 'Israeli'
      }
    ]);

    const result = await getAllUsers();

    expect(result).toEqual([
      {
        id: 123123,
        first_name: 'Mosh',
        last_name: 'Israeli'
      }
    ]);
  });

  it('returns user details with total costs', async () => {
    User.findOne.mockResolvedValue({
      id: 123123,
      first_name: 'Mosh',
      last_name: 'Israeli'
    });

    Cost.aggregate.mockResolvedValue([
      {
        _id: null,
        total: 40
      }
    ]);

    const result = await getUserDetails(123123);

    expect(result).toEqual({
      first_name: 'Mosh',
      last_name: 'Israeli',
      id: 123123,
      total: 40
    });
  });

  it('throws when user does not exist', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(getUserDetails(999999)).rejects.toMatchObject({
      id: 'USER_NOT_FOUND'
    });
  });
});