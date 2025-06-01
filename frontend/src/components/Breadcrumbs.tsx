import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Fragment } from "react";
import { IconChevronRight } from "./icons/ChevronRight";
import ButtonIcon from "./ui/ButtonIcon";

export function Breadcrumbs() {
  const routerState = useRouterState();
  const navigate = useNavigate();

  const generateBreadcrumbs = () => {
    const pathname = routerState.location.pathname;
    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbs = [{ label: "Home", path: "/", isLast: false }];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Might be and id
      if (/^\d+$/.test(segment)) {
        label = `ID: ${segment}`;
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === segments.length - 1,
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      className="flex items-center space-x-2 text-sm text-gray-500"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((crumb) => (
        <Fragment key={crumb.path}>
          <div className="flex items-center">
            {crumb.isLast ? (
              <span className="flex items-center text-gray-900 font-medium">
                {crumb.label}
              </span>
            ) : (
              <button
                onClick={() => navigate({ to: crumb.path })}
                className="flex items-center hover:text-gray-700 transition-colors duration-200"
              >
                {crumb.label}
              </button>
            )}
          </div>
          {!crumb.isLast && (
            <ButtonIcon className="text-gray-400" props={{ disabled: true }}>
              <IconChevronRight />
            </ButtonIcon>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
