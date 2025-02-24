import prisma, { PrismaClient } from '@supaglue/db';
import fs from 'fs';
import { Pool } from 'pg';
import {
  ConnectionService,
  CustomerService,
  IntegrationService,
  RemoteService,
  SgUserService,
  SyncHistoryService,
} from './services';
import { ApplicationService } from './services/application_service';
import {
  AccountService,
  ContactService as CrmContactService,
  EventService,
  LeadService,
  OpportunityService,
  UserService as CrmUserService,
} from './services/common_models/crm';
import {
  ContactService as EngagementContactService,
  MailboxService,
  SequenceService,
  UserService as EngagementUserService,
} from './services/common_models/engagement';
import { SequenceStateService } from './services/common_models/engagement/sequence_state_service';
import { WebhookService } from './services/webhook_service';

export type CoreDependencyContainer = {
  pgPool: Pool;
  prisma: PrismaClient;

  // mgmt
  applicationService: ApplicationService;
  sgUserService: SgUserService;
  connectionService: ConnectionService;
  integrationService: IntegrationService;
  customerService: CustomerService;
  remoteService: RemoteService;
  syncHistoryService: SyncHistoryService;
  webhookService: WebhookService;

  // crm
  crm: {
    accountService: AccountService;
    contactService: CrmContactService;
    leadService: LeadService;
    opportunityService: OpportunityService;
    userService: CrmUserService;
    eventService: EventService;
  };

  // engagement
  engagement: {
    contactService: EngagementContactService;
    userService: EngagementUserService;
    sequenceService: SequenceService;
    mailboxService: MailboxService;
    sequenceStateService: SequenceStateService;
  };
};

// global
let coreDependencyContainer: CoreDependencyContainer | undefined = undefined;

function createCoreDependencyContainer(): CoreDependencyContainer {
  const connectionString = process.env.SUPAGLUE_DATABASE_URL!;
  // parse the connectionString URL to get the ssl config from the query string
  const parsedConnectionString = new URL(connectionString);
  const caCertPath = parsedConnectionString.searchParams.get('sslcert');
  const sslMode = parsedConnectionString.searchParams.get('sslmode');
  const sslAccept = parsedConnectionString.searchParams.get('sslaccept');
  // delete from the query string so that the connectionString can be passed to the pgPool
  parsedConnectionString.searchParams.delete('sslcert');
  parsedConnectionString.searchParams.delete('sslmode');
  parsedConnectionString.searchParams.delete('sslaccept');
  const ssl =
    sslMode === 'require' || sslMode === 'prefer'
      ? {
          ca: caCertPath ? fs.readFileSync(caCertPath).toString() : undefined,
          rejectUnauthorized: sslAccept === 'strict',
        }
      : undefined;

  const pgPool = new Pool({
    connectionString: parsedConnectionString.toString(),
    max: 5,
    ssl,
  });

  // mgmt
  const applicationService = new ApplicationService(prisma);
  const sgUserService = new SgUserService();
  const integrationService = new IntegrationService(prisma);
  const connectionService = new ConnectionService(prisma, integrationService);
  const customerService = new CustomerService(prisma);
  const remoteService = new RemoteService(connectionService, integrationService);
  const webhookService = new WebhookService({ prisma });

  // crm
  const accountService = new AccountService(pgPool, prisma, remoteService);
  const leadService = new LeadService(pgPool, prisma, remoteService);
  const opportunityService = new OpportunityService(pgPool, prisma, remoteService);
  const contactService = new CrmContactService(pgPool, prisma, remoteService);
  const syncHistoryService = new SyncHistoryService(prisma, connectionService);
  const userService = new CrmUserService(pgPool, prisma, remoteService);
  const eventService = new EventService(pgPool, prisma, remoteService);

  // engagement
  const engagementContactService = new EngagementContactService(pgPool, prisma, remoteService);
  const engagementUserService = new EngagementUserService(pgPool, prisma, remoteService);
  const sequenceService = new SequenceService(pgPool, prisma, remoteService);
  const mailboxService = new MailboxService(pgPool, prisma, remoteService);
  const sequenceStateService = new SequenceStateService(pgPool, prisma, remoteService);

  return {
    pgPool,
    prisma,
    // mgmt
    applicationService,
    sgUserService,
    connectionService,
    customerService,
    integrationService,
    remoteService,
    webhookService,
    syncHistoryService,
    // crm
    crm: {
      contactService,
      accountService,
      leadService,
      opportunityService,
      userService,
      eventService,
    },
    // engagement
    engagement: {
      contactService: engagementContactService,
      userService: engagementUserService,
      sequenceService,
      mailboxService,
      sequenceStateService,
    },
  };
}

export function getCoreDependencyContainer(): CoreDependencyContainer {
  if (!coreDependencyContainer) {
    coreDependencyContainer = createCoreDependencyContainer();
  }

  return coreDependencyContainer;
}
