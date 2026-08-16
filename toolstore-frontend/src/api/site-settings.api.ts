import { apiClient } from './client';

export const siteSettingsApi = {
  getSettings: async (): Promise<Record<string, string>> => {
    const { data } = await apiClient.get('/site-settings');
    return data.data;
  },
  uploadHeroImage: async (file: File): Promise<{ hero_image_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post('/site-settings/admin/hero-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
  resetHeroImage: async (): Promise<{ hero_image_url: string }> => {
    const { data } = await apiClient.post('/site-settings/admin/hero-image/reset');
    return data.data;
  },
};
