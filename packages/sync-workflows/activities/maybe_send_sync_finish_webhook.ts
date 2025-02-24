import { maybeSendWebhookPayload } from '@supaglue/core/lib/webhook';
import { ConnectionService, IntegrationService } from '@supaglue/core/services';
import { CommonModel } from '@supaglue/types/common';
import { ApplicationService } from 'sync-worker/services';

export function createMaybeSendSyncFinishWebhook({
  connectionService,
  integrationService,
  applicationService,
}: {
  connectionService: ConnectionService;
  integrationService: IntegrationService;
  applicationService: ApplicationService;
}) {
  return async function maybeSendSyncFinishWebhook({
    historyId,
    connectionId,
    status,
    numRecordsSynced,
    commonModel,
    errorMessage,
  }: {
    historyId: string;
    connectionId: string;
    status: 'SYNC_SUCCESS' | 'SYNC_ERROR';
    numRecordsSynced: number;
    commonModel: CommonModel;
    errorMessage?: string;
  }) {
    const connection = await connectionService.getSafeById(connectionId);
    const integration = await integrationService.getById(connection.integrationId);
    const { config } = await applicationService.getById(integration.applicationId);
    if (config.webhook) {
      await maybeSendWebhookPayload(config.webhook, status, {
        connectionId,
        customerId: connection.customerId,
        providerName: connection.providerName,
        historyId,
        numRecordsSynced,
        commonModel,
        errorMessage,
      });
    }
  };
}
