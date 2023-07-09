import { PrismaClient } from '@prisma/client';
import type { Vendor } from '@prisma/client';
import { LoggerService } from './logger.service';
import { VendorWithoutId } from 'src/types';

export interface IVendorService {}

export class VendorService implements IVendorService {
  private readonly prisma: PrismaClient;
  private readonly logger = new LoggerService(this.constructor.name);

  constructor() {
    this.prisma = new PrismaClient();
  }

  async addVendor(vendor: VendorWithoutId) {
    this.logger.info('adding vendor', { vendor });
    const result = await this.prisma.vendor.create({ data: vendor });
    this.logger.info('finished adding vendor', { result });
  }

  async getAllVendors(): Promise<Vendor[]> {
    this.logger.info('getting vendors');
    const vendors = await this.prisma.vendor.findMany();
    this.logger.info('found vendors', { vendors });
    return vendors;
  }
}
