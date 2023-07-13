import { NextResponse } from 'next/server';

import { ApiResponse } from 'src/types/response/api-response';

import { LoggerService } from '../services/logger.service';

/**
 * Middleware for API requests that handles errors.
 *
 * // TODO Use this in the secureApiMiddleware
 *
 * @param logger A logger
 * @param req The request data
 * @param next The API function
 * @returns
 */
export const apiMiddleware = async <T>(
  logger: LoggerService,
  req: Request,
  next: () => Promise<ApiResponse<T>>,
): Promise<NextResponse> => {
  const url = req.url;

  try {
    const response = await next();
    if (response.error) {
      // Assume something went wrong in the next() function, so return as error
      return NextResponse.json(response, { status: 400 });
    }
    return NextResponse.json(response);
  } catch (err) {
    // TODO Put more metadata into logs
    logger.error('Something went wrong during API request', { err, url });
    return NextResponse.json(
      {
        error: 'Something went wrong...',
      },
      { status: 400 },
    );
  }
};
