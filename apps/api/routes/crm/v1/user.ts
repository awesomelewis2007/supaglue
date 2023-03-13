import { getDependencyContainer } from '@/dependency_container';
import { snakecaseKeys } from '@/lib/snakecase';
import { ListParams } from '@supaglue/core/types/common';
import {
  GetUserPathParams,
  GetUserRequest,
  GetUserResponse,
  GetUsersPathParams,
  GetUsersRequest,
  GetUsersResponse,
} from '@supaglue/schemas/crm';
import { Request, Response, Router } from 'express';

const { userService } = getDependencyContainer();

export default function init(app: Router): void {
  const router = Router();

  router.get(
    '/',
    async (
      req: Request<GetUsersPathParams, GetUsersResponse, GetUsersRequest, /* GetUsersQueryParams */ ListParams>,
      res: Response<GetUsersResponse>
    ) => {
      const { next, previous, results } = await userService.list(req.customerConnection.id, req.query);
      const snakeCaseKeysResults = results.map((result) => {
        return snakecaseKeys(result);
      });
      return res.status(200).send({ next, previous, results: snakeCaseKeysResults });
    }
  );

  router.get(
    '/:user_id',
    async (req: Request<GetUserPathParams, GetUserResponse, GetUserRequest>, res: Response<GetUserResponse>) => {
      const user = await userService.getById(req.params.user_id, req.customerConnection.id);
      return res.status(200).send(snakecaseKeys(user));
    }
  );

  app.use('/users', router);
}
