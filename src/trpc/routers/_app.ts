import { createTRPCRouter } from '../init';
import { billingRouter } from './billing';
import { generationsRouter } from './generations';
import { voicesRouter } from './voices';
import { callsRouter } from './calls';
import { messagesRouter } from './messages';
import { appointmentsRouter } from './appointments';
import { tenantRouter } from './tenant';

export const appRouter = createTRPCRouter({
  voices: voicesRouter,
  generations: generationsRouter,
  billing: billingRouter,
  calls: callsRouter,
  messages: messagesRouter,
  appointments: appointmentsRouter,
  tenant: tenantRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
