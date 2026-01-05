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
  layout("routes/dashboard/dashboard-layout.tsx", [
    route("dashboard", "routes/dashboard/index.tsx"),
    route("profile", "routes/profile.tsx"),
  ]),
  route("/profile", "routes/profile.tsx"),
] satisfies RouteConfig;
