const LS_KEY = "iamthelaw_plan";

export type Plan = "free" | "pro";

export function usePlan() {
  const plan = (localStorage.getItem(LS_KEY) as Plan | null) ?? "free";
  const isPro = plan === "pro";

  const setPlan = (newPlan: Plan) => {
    localStorage.setItem(LS_KEY, newPlan);
    // Force re-render by dispatching a storage event (cross-tab sync)
    window.dispatchEvent(
      new StorageEvent("storage", { key: LS_KEY, newValue: newPlan }),
    );
  };

  return { plan, isPro, setPlan };
}
