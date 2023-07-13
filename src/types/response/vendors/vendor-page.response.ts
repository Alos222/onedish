import { Vendor } from '@prisma/client';

import { ApiResponse } from '../api-response';

export type VendorPageData = { data: Vendor[]; total: number };
export type VendorPageResponse = ApiResponse<VendorPageData>;
