import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface VoteFormProps {
  onSubmit: (data: { title: string; description: string }) => void;
  isLoading?: boolean;
}

const VoteForm: React.FC<VoteFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    description: ''
  });

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: ''
    };
    
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-4">
        <Input
          label="Tiêu đề cuộc bình chọn"
          placeholder="Nhập tiêu đề cho cuộc bình chọn"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          error={errors.title}
        />
        
        <Input
          label="Mô tả (tùy chọn)"
          placeholder="Thêm mô tả cho cuộc bình chọn"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          error={errors.description}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          Tạo cuộc bình chọn
        </Button>
      </div>
    </form>
  );
};

export default VoteForm; 