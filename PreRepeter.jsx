import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDropzone } from 'react-dropzone';

export default function PreRepeter() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docUrl, setDocUrl] = useState(null);
  const [yearFilter, setYearFilter] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setDocUrl(null);
    extractYears(acceptedFiles);
  };

  const extractYears = (fileList) => {
    const yearRegex = /(20\d{2})/g;
    const years = new Set();
    fileList.forEach(file => {
      const match = file.name.match(yearRegex);
      if (match) years.add(match[0]);
    });
    setAvailableYears([...years]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('year', yearFilter);

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDocUrl(url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'application/pdf' });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">preRepeter 🧠</h1>
      <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg bg-white cursor-pointer">
        <input {...getInputProps()} />
        <p>Drag & drop PDFs here, or click to select files</p>
      </div>
      {availableYears.length > 0 && (
        <select className="mt-4 p-2 border rounded" onChange={(e) => setYearFilter(e.target.value)}>
          <option value="">Filter by Year</option>
          {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      )}
      <Button onClick={handleUpload} disabled={loading || files.length === 0} className="mt-4">
        {loading ? 'Processing...' : 'Find Repeated Questions'}
      </Button>
      {docUrl && (
        <a href={docUrl} download="repeated_questions.docx" className="mt-6 text-blue-600 underline">
          Download Result (.docx)
        </a>
      )}
    </div>
  );
}