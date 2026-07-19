import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  });
};

export const useUpdateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
      addressesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addressesApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
};

export const useSetDefaultAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addressesApi.setDefault,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
};
