import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GqlCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    console.log(`Getting current user from context. Got user with name: ${ctx.getContext().req.user.name}`);
    return ctx.getContext().req.user;
  },
);