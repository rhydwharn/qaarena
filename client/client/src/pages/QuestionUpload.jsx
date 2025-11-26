import { useState, useEffect } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import axios from 'axios';

const QuestionUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await axios.get(
        `${apiUrl}/questions-upload/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(selectedFile.type) && 
        !selectedFile.name.endsWith('.xlsx') && 
        !selectedFile.name.endsWith('.xls')) {
      alert('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await axios.post(
        `${apiUrl}/questions-upload/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUploadResult(response.data.data);
      setFile(null);
      fetchStats(); // Refresh stats after upload
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        total: 0,
        successful: 0,
        failed: 0,
        errors: [{
          row: 0,
          error: error.response?.data?.message || 'Upload failed. Please try again.'
        }]
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      console.log('Downloading template from:', `${apiUrl}/questions-upload/template`);
      
      const response = await axios.get(
        `${apiUrl}/questions-upload/template`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      console.log('Response received:', response);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'questions_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      console.error('Error response:', error.response);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to download template';
      alert(`Error: ${errorMsg}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Upload</h1>
        <p className="text-gray-600">Upload questions in bulk using an Excel spreadsheet</p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                </div>
                <XCircle className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.byCategory?.length || 0}</p>
                </div>
                <FileSpreadsheet className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  {file ? file.name : 'Drag and drop your Excel file here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Select File</span>
                  </Button>
                </label>
                {file && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
                size="lg"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Questions
                  </>
                )}
              </Button>

              {/* Download Template */}
              <Button
                onClick={handleDownloadTemplate}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Excel Template
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions & Results */}
        <div className="space-y-6">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Download the Excel template using the button below</li>
                <li>Fill in your questions following the template format</li>
                <li>Required fields: question, optionA, optionB, correctAnswer, category</li>
                <li>Each option has its own column: optionA, optionB, optionC, optionD (up to optionF)</li>
                <li>Correct answer should be the index (0 for optionA, 1 for optionB, etc.)</li>
                <li>Category: Any text value (e.g., "fundamentals", "javascript", "security") - will be auto-lowercased</li>
                <li>Difficulty: foundation (default), advanced, expert</li>
                <li>Type: single-choice (default), multiple-choice, true-false</li>
                <li>Status: published (default), draft, archived, flagged</li>
                <li>Save and upload your Excel file</li>
              </ol>
            </CardContent>
          </Card>

          {/* Upload Results */}
          {uploadResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {uploadResult.successful > 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  Upload Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{uploadResult.total}</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{uploadResult.successful}</p>
                    <p className="text-sm text-gray-600">Success</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{uploadResult.failed}</p>
                    <p className="text-sm text-gray-600">Failed</p>
                  </div>
                </div>

                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-red-600 mb-2">Errors:</p>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {uploadResult.errors.map((error, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                          <p className="font-semibold">Row {error.row}:</p>
                          <p className="text-red-700">{error.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      {stats && stats.byCategory && stats.byCategory.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Questions by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.byCategory.map((cat) => (
                <div key={cat._id} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 capitalize">{cat._id}</p>
                  <p className="text-2xl font-bold text-gray-900">{cat.count}</p>
                  <p className="text-xs text-gray-500">Avg: {cat.avgPoints?.toFixed(1) || 0} pts</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionUpload;
