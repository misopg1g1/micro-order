export const TypeOrmTestingConfig = (): object => {
  return {
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true,
  };
};
