const { getDevelopersTeam } = require('../about.service');

describe('about.service', () => {
  it('returns developers team', () => {
    const result = getDevelopersTeam();

    expect(result).toEqual([
      {
        first_name: 'Adam',
        last_name: 'Finkler'
      },
      {
        first_name: 'Amiram',
        last_name: 'Amsalem'
      },
      {
        first_name: 'Irvin',
        last_name: 'Rosenfeld'
      }
    ]);
  });
});