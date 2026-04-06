import { useMutation } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface ShoppingItem {
  name: string;
  description: string;
  amount: number;
  quantity: number;
}

export type CheckoutSession = { id: string; url: string };

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");

      // Check if createCheckoutSession exists on the actor
      const actorAny = actor as unknown as Record<string, unknown>;
      if (typeof actorAny.createCheckoutSession !== "function") {
        throw new Error(
          "Stripe payments are not yet configured on this deployment. Please contact the administrator to enable payments.",
        );
      }

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await (
        actorAny.createCheckoutSession as (
          items: ShoppingItem[],
          successUrl: string,
          cancelUrl: string,
        ) => Promise<string>
      )(items, successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) throw new Error("Stripe session missing url");
      return session;
    },
  });
}
