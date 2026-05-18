"use client";
import { useState, useEffect } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastState: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

function notify() {
  listeners.forEach((l) => l([...toastState]));
}

export function toast(opts: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  toastState = [...toastState, { id, ...opts }];
  notify();
  setTimeout(() => {
    toastState = toastState.filter((t) => t.id !== id);
    notify();
  }, 4000);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastState);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  return { toasts, toast };
}
