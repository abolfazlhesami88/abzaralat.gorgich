import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { ENDPOINTS } from '../api/endpoints';

export const useNotifications = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.NOTIFICATIONS.LIST);
      return data.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 60_000,
  });
};

export const useNotificationCount = () => {
  const { data } = useNotifications();
  return { unreadCount: (data as any)?.unreadCount ?? 0 };
};

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => apiClient.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

/** هوک mark-read برای یک نوتیفیکیشن خاص */
export const useMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      apiClient.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};
