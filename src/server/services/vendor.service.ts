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
    return result.id;
  }

  async updateVendor(vendorId: string, vendor: VendorWithoutId) {
    this.logger.info('update vendor', { vendor });
    const result = await this.prisma.vendor.update({ where: { id: vendorId }, data: vendor });
    this.logger.info('finished updating vendor', { result });
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

  /**
   * Gets all vendors that have OneDishes
   *
   * TODO Need to do infinite scrolling
   * @returns
   */
  async getAllOneDishVendors(): Promise<Vendor[]> {
    const vendors = await this.prisma.vendor.findMany({
      where: {
        oneDishes: {
          isEmpty: false,
        },
      },
    });
    return vendors;
  }

  async deleteVendor(vendorId: string): Promise<void> {
    this.logger.info('delete vendor', { vendorId });
    const result = await this.prisma.vendor.delete({ where: { id: vendorId } });
    this.logger.info('finished deleting vendor', { result });
    return;
  }

  async getPaginatedResults(
    sortType: string | undefined | null,
    column: string,
    searchQuery: string,
    skip: number,
    take: number,
  ) {
    let where = {};
    if (column !== 'created' && column !== 'updated') {
      where = {
        [column]: {
          mode: 'insensitive',
          contains: searchQuery,
        },
      };
    }
    const results = await this.prisma.$transaction([
      this.prisma.vendor.count({
        where,
      }),
      this.prisma.vendor.findMany({
        skip,
        take,
        where,
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

  async searchVendors(search: string | null): Promise<Vendor[]> {
    if (!search) {
      return [];
    }

    const results = await this.prisma.vendor.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            oneDishes: {
              some: {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      },
    });

    console.log({ results, search });
    return results;
  }
}
