import { useEffect, useRef, type ReactNode } from "react";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  Show,
  useClerk,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  Router as WouterRouter,
} from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrentArtistProvider } from "@/lib/current-artist";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/welcome";
import Dashboard from "@/pages/dashboard";
import SongsPage from "@/pages/songs";
import SubmitSongPage from "@/pages/submit-song";
import SongDetailPage from "@/pages/song-detail";
import WallPage from "@/pages/wall";
import ArtistsPage from "@/pages/artists";
import SettingsPage from "@/pages/settings";

// REQUIRED — copy verbatim. Resolves the key from window.location.hostname so the
// same build serves multiple Clerk custom domains.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — copy verbatim. Empty in dev, auto-set in prod.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// Clerk passes full paths to routerPush/routerReplace, but wouter's
// setLocation prepends the base — strip it to avoid doubling.
function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    // Clicking the Pulzz logo on the sign-in/sign-up pages returns to the
    // public landing page (separate artifact mounted at the origin root),
    // not the artist app home at basePath.
    logoLinkUrl: "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(6 100% 64%)",
    colorForeground: "hsl(221 45% 20%)",
    colorMutedForeground: "hsl(220 22% 40%)",
    colorDanger: "hsl(0 72% 51%)",
    colorBackground: "hsl(40 60% 99%)",
    colorInput: "hsl(40 60% 99%)",
    colorInputForeground: "hsl(221 45% 20%)",
    colorNeutral: "hsl(36 30% 87%)",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    borderRadius: "0.875rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox:
      "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden border border-border shadow-sm",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-foreground",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-foreground",
    formFieldLabel: "text-foreground",
    footerActionLink: "text-primary hover:text-primary/90",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-muted-foreground",
    alertText: "text-foreground",
    logoBox: "h-8",
    logoImage: "h-8 w-auto",
    socialButtonsBlockButton:
      "border border-border bg-card hover:bg-secondary",
    formButtonPrimary:
      "bg-primary text-primary-foreground hover:bg-primary/90",
    formFieldInput: "bg-card border border-border text-foreground",
    footerAction: "text-muted-foreground",
    dividerLine: "bg-border",
    alert: "border border-border bg-card",
    otpCodeFieldInput: "border border-border text-foreground",
    formFieldRow: "",
    main: "",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
      />
    </div>
  );
}

// Renders the public welcome page for signed-out users and redirects
// signed-in artists straight into their dashboard.
function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <Welcome />
      </Show>
    </>
  );
}

// Guards an authenticated route: signed-in artists get the page (scoped to
// their own profile via CurrentArtistProvider), signed-out users go home.
function RequireAuth({ children }: { children: ReactNode }) {
  return (
    <>
      <Show when="signed-in">
        <CurrentArtistProvider>{children}</CurrentArtistProvider>
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

// Invalidates cached queries when the signed-in user changes so one artist
// never sees another's cached data.
function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={HomeRedirect} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/dashboard">
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      </Route>
      <Route path="/songs/new">
        <RequireAuth>
          <SubmitSongPage />
        </RequireAuth>
      </Route>
      <Route path="/songs/:id">
        {(params) => (
          <RequireAuth>
            <SongDetailPage id={params.id} />
          </RequireAuth>
        )}
      </Route>
      <Route path="/songs">
        <RequireAuth>
          <SongsPage />
        </RequireAuth>
      </Route>
      <Route path="/artists">
        <RequireAuth>
          <ArtistsPage />
        </RequireAuth>
      </Route>
      <Route path="/wall">
        <RequireAuth>
          <WallPage />
        </RequireAuth>
      </Route>
      <Route path="/settings">
        <RequireAuth>
          <SettingsPage />
        </RequireAuth>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your Pulzz artist account",
          },
        },
        signUp: {
          start: {
            title: "Create your account",
            subtitle: "Start sharing your unreleased music",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <AppRouter />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
