import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderMonthAvailability {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.body;

    const listProviderDayAvailbility = container.resolve(ListProviderDayAvailabilityService);

    const availbility = await listProviderDayAvailbility.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.json(availbility);
  }
}
