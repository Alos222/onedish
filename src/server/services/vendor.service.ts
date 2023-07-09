import { PrismaClient } from '@prisma/client';
import { Vendor } from 'src/types';
import { LoggerService } from './logger.service';

export interface IVendorService {}

export class VendorService implements IVendorService {
  private readonly prisma: PrismaClient;
  private readonly logger = new LoggerService(this.constructor.name);

  constructor() {
    this.prisma = new PrismaClient();
  }

  async addVendor(vendor: Vendor) {
    this.logger.info('adding vendor', { vendor });
    const result = await this.prisma.vendors.create({ data: vendor });
    this.logger.info('finished adding vendor', { result });
  }
}
