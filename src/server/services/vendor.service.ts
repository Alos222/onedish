import { PrismaClient } from '@prisma/client';
import type { Prisma, Vendor } from '@prisma/client';
import { LoggerService } from './logger.service';
import { VendorWithoutId } from 'src/types';
import { DefaultArgs } from '@prisma/client/runtime';

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
    return result.id;
  }

  async getVendor(vendorId: string): Promise<Vendor | null> {
    return this.prisma.vendor.findFirst({
      where: {
        id: vendorId,
      },
    });
  }

  async getAllVendors(): Promise<Vendor[]> {
    this.logger.info('getting vendors');
    const vendors = await this.prisma.vendor.findMany();
    this.logger.info('found vendors', { vendors });
    return vendors;
  }

  async getPaginatedResults(
    sortType: string | undefined | null,
    column: string,
    searchQuery: string,
    skip: number,
    take: number
  ) {
    this.logger.info('query', {
      count: {
        where: {
          [column]: {
            mode: 'insensitive',
            contains: searchQuery,
          },
        },
      },
      findMany: {
        skip,
        take,
        where: {
          [column]: {
            mode: 'insensitive',
            contains: searchQuery,
          },
        },
        orderBy: {
          [column]: sortType ?? 'asc',
        },
      },
    });
    const results = await this.prisma.$transaction([
      this.prisma.vendor.count({
        where: {
          [column]: {
            mode: 'insensitive',
            contains: searchQuery,
          },
        },
      }),
      this.prisma.vendor.findMany({
        skip,
        take,
        where: {
          [column]: {
            mode: 'insensitive',
            contains: searchQuery,
          },
        },
        orderBy: {
          [column]: sortType ?? 'asc',
        },
      }),
    ]);

    return {
      total: results[0] ?? 0,
      data: results[1],
    };
  }
}
