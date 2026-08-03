import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AIResponse, ChatMessage, FSItem, KVItem, PuterChatOptions, PuterUser } from "~/types/puter";

const getPuter = () => (typeof window !== "undefined" && window.puter ? window.puter : null);

export const usePuterStore = defineStore("puter", () => {
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const puterReady = ref(false);
  const user = ref<PuterUser | null>(null);

  const isAuthenticated = computed(() => user.value !== null);

  function setError(message: string) {
    error.value = message;
    isLoading.value = false;
    user.value = null;
  }

  function clearError() {
    error.value = null;
  }

  /** Returns the global Puter SDK, or records an error and returns null if it isn't loaded yet. */
  function requirePuter() {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return null;
    }
    return puter;
  }

  async function checkAuthStatus(): Promise<boolean> {
    const puter = requirePuter();
    if (!puter) return false;

    isLoading.value = true;
    error.value = null;

    try {
      const signedIn = await puter.auth.isSignedIn();
      user.value = signedIn ? await puter.auth.getUser() : null;
      isLoading.value = false;
      return signedIn;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check auth status");
      return false;
    }
  }

  async function signIn(): Promise<void> {
    const puter = requirePuter();
    if (!puter) return;

    isLoading.value = true;
    error.value = null;

    try {
      await puter.auth.signIn();
      await checkAuthStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  }

  async function signOut(): Promise<void> {
    const puter = requirePuter();
    if (!puter) return;

    isLoading.value = true;
    error.value = null;

    try {
      await puter.auth.signOut();
      user.value = null;
      isLoading.value = false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
    }
  }

  async function refreshUser(): Promise<void> {
    const puter = requirePuter();
    if (!puter) return;

    isLoading.value = true;
    error.value = null;

    try {
      user.value = await puter.auth.getUser();
      isLoading.value = false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh user");
    }
  }

  function init(): void {
    if (getPuter()) {
      puterReady.value = true;
      checkAuthStatus();
      return;
    }

    const interval = setInterval(() => {
      if (getPuter()) {
        clearInterval(interval);
        puterReady.value = true;
        checkAuthStatus();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      if (!getPuter()) {
        setError("Puter.js failed to load within 10 seconds");
      }
    }, 10000);
  }

  const fs = {
    async write(path: string, data: string | File | Blob) {
      const puter = requirePuter();
      return puter ? puter.fs.write(path, data) : undefined;
    },
    async read(path: string) {
      const puter = requirePuter();
      return puter ? puter.fs.read(path) : undefined;
    },
    async upload(files: File[] | Blob[]): Promise<FSItem | undefined> {
      const puter = requirePuter();
      return puter ? puter.fs.upload(files) : undefined;
    },
    async delete(path: string) {
      const puter = requirePuter();
      return puter ? puter.fs.delete(path) : undefined;
    },
    async readDir(path: string): Promise<FSItem[] | undefined> {
      const puter = requirePuter();
      return puter ? puter.fs.readdir(path) : undefined;
    },
  };

  const ai = {
    async chat(
      prompt: string | ChatMessage[],
      imageURL?: string | PuterChatOptions,
      testMode?: boolean,
      options?: PuterChatOptions,
    ): Promise<AIResponse | undefined> {
      const puter = requirePuter();
      return puter ? puter.ai.chat(prompt, imageURL, testMode, options) : undefined;
    },
    /** Sends an already-uploaded resume (by Puter FS path) to Claude Haiku 4.5 for ATS feedback. */
    async feedback(path: string, message: string): Promise<AIResponse | undefined> {
      const puter = requirePuter();
      if (!puter) return undefined;
      return puter.ai.chat(
        [
          {
            role: "user",
            content: [
              { type: "file", puter_path: path },
              { type: "text", text: message },
            ],
          },
        ],
        // Cheapest current Anthropic model for early testing — Puter model
        // IDs change as Anthropic retires older ones, so if this starts
        // failing with "Model not found", check https://developer.puter.com/ai/models/
        { model: "claude-haiku-4-5" },
      );
    },
    async img2txt(image: string | File | Blob, testMode?: boolean) {
      const puter = requirePuter();
      return puter ? puter.ai.img2txt(image, testMode) : undefined;
    },
  };

  const kv = {
    async get(key: string) {
      const puter = requirePuter();
      return puter ? puter.kv.get(key) : undefined;
    },
    async set(key: string, value: string) {
      const puter = requirePuter();
      return puter ? puter.kv.set(key, value) : undefined;
    },
    async delete(key: string) {
      const puter = requirePuter();
      return puter ? puter.kv.delete(key) : undefined;
    },
    async list(pattern: string, returnValues = false): Promise<string[] | KVItem[] | undefined> {
      const puter = requirePuter();
      return puter ? puter.kv.list(pattern, returnValues) : undefined;
    },
    async flush() {
      const puter = requirePuter();
      return puter ? puter.kv.flush() : undefined;
    },
  };

  return {
    isLoading,
    error,
    puterReady,
    user,
    isAuthenticated,
    signIn,
    signOut,
    refreshUser,
    checkAuthStatus,
    init,
    clearError,
    fs,
    ai,
    kv,
  };
});
