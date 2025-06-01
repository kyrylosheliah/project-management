import { Outlet, createRootRoute, type ErrorComponentProps } from '@tanstack/react-router';
import { NavigationHeader } from '../components/NavigationHeader';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <>
      <NavigationHeader />
      <div className="flex flex-col items-center justify-start w-full">
        <div className="max-w-4xl w-full pt-4 px-4">
          <Outlet />
        </div>
      </div>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
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