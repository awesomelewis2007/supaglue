import { CrmContact } from '@supaglue/db';
import { GetInternalParams } from '@supaglue/types';
import { Contact, RemoteContact } from '@supaglue/types/crm';
import { Address, EmailAddress, LifecycleStage, PhoneNumber } from '@supaglue/types/crm/common';
import { v5 as uuidv5 } from 'uuid';
import { toSnakecasedKeysAccount } from './account';
import { toSnakecasedKeysAddress } from './address';
import { toSnakecasedKeysEmailAddress } from './email_address';
import { toSnakecasedKeysPhoneNumber } from './phone_number';
import { toSnakecasedKeysUser } from './user';

export const toSnakecasedKeysContact = (contact: Contact) => {
  return {
    id: contact.id,
    owner_id: contact.ownerId,
    owner: contact.owner ? toSnakecasedKeysUser(contact.owner) : undefined,
    account_id: contact.accountId,
    account: contact.account ? toSnakecasedKeysAccount(contact.account) : undefined,
    last_modified_at: contact.lastModifiedAt,
    remote_id: contact.remoteId,
    first_name: contact.firstName,
    last_name: contact.lastName,
    addresses: contact.addresses.map(toSnakecasedKeysAddress),
    phone_numbers: contact.phoneNumbers.map(toSnakecasedKeysPhoneNumber),
    email_addresses: contact.emailAddresses.map(toSnakecasedKeysEmailAddress),
    last_activity_at: contact.lastActivityAt,
    lifecycle_stage: contact.lifecycleStage,
    remote_created_at: contact.remoteCreatedAt,
    remote_updated_at: contact.remoteUpdatedAt,
    remote_was_deleted: contact.remoteWasDeleted,
    raw_data: contact.rawData,
  };
};

export const fromContactModel = (
  {
    id,
    remoteId,
    ownerId,
    accountId,
    firstName,
    lastName,
    addresses,
    emailAddresses,
    phoneNumbers,
    lifecycleStage,
    lastActivityAt,
    remoteCreatedAt,
    remoteUpdatedAt,
    remoteWasDeleted,
    lastModifiedAt,
    rawData,
  }: CrmContact,
  getParams?: GetInternalParams
): Contact => {
  return {
    id,
    remoteId,
    ownerId,
    accountId,
    firstName,
    lastName,
    addresses: addresses as Address[],
    emailAddresses: emailAddresses as EmailAddress[],
    phoneNumbers: phoneNumbers as PhoneNumber[],
    lifecycleStage: lifecycleStage as LifecycleStage,
    lastActivityAt,
    remoteCreatedAt,
    remoteUpdatedAt,
    remoteWasDeleted,
    lastModifiedAt,
    rawData: getParams?.include_raw_data && typeof rawData === 'object' ? (rawData as Record<string, any>) : undefined,
  };
};

// TODO: Use prisma generator to generate return type
export const fromRemoteContactToDbContactParams = (
  connectionId: string,
  customerId: string,
  remoteContact: RemoteContact
) => {
  const lastModifiedAt =
    remoteContact.remoteUpdatedAt || remoteContact.detectedOrRemoteDeletedAt
      ? new Date(
          Math.max(
            remoteContact.remoteUpdatedAt?.getTime() || 0,
            remoteContact.detectedOrRemoteDeletedAt?.getTime() || 0
          )
        )
      : undefined;

  return {
    id: uuidv5(remoteContact.remoteId, connectionId),
    remote_id: remoteContact.remoteId,
    customer_id: customerId,
    connection_id: connectionId,
    first_name: remoteContact.firstName,
    last_name: remoteContact.lastName,
    addresses: remoteContact.addresses,
    email_addresses: remoteContact.emailAddresses,
    phone_numbers: remoteContact.phoneNumbers,
    lifecycle_stage: remoteContact.lifecycleStage,
    last_activity_at: remoteContact.lastActivityAt?.toISOString(),
    remote_created_at: remoteContact.remoteCreatedAt?.toISOString(),
    remote_updated_at: remoteContact.remoteUpdatedAt?.toISOString(),
    remote_was_deleted: remoteContact.remoteWasDeleted,
    remote_deleted_at: remoteContact.remoteDeletedAt?.toISOString(),
    detected_or_remote_deleted_at: remoteContact.detectedOrRemoteDeletedAt?.toISOString(),
    last_modified_at: lastModifiedAt?.toISOString(),
    _remote_account_id: remoteContact.remoteAccountId,
    account_id: remoteContact.remoteAccountId ? uuidv5(remoteContact.remoteAccountId, connectionId) : null,
    _remote_owner_id: remoteContact.remoteOwnerId,
    owner_id: remoteContact.remoteOwnerId ? uuidv5(remoteContact.remoteOwnerId, connectionId) : null,
    updated_at: new Date().toISOString(),
    raw_data: remoteContact.rawData,
  };
};
