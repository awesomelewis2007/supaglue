import { getDependencyContainer } from '@/dependency_container';
import { toGetInternalParams, toListInternalParams } from '@supaglue/core/mappers';
import { toSnakecasedKeysUser } from '@supaglue/core/mappers/engagement';
import {
  GetUserPathParams,
  GetUserRequest,
  GetUserResponse,
  GetUsersPathParams,
  GetUsersRequest,
  GetUsersResponse,
} from '@supaglue/schemas/engagement';
import { ListParams } from '@supaglue/types/common';
import { Request, Response, Router } from 'express';

const {
  engagement: { userService },
} = getDependencyContainer();

export default function init(app: Router): void {
  const router = Router();

  router.get(
    '/',
    async (
      req: Request<GetUsersPathParams, GetUsersResponse, GetUsersRequest, /* GetUsersQueryParams */ ListParams>,
      res: Response<GetUsersResponse>
    ) => {
      const { next, previous, results } = await userService.list(
        req.customerConnection.id,
        toListInternalParams(req.query)
      );
      const snakeCaseKeysResults = results.map(toSnakecasedKeysUser);
      return res.status(200).send({ next, previous, results: snakeCaseKeysResults });
    }
  );

  router.get(
    '/:user_id',
    async (req: Request<GetUserPathParams, GetUserResponse, GetUserRequest>, res: Response<GetUserResponse>) => {
      const user = await userService.getById(
        req.params.user_id,
        req.customerConnection.id,
        toGetInternalParams(req.query)
      );
      return res.status(200).send(toSnakecasedKeysUser(user));
    }
  );

  app.use('/users', router);
}
