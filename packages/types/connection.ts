import { CategoryOfProviderName, ProviderName } from '.';

export type ConnectionStatus = 'available' | 'added' | 'authorized' | 'callable';

type BaseConnectionCredentialsDecrypted = {
  type: 'oauth2';
  accessToken: string;
  refreshToken: string;
  expiresAt: string | null; // null means unknown expiry time
};

export type ConnectionCredentialsDecrypted<T extends ProviderName> = BaseConnectionCredentialsDecrypted &
  (T extends 'salesforce'
    ? {
        instanceUrl: string;
        loginUrl?: string;
      }
    : T extends 'pipedrive'
    ? {
        instanceUrl: string;
      }
    : object);

export type ConnectionCredentialsDecryptedAny = ConnectionCredentialsDecrypted<ProviderName>;

export type ConnectionCreateParams<T extends ProviderName> = {
  applicationId: string;
  customerId: string; // external customer id
  integrationId: string;
  category: CategoryOfProviderName<T>;
  providerName: T;
  credentials: ConnectionCredentialsDecrypted<T>;
  // Deprecated -- use instanceUrl instead
  remoteId: string;
  instanceUrl: string;
};

export type ConnectionCreateParamsAny = ConnectionCreateParams<ProviderName>;

export type ConnectionUpsertParams<T extends ProviderName> = ConnectionCreateParams<T>;

export type ConnectionUpsertParamsAny = ConnectionUpsertParams<ProviderName>;

export type ConnectionSafe<T extends ProviderName> = Omit<ConnectionCreateParams<T>, 'credentials'> & {
  id: string;
  status: ConnectionStatus;
  category: CategoryOfProviderName<T>;
  providerName: T;
};

export type ConnectionSafeAny = ConnectionSafe<ProviderName>;

export type ConnectionUnsafe<T extends ProviderName> = ConnectionCreateParams<T> & {
  id: string;
  status: ConnectionStatus;
  category: CategoryOfProviderName<T>;
  providerName: T;
};

export type ConnectionUnsafeAny = ConnectionUnsafe<ProviderName>;
