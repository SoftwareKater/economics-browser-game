import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

const logger = new Logger('GqlCurrentUserParamDecorator');

export const GqlCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    logger.log(`Getting current user from context. Got user with name: ${ctx.getContext().req.user.name}`);
    return ctx.getContext().req.user;
  },
);