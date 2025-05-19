import * as React from 'react'
import { Outlet, createRootRoute, type ErrorComponentProps } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <div>Hello "__root"!</div>
      <Outlet />
      <TanStackRouterDevtools />
    </React.Fragment>
  )
}

function NotFoundComponent() {
  return <div>Not found</div>;
}

function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
    </div>
  );
}