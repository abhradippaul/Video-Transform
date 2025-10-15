import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useS3PutUrl() {
  return useMutation({
    mutationFn: ({ mime, type }: { mime: string; type: string }) => {
      return axios.post(`${BACKEND_URL}/video/put-presigned-url`, {
        mime,
        type,
      });
    },
  });
}
