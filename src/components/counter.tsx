"use client";

import { useEffect, useState } from "react";

export const Counter = () => {
  const [raw, error, loading] = useGetClipboard();
  if (loading) return <></>;

  const res = error ? "😢" : raw ? raw.length : 0;

  return (
    <>
      <title>{res}</title>
      <h1 className="text-white font-extrabold text-9xl select-none scale-150">
        {res}
      </h1>
    </>
  );
};

function useGetClipboard() {
  const [text, setText] = useState<string | undefined>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const getClipboardText = async () => {
    try {
      const value = await navigator.clipboard.readText().then((value) => {
        setLoading(false);
        return value;
      });
      setText(value);
      setError(false);
    } catch (error) {
      if (error instanceof DOMException) return;
      setError(true);
    }
  };

  const listenClipboardChange = (event: Event) => {
    console.log("hello");
    const state = (event.target as PermissionStatus).state;
    if (state === "granted") getClipboardText();
    else setError(true);
  };

  const listenVisibility = () => {
    if (document.visibilityState === "visible") getClipboardText();
  };

  useEffect(() => {
    (async () => {
      getClipboardText();
    })();

    let permission: PermissionStatus | undefined = undefined;
    navigator.permissions
      .query({
        // @ts-expect-error
        name: "clipboard-read",
        allowWithoutGesture: false,
      })
      .then((perm) => {
        permission = perm;
        permission.addEventListener("change", listenClipboardChange);
      });

    document.addEventListener("visibilitychange", listenVisibility);

    return () => {
      if (permission)
        permission.removeEventListener("change", listenClipboardChange);
      document.removeEventListener("visibilitychange", listenVisibility);
    };
  }, []);

  return [text, error, loading] as const;
}
