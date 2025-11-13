# React Router

## Configuring Routes

Routes are configured in `app/routes.ts`. Each route has two required parts: a URL pattern to match the URL, and a file path to the route module that defines its behavior.

```ts filename=app/routes.ts
import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("some/path", "./some/file.tsx"),
  // pattern ^           ^ module file
] satisfies RouteConfig;
```

Here is a larger sample route config:

```ts filename=app/routes.ts
import { type RouteConfig, route, index, layout, prefix } from "@react-router/dev/routes";

export default [
  index("./home.tsx"),
  route("about", "./about.tsx"),

  layout("./auth/layout.tsx", [route("login", "./auth/login.tsx"), route("register", "./auth/register.tsx")]),

  ...prefix("concerts", [
    index("./concerts/home.tsx"),
    route(":city", "./concerts/city.tsx"),
    route("trending", "./concerts/trending.tsx"),
  ]),
] satisfies RouteConfig;
```

If you prefer to define your routes via file naming conventions rather than configuration, the `@react-router/fs-routes` package provides a [file system routing convention][file-route-conventions]. You can even combine different routing conventions if you like:

```ts filename=app/routes.ts
import { type RouteConfig, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [route("/", "./home.tsx"), ...(await flatRoutes())] satisfies RouteConfig;
```

## Route Modules

The files referenced in `routes.ts` define each route's behavior:

```tsx filename=app/routes.ts
route("teams/:teamId", "./team.tsx"),
//           route module ^^^^^^^^
```

Here's a sample route module:

```tsx filename=app/team.tsx
// provides type safety/inference
import type { Route } from "./+types/team";

// provides `loaderData` to the component
export async function loader({ params }: Route.LoaderArgs) {
  let team = await fetchTeam(params.teamId);
  return { name: team.name };
}

// renders after the loader is done
export default function Component({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}
```

Route modules have more features like actions, headers, and error boundaries, but they will be covered in the next guide: [Route Modules](./route-module)

## Nested Routes

Routes can be nested inside parent routes.

```ts filename=app/routes.ts
import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  // parent route
  route("dashboard", "./dashboard.tsx", [
    // child routes
    index("./home.tsx"),
    route("settings", "./settings.tsx"),
  ]),
] satisfies RouteConfig;
```

The path of the parent is automatically included in the child, so this config creates both `"/dashboard"` and `"/dashboard/settings"` URLs.

Child routes are rendered through the `<Outlet/>` in the parent route.

```tsx filename=app/dashboard.tsx
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* will either be home.tsx or settings.tsx */}
      <Outlet />
    </div>
  );
}
```

## Root Route

Every route in `routes.ts` is nested inside the special `app/root.tsx` module.

## Layout Routes

Using `layout`, layout routes create new nesting for their children, but they don't add any segments to the URL. It's like the root route but they can be added at any level.

```tsx filename=app/routes.ts lines=[10,16]
import { type RouteConfig, route, layout, index, prefix } from "@react-router/dev/routes";

export default [
  layout("./marketing/layout.tsx", [index("./marketing/home.tsx"), route("contact", "./marketing/contact.tsx")]),
  ...prefix("projects", [
    index("./projects/home.tsx"),
    layout("./projects/project-layout.tsx", [
      route(":pid", "./projects/project.tsx"),
      route(":pid/edit", "./projects/edit-project.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
```

Note that:

- `home.tsx` and `contact.tsx` will be rendered into the `marketing/layout.tsx` outlet without creating any new URL paths
- `project.tsx` and `edit-project.tsx` will be rendered into the `projects/project-layout.tsx` outlet at `/projects/:pid` and `/projects/:pid/edit` while `projects/home.tsx` will not.

## Index Routes

```ts
index(componentFile),
```

Index routes render into their parent's [Outlet][outlet] at their parent's URL (like a default child route).

```ts filename=app/routes.ts
import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  // renders into the root.tsx Outlet at /
  index("./home.tsx"),
  route("dashboard", "./dashboard.tsx", [
    // renders into the dashboard.tsx Outlet at /dashboard
    index("./dashboard-home.tsx"),
    route("settings", "./dashboard-settings.tsx"),
  ]),
] satisfies RouteConfig;
```

Note that index routes can't have children.

## Route Prefixes

Using `prefix`, you can add a path prefix to a set of routes without needing to introduce a parent route file.

```tsx filename=app/routes.ts lines=[14]
import { type RouteConfig, route, layout, index, prefix } from "@react-router/dev/routes";

export default [
  layout("./marketing/layout.tsx", [index("./marketing/home.tsx"), route("contact", "./marketing/contact.tsx")]),
  ...prefix("projects", [
    index("./projects/home.tsx"),
    layout("./projects/project-layout.tsx", [
      route(":pid", "./projects/project.tsx"),
      route(":pid/edit", "./projects/edit-project.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
```

## Dynamic Segments

If a path segment starts with `:` then it becomes a "dynamic segment". When the route matches the URL, the dynamic segment will be parsed from the URL and provided as `params` to other router APIs.

```ts filename=app/routes.ts
route("teams/:teamId", "./team.tsx"),
```

```tsx filename=app/team.tsx
import type { Route } from "./+types/team";

export async function loader({ params }: Route.LoaderArgs) {
  //                           ^? { teamId: string }
}

export default function Component({ params }: Route.ComponentProps) {
  params.teamId;
  //        ^ string
}
```

