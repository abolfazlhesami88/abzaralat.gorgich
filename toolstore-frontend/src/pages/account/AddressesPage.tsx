import { useState } from 'react';
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from '../../hooks/useAddresses';
import { MapPin, Edit2, Trash2, Plus, Star } from 'lucide-react';
import { AddressForm } from '../../components/account/AddressForm';
import { cn } from '../../utils/cn';

export function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) return <div className="text-center py-12 text-text-muted">در حال بارگذاری...</div>;

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-h2 text-text-primary">آدرس‌های من</h1>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-text-primary font-semibold px-4 py-2 rounded-button transition-colors text-sm"
          >
            <Plus size={16} />
            آدرس جدید
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-white border border-border rounded-card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">{editingId ? 'ویرایش آدرس' : 'ثبت آدرس جدید'}</h2>
          <AddressForm 
            addressId={editingId} 
            onSuccess={handleCloseForm}
            onCancel={handleCloseForm}
          />
        </div>
      ) : null}

      {!addresses?.length ? (
        !isFormOpen && (
          <div className="text-center py-16 bg-white border border-border rounded-card">
            <MapPin size={48} className="mx-auto text-border mb-4" />
            <h2 className="font-semibold text-text-primary mb-2">هنوز آدرسی ثبت نکرده‌اید</h2>
            <p className="text-sm text-text-secondary">برای ثبت سفارش به حداقل یک آدرس نیاز دارید</p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className={cn(
              "p-5 rounded-card border transition-colors relative",
              address.isDefault ? "border-gold bg-gold-light/10" : "border-border bg-white hover:border-gold/50"
            )}>
              {address.isDefault && (
                <span className="absolute top-4 left-4 text-xs font-semibold bg-gold text-text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star size={12} className="fill-current" /> پیش‌فرض
                </span>
              )}
              
              <div className="flex items-start gap-3 mb-3 pr-16">
                <MapPin className="text-gold mt-1 shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-text-primary">{address.label || address.fullName}</h3>
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                    {address.province}، {address.city}، {address.addressLine}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-text-secondary space-y-1 pr-9 mb-4">
                <p>گیرنده: {address.fullName}</p>
                <p>تلفن: {address.phone}</p>
                <p>کد پستی: {address.postalCode}</p>
              </div>

              <div className="flex items-center gap-3 pr-9 pt-4 border-t border-border/50">
                <button
                  onClick={() => handleEdit(address.id)}
                  className="text-text-secondary hover:text-gold-dark text-sm flex items-center gap-1 transition-colors"
                >
                  <Edit2 size={14} /> ویرایش
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
                      deleteAddress.mutate(address.id);
                    }
                  }}
                  className="text-text-secondary hover:text-danger text-sm flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={14} /> حذف
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => setDefaultAddress.mutate(address.id)}
                    className="mr-auto text-gold-dark text-sm font-semibold hover:underline"
                  >
                    تنظیم به عنوان پیش‌فرض
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
