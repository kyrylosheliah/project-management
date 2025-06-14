import { BadgeIcon } from "../../components/ui/BadgeIcon";
import type { User } from "./User.type";

export const UserBadge = (e: User) => {
  return BadgeIcon({
    children: e.name,
    icon: (
      <svg
        className="w-full h-full"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeWidth="2"
          d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    ),
    props: {},
  });
};