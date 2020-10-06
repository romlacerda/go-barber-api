
import 'reflect-metadata';

import UpdateProfileService from './UpdateProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  })


  it('should be apple to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@john.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'jhontre@example.com'
    });

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('jhontre@example.com');
  });

  it('should not be apple to update the profile of non-existing user', async () => {
    await expect(updateProfile.execute({
      user_id: 'non-existing',
      name: 'John Trê',
      email: 'jhontre@example.com'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the email if it is already in use', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@john.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Doe',
      email: 'kkk@john.com',
      password: '123456',
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johndoe@john.com'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@john.com',
      password: '123123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'jhontre@example.com',
      old_password: '123123',
      password: '1231111'
    });

    expect(updatedUser.password).toBe('1231111');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@john.com',
      password: '123123',
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'jhontre@example.com',
      password: '1231111'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@john.com',
      password: '123123',
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'jhontre@example.com',
      old_password: 'wrong',
      password: '1231111'
    })).rejects.toBeInstanceOf(AppError);
  });
});
