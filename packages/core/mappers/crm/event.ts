import { CrmEvent } from '@supaglue/db';
import { GetInternalParams } from '@supaglue/types';
import { Event, RemoteEvent } from '@supaglue/types/crm';
import { v5 as uuidv5 } from 'uuid';
import {
  toSnakecasedKeysAccount,
  toSnakecasedKeysContact,
  toSnakecasedKeysLead,
  toSnakecasedKeysOpportunity,
  toSnakecasedKeysUser,
} from '.';

export const toSnakecasedKeysEvent = (event: Event) => {
  return {
    id: event.id,
    owner_id: event.ownerId,
    owner: event.owner ? toSnakecasedKeysUser(event.owner) : undefined,
    account_id: event.accountId,
    account: event.account ? toSnakecasedKeysAccount(event.account) : undefined,
    contact_id: event.contactId,
    contact: event.contact ? toSnakecasedKeysContact(event.contact) : undefined,
    lead_id: event.leadId,
    lead: event.lead ? toSnakecasedKeysLead(event.lead) : undefined,
    opportunity_id: event.opportunityId,
    opportunity: event.opportunity ? toSnakecasedKeysOpportunity(event.opportunity) : undefined,
    last_modified_at: event.lastModifiedAt,
    remote_id: event.remoteId,
    type: event.type,
    subject: event.subject,
    content: event.content,
    start_time: event.startTime,
    end_time: event.endTime,
    remote_created_at: event.remoteCreatedAt,
    remote_updated_at: event.remoteUpdatedAt,
    remote_was_deleted: event.remoteWasDeleted,
    raw_data: event.rawData,
  };
};

export const fromEventModel = (
  {
    id,
    remoteId,
    ownerId,
    subject,
    content,
    startTime,
    endTime,
    type,
    accountId,
    contactId,
    leadId,
    opportunityId,
    lastModifiedAt,
    remoteCreatedAt,
    remoteUpdatedAt,
    remoteWasDeleted,
    rawData,
  }: CrmEvent,
  getParams?: GetInternalParams
): Event => {
  return {
    id,
    remoteId,
    ownerId,
    subject,
    content,
    startTime,
    endTime,
    type,
    accountId,
    contactId,
    leadId,
    opportunityId,
    lastModifiedAt,
    remoteCreatedAt,
    remoteUpdatedAt,
    remoteWasDeleted,
    rawData: getParams?.include_raw_data && typeof rawData === 'object' ? (rawData as Record<string, any>) : undefined,
  };
};

// TODO: Use prisma generator to generate return type
export const fromRemoteEventToDbEventParams = (connectionId: string, customerId: string, remoteEvent: RemoteEvent) => {
  const lastModifiedAt =
    remoteEvent.remoteUpdatedAt || remoteEvent.detectedOrRemoteDeletedAt
      ? new Date(
          Math.max(remoteEvent.remoteUpdatedAt?.getTime() || 0, remoteEvent.detectedOrRemoteDeletedAt?.getTime() || 0)
        )
      : undefined;

  return {
    id: uuidv5(remoteEvent.remoteId, connectionId),
    remote_id: remoteEvent.remoteId,
    customer_id: customerId,
    connection_id: connectionId,
    subject: remoteEvent.subject,
    content: remoteEvent.content,
    type: remoteEvent.type,
    start_time: remoteEvent.startTime?.toISOString(),
    end_time: remoteEvent.endTime?.toISOString(),
    remote_created_at: remoteEvent.remoteCreatedAt?.toISOString(),
    remote_updated_at: remoteEvent.remoteUpdatedAt?.toISOString(),
    remote_was_deleted: remoteEvent.remoteWasDeleted,
    remote_deleted_at: remoteEvent.remoteDeletedAt?.toISOString(),
    detected_or_remote_deleted_at: remoteEvent.detectedOrRemoteDeletedAt?.toISOString(),
    last_modified_at: lastModifiedAt?.toISOString(),
    _remote_account_id: remoteEvent.remoteAccountId,
    account_id: remoteEvent.remoteAccountId ? uuidv5(remoteEvent.remoteAccountId, connectionId) : null,
    _remote_contact_id: remoteEvent.remoteContactId,
    contact_id: remoteEvent.remoteContactId ? uuidv5(remoteEvent.remoteContactId, connectionId) : null,
    _remote_lead_id: remoteEvent.remoteLeadId,
    lead_id: remoteEvent.remoteLeadId ? uuidv5(remoteEvent.remoteLeadId, connectionId) : null,
    _remote_opportunity_id: remoteEvent.remoteOpportunityId,
    opportunity_id: remoteEvent.remoteOpportunityId ? uuidv5(remoteEvent.remoteOpportunityId, connectionId) : null,
    _remote_owner_id: remoteEvent.remoteOwnerId,
    owner_id: remoteEvent.remoteOwnerId ? uuidv5(remoteEvent.remoteOwnerId, connectionId) : null,
    updated_at: new Date().toISOString(),
    raw_data: remoteEvent.rawData,
  };
};