You can have multiple dynamic segments in one route path:

```ts filename=app/routes.ts
route("c/:categoryId/p/:productId", "./product.tsx"),
```

```tsx filename=app/product.tsx
import type { Route } from "./+types/product";

async function loader({ params }: LoaderArgs) {
  //                    ^? { categoryId: string; productId: string }
}
```

## Optional Segments

You can make a route segment optional by adding a `?` to the end of the segment.

```ts filename=app/routes.ts
route(":lang?/categories", "./categories.tsx"),
```

You can have optional static segments, too:

```ts filename=app/routes.ts
route("users/:userId/edit?", "./user.tsx");
```

## Splats

Also known as "catchall" and "star" segments. If a route path pattern ends with `/*` then it will match any characters following the `/`, including other `/` characters.

```ts filename=app/routes.ts
route("files/*", "./files.tsx"),
```

```tsx filename=app/files.tsx
export async function loader({ params }: Route.LoaderArgs) {
  // params["*"] will contain the remaining URL after files/
}
```

You can destructure the `*`, you just have to assign it a new name. A common name is `splat`:

```tsx
const { "*": splat } = params;
```

## Navigating

Users navigate your application with `<Link>`, `<NavLink>`, `<Form>`, `redirect`, and `useNavigate`.

## NavLink

This component is for navigation links that need to render active and pending states.

```tsx
import { NavLink } from "react-router";

export function MyAppNav() {
  return (
    <nav>
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/trending" end>
        Trending Concerts
      </NavLink>
      <NavLink to="/concerts">All Concerts</NavLink>
      <NavLink to="/account">Account</NavLink>
    </nav>
  );
}
```

`NavLink` renders default class names for different states for easy styling with CSS:

```css
a.active {
  color: red;
}

a.pending {
  animate: pulse 1s infinite;
}

a.transitioning {
  /* css transition is running */
}
```

It also has callback props on `className`, `style`, and `children` with the states for inline styling or conditional rendering:

```tsx
// className
<NavLink
  to="/messages"
  className={({ isActive, isPending, isTransitioning }) =>
    [isPending ? "pending" : "", isActive ? "active" : "", isTransitioning ? "transitioning" : ""].join(" ")
  }
>
  Messages
</NavLink>
```

```tsx
// style
<NavLink
  to="/messages"
  style={({ isActive, isPending, isTransitioning }) => {
    return {
      fontWeight: isActive ? "bold" : "",
      color: isPending ? "red" : "black",
      viewTransitionName: isTransitioning ? "slide" : "",
    };
  }}
>
  Messages
</NavLink>
```

```tsx
// children
<NavLink to="/tasks">
  {({ isActive, isPending, isTransitioning }) => <span className={isActive ? "active" : ""}>Tasks</span>}
</NavLink>
```

## Link

Use `<Link>` when the link doesn't need active styling:

```tsx
import { Link } from "react-router";

export function LoggedOutMessage() {
  return (
    <p>
      You've been logged out. <Link to="/login">Login again</Link>
    </p>
  );
}
```

## Form

The form component can be used to navigate with `URLSearchParams` provided by the user.

```tsx
<Form action="/search">
  <input type="text" name="q" />
</Form>
```

If the user enters "journey" into the input and submits it, they will navigate to:

```
/search?q=journey
```

Forms with `<Form method="post" />` will also navigate to the action prop but will submit the data as `FormData` instead of `URLSearchParams`. However, it is more common to `useFetcher()` to POST form data.

## Form Actions and Data

When forms submit with method="post", the action function receives the form data and can return data back to the component via useActionData.

```tsx
import { Form, useActionData } from "react-router";
import type { Route } from "./+types/contact";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("visitorsName");

  // Validate and process the data
  if (!name) {
    return { error: "Name is required" };
  }

  return { message: `Hello, ${name}!` };
}

export default function Contact({}: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <input type="text" name="visitorsName" />
      <button type="submit">Submit</button>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      {actionData?.message && <p>{actionData.message}</p>}
    </Form>
  );
}
```

The action data persists until the next action is submitted. For non-navigating form submissions (like adding items to a list without leaving the page), use useFetcher() instead.

## redirect

Inside of route loaders and actions, you can return a `redirect` to another URL.

```tsx
import { redirect } from "react-router";

export async function loader({ request }) {
  let user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }
  return { userName: user.name };
}
```

It is common to redirect to a new record after it has been created:

```tsx
import { redirect } from "react-router";

export async function action({ request }) {
  let formData = await request.formData();
  let project = await createProject(formData);
  return redirect(`/projects/$\{project.id}`);
}
```

## useNavigate

This hook allows the programmer to navigate the user to a new page without the user interacting. Usage of this hook should be uncommon. It's recommended to use the other APIs in this guide when possible.

Reserve usage of `useNavigate` to situations where the user is _not_ interacting but you need to navigate, for example:

- Logging them out after inactivity
- Timed UIs like quizzes, etc.

```tsx
import { useNavigate } from "react-router";

export function useLogoutAfterInactivity() {
  let navigate = useNavigate();

  useFakeInactivityHook(() => {
    navigate("/logout");
  });
}
```
