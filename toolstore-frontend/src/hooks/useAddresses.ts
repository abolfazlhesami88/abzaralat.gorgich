import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { addressesApi } from '../api/addresses.api';
import type { Address } from '../api/addresses.api';

export const useAddresses = () =>
  useQuery({
    queryKey: ['addresses'],
    queryFn: addressesApi.getAll,
  });

export const useCreateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addressesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'خطا در افزودن آدرس';
      toast.error(typeof msg === 'string' ? msg : Array.isArray(msg) ? msg.join(' - ') : 'خطا در افزودن آدرس');
    },
  });
};

export const useUpdateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
      addressesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'خطا در به‌روزرسانی آدرس';
      toast.error(typeof msg === 'string' ? msg : Array.isArray(msg) ? msg.join(' - ') : 'خطا در به‌روزرسانی آدرس');
    },
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addressesApi.remove,
    onSuccess: () => {
      toast.success('آدرس با موفقیت حذف شد');
      qc.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'خطا در حذف آدرس';
      toast.error(typeof msg === 'string' ? msg : Array.isArray(msg) ? msg.join(' - ') : 'خطا در حذف آدرس');
    },
  });
};

export const useSetDefaultAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addressesApi.setDefault,
    onSuccess: () => {
      toast.success('آدرس پیش‌فرض به‌روزرسانی شد');
      qc.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'خطا در تغییر آدرس پیش‌فرض';
      toast.error(typeof msg === 'string' ? msg : Array.isArray(msg) ? msg.join(' - ') : 'خطا در تغییر آدرس پیش‌فرض');
    },
  });
};
