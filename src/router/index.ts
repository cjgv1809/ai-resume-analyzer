import { createRouter, createWebHistory } from "vue-router";
import { watch } from "vue";
import { usePuterStore } from "~/stores/puter";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("~/views/Home.vue"),
      meta: { title: "Resumind" },
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("~/views/Auth.vue"),
      meta: { title: "Resumind | Auth", public: true },
    },
    {
      path: "/upload",
      name: "upload",
      component: () => import("~/views/Upload.vue"),
      meta: { title: "Resumind | Upload" },
    },
    {
      path: "/resume/:id",
      name: "resume",
      component: () => import("~/views/Resume.vue"),
      meta: { title: "Resumind | Review" },
    },
    // Dev-only data-wipe utility. `import.meta.env.DEV` is statically false in
    // production builds, so Rollup dead-code-eliminates this branch — the
    // route (and the Wipe.vue chunk it pulls in) never ships to prod at all.
    ...(import.meta.env.DEV
      ? [
          {
            path: "/wipe",
            name: "wipe",
            component: () => import("~/views/Wipe.vue"),
            meta: { title: "Resumind | Wipe" },
          },
        ]
      : []),
    // Catch-all: any unmatched path (including /wipe in production) bounces home.
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

/** Waits for the Puter store's initial auth check (kicked off in main.ts) to settle. */
function waitForAuthReady(store: ReturnType<typeof usePuterStore>): Promise<void> {
  if (!store.isLoading) return Promise.resolve();
  return new Promise((resolve) => {
    const stop = watch(
      () => store.isLoading,
      (loading) => {
        if (!loading) {
          stop();
          resolve();
        }
      },
    );
  });
}

router.beforeEach(async (to) => {
  document.title = (to.meta.title as string) ?? "Resumind";

  if (to.meta.public) return true;

  const store = usePuterStore();
  await waitForAuthReady(store);

  if (!store.isAuthenticated) {
    return { path: "/auth", query: { next: to.fullPath } };
  }

  return true;
});

export default router;
