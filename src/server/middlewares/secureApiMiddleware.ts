import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { LoggerService } from '../services/logger.service';
import { ApiResponse } from 'src/types/response/api-response';
import { NextResponse } from 'next/server';

/**
 * Middleware for API requests that handles errors and ensures a user is authorized.
 *
 * TODO Add roles and check them here
 * @param logger A logger
 * @param req The request data
 * @param next The API function
 * @returns
 */
export const secureApiMiddleware = async <T>(
  logger: LoggerService,
  req: Request,
  next: () => Promise<ApiResponse<T>>
): Promise<NextResponse> => {
  const url = req.url;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      logger.warn('Unauthorized access attempted at secure API', { session, url });
      return NextResponse.json(
        {
          error: 'Unauthorized access',
        },
        { status: 401 }
      );
    }

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
      { status: 400 }
    );
  }
};
