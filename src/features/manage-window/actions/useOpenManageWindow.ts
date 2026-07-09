import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/shared/store/toastStore";

import { openManageWindow } from "../services/manageWindowService";

export function useOpenManageWindow() {
  const { addToast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: openManageWindow,
    onError: (err) => addToast({ message: err.message, variant: "error" }),
  });

  return { openManageWindow: () => mutate(), loading: isPending };
}
