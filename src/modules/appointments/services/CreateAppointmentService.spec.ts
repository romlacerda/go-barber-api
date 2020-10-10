import 'reflect-metadata';

import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository, fakeNotificationsRepository);
  })

  it('should be able to create a new appointment', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '111244',
      user_id: 'teste',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('111244');
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDate = new Date(2020, 8, 10, 16);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '111244',
      user_id: 'teste',
    });

    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '111244',
      user_id: 'teste',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 10, 10, 11),
      provider_id: '111244',
      user_id: 'teste',
    }));

  });


  it('should not be able to create an appointment with user = provider', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 10, 10, 11),
      provider_id: '111244',
      user_id: '111244',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment outside the working hour', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 10, 11, 7),
      provider_id: '111244',
      user_id: '321333',
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
      date: new Date(2020, 10, 11, 18),
      provider_id: '111244',
      user_id: '321333',
    })).rejects.toBeInstanceOf(AppError);

  });

});
