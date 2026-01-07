import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/auth/auth-layout.tsx", [
    route("/sign-in", "routes/auth/sign-in.tsx"),
  ]),
  layout("routes/private-layout.tsx", [
    route("dashboard", "routes/dashboard/index.tsx"),
    route("profile", "routes/profile/profile.tsx"),
    route("profile/edit", "routes/profile/edit.tsx"),
    route("logbook", "routes/logbook/index.tsx"),
    route("mitra", "routes/mitra/index.tsx"),
  ]),
] satisfies RouteConfig;
