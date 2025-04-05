import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from "@/components/ui/button";

export default function PreRepeter() {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles);
  }, []);

  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });

    try {
      const res = await axios.post("https://prerepeter-backend.onrender.com/upload/", formData, {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'repeated_questions.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please check backend connection or file format.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="p-4">
      <div {...getRootProps()} className="border-dashed border-2 border-gray-500 p-4 cursor-pointer">
        <input {...getInputProps()} />
        <p>Drag & drop PDFs here, or click to select</p>
      </div>
      <ul>
        {files.map(file => (
          <li key={file.path}>{file.path}</li>
        ))}
      </ul>
      <Button onClick={uploadFiles} className="mt-4">Upload</Button>
    </div>
  );
}
