<script setup lang="ts">
import { watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePuterStore } from "~/stores/puter";
import { storeToRefs } from "pinia";

const store = usePuterStore();
const { isLoading, isAuthenticated } = storeToRefs(store);
const route = useRoute();
const router = useRouter();

const next = () => (route.query.next as string) || "/";

watchEffect(() => {
  if (isAuthenticated.value) router.replace(next());
});
</script>

<template>
  <main class="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
    <div class="gradient-border shadow-lg animate-in fade-in zoom-in-95 duration-500">
      <section class="flex flex-col gap-8 bg-white rounded-2xl p-10">
        <div class="flex flex-col items-center gap-2 text-center">
          <p class="text-sm font-bold tracking-widest text-gradient uppercase">Resumind</p>
          <h1>Welcome</h1>
          <h2>Log In to Continue Your Job Journey</h2>
        </div>
        <div>
          <button v-if="isLoading" class="auth-button animate-pulse">
            <p>Signing you in...</p>
          </button>
          <template v-else>
            <button v-if="isAuthenticated" class="auth-button" @click="store.signOut">
              <p>Log Out</p>
            </button>
            <button v-else class="auth-button" @click="store.signIn">
              <p>Log In</p>
            </button>
          </template>
        </div>
      </section>
    </div>
  </main>
</template>
