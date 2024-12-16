"use client";
import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

interface CrawlFormProps {
  onCrawl: (url: string) => void;
  loading: boolean;
  error: string | null;
}

const CrawlForm: React.FC<CrawlFormProps> = ({ onCrawl, loading, error }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCrawl(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Nhập URL của nhà hàng trên Grab Food"
          className="flex-1 h-14"
          error={error || ''}
          required
        />
        <Button
          type="submit"
          isLoading={loading}
          variant="primary"
          className="sm:w-auto whitespace-nowrap h-14"
        >
          Lấy Menu 
        </Button>
      </div>
    </form>
  );
};

export default CrawlForm; 