import { getDependencyContainer } from '@/dependency_container';
import { stringOrNullOrUndefinedToDate } from '@/lib/date';
import { toGetInternalParams, toSearchInternalParams } from '@supaglue/core/mappers';
import { toSnakecasedKeysOpportunity } from '@supaglue/core/mappers/crm';
import { toListInternalParams } from '@supaglue/core/mappers/params';
import {
  CreateOpportunityPathParams,
  CreateOpportunityRequest,
  CreateOpportunityResponse,
  GetOpportunitiesPathParams,
  GetOpportunitiesRequest,
  GetOpportunitiesResponse,
  GetOpportunityPathParams,
  GetOpportunityRequest,
  GetOpportunityResponse,
  SearchOpportunitiesPathParams,
  SearchOpportunitiesRequest,
  SearchOpportunitiesResponse,
  UpdateOpportunityPathParams,
  UpdateOpportunityRequest,
  UpdateOpportunityResponse,
} from '@supaglue/schemas/crm';
import { ListParams } from '@supaglue/types/common';
import { camelcaseKeys, camelcaseKeysSansCustomFields } from '@supaglue/utils/camelcase';
import { Request, Response, Router } from 'express';

const {
  crm: { opportunityService },
} = getDependencyContainer();

export default function init(app: Router): void {
  const router = Router();

  router.get(
    '/',
    async (
      req: Request<
        GetOpportunitiesPathParams,
        GetOpportunitiesResponse,
        GetOpportunitiesRequest,
        /* GetOpportunitiesQueryParams */ ListParams
      >,
      res: Response<GetOpportunitiesResponse>
    ) => {
      const { next, previous, results } = await opportunityService.list(
        req.customerConnection.id,
        toListInternalParams(req.query)
      );
      const snakeCaseKeysResults = results.map(toSnakecasedKeysOpportunity);
      return res.status(200).send({ next, previous, results: snakeCaseKeysResults });
    }
  );

  router.get(
    '/:opportunity_id',
    async (
      req: Request<GetOpportunityPathParams, GetOpportunityResponse, GetOpportunityRequest>,
      res: Response<GetOpportunityResponse>
    ) => {
      const opportunity = await opportunityService.getById(
        req.params.opportunity_id,
        req.customerConnection.id,
        toGetInternalParams(req.query)
      );
      return res.status(200).send(toSnakecasedKeysOpportunity(opportunity));
    }
  );

  router.post(
    '/',
    async (
      req: Request<CreateOpportunityPathParams, CreateOpportunityResponse, CreateOpportunityRequest>,
      res: Response<CreateOpportunityResponse>
    ) => {
      const { customerId, id: connectionId } = req.customerConnection;
      const originalParams = camelcaseKeysSansCustomFields(req.body.model);
      const opportunityCreateParams = {
        ...originalParams,
        closeDate: stringOrNullOrUndefinedToDate(originalParams.closeDate),
      };
      const opportunity = await opportunityService.create(customerId, connectionId, opportunityCreateParams);
      return res.status(200).send({ model: toSnakecasedKeysOpportunity(opportunity) });
    }
  );

  router.patch(
    '/:opportunity_id',
    async (
      req: Request<UpdateOpportunityPathParams, UpdateOpportunityResponse, UpdateOpportunityRequest>,
      res: Response<UpdateOpportunityResponse>
    ) => {
      const { customerId, id: connectionId } = req.customerConnection;
      const originalParams = camelcaseKeysSansCustomFields(req.body.model);
      const opportunityUpdateParams = {
        id: req.params.opportunity_id,
        ...originalParams,
        closeDate: stringOrNullOrUndefinedToDate(originalParams.closeDate),
      };
      const opportunity = await opportunityService.update(customerId, connectionId, opportunityUpdateParams);
      return res.status(200).send({ model: toSnakecasedKeysOpportunity(opportunity) });
    }
  );

  router.delete('/:opportunity_id', () => {
    throw new Error('Not implemented');
  });

  router.post(
    '/_search',
    async (
      req: Request<SearchOpportunitiesPathParams, SearchOpportunitiesResponse, SearchOpportunitiesRequest>,
      res: Response<SearchOpportunitiesResponse>
    ) => {
      const { next, previous, results } = await opportunityService.search(
        req.customerConnection.id,
        toSearchInternalParams(req.params),
        camelcaseKeys(req.body.filters)
      );

      const snakeCaseKeysResults = results.map(toSnakecasedKeysOpportunity);

      return res.status(200).send({ next, previous, results: snakeCaseKeysResults });
    }
  );

  app.use('/opportunities', router);
}
