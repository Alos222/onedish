import { Vendor } from '@prisma/client';

import { ApiResponse } from '../api-response';

export type VendorSearchResponse = ApiResponse<Vendor[]>;
