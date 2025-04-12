
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileText, X, AlertCircle, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const reportTypes = [
  "Blood Test", "X-Ray", "MRI", "CT Scan", "Ultrasound", "ECG", "Pathology", "Other"
];

interface UploadedFile {
  name: string;
  size: number;
  created_at?: string;
  id?: string;
  path?: string;
}

const MedicalReportUpload: React.FC = () => {
  const [reportType, setReportType] = useState<string>("");
  const [reportDate, setReportDate] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchingFiles, setFetchingFiles] = useState(true);
  const [activeTab, setActiveTab] = useState("upload");
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user's uploaded files
  useEffect(() => {
    const fetchFiles = async () => {
      if (!user?.id) return;
      
      setFetchingFiles(true);
      try {
        let { data: files, error } = await supabase
          .storage
          .from('patient_documents')
          .list(`${user.id}/`);
          
        if (error) throw error;
        
        // Get file metadata
        if (files && files.length > 0) {
          setUploadedFiles(files.map(file => ({
            name: file.name,
            size: file.metadata?.size || 0,
            created_at: file.created_at,
            id: file.id,
            path: `${user.id}/${file.name}`
          })));
        } else {
          setUploadedFiles([]);
        }

        // Check if user is a doctor and fetch verification status
        if (user.role === 'doctor') {
          const { data, error: doctorError } = await supabase
            .from('doctors')
            .select('verification_status')
            .eq('id', user.id)
            .maybeSingle();
            
          if (doctorError) {
            console.error('Error fetching doctor verification status:', doctorError);
          } else if (data) {
            setVerificationStatus(data.verification_status || 'pending');
          }
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        toast({
          title: "Error",
          description: "Failed to load your documents",
          variant: "destructive",
        });
      } finally {
        setFetchingFiles(false);
      }
    };
    
    fetchFiles();
  }, [user, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !reportType || !reportDate) {
      toast({
        title: "Missing Information",
        description: "Please select at least one file, report type, and date.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload documents.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const filePath = `${user.id}/${reportType}_${reportDate}_${file.name}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from(user.role === 'doctor' ? 'doctor_verifications' : 'patient_documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) throw uploadError;
        
        return {
          name: file.name,
          size: file.size,
          path: filePath
        };
      });
      
      await Promise.all(uploadPromises);
      
      toast({
        title: "Files Uploaded Successfully",
        description: user.role === 'doctor' 
          ? "Your degree verification documents have been submitted for review." 
          : "Your medical reports have been uploaded successfully.",
      });
      
      // Clear form
      setReportType("");
      setReportDate("");
      setSelectedFiles([]);
      setNotes("");
      
      // Refresh the file list
      const { data: updatedFiles, error } = await supabase
        .storage
        .from(user.role === 'doctor' ? 'doctor_verifications' : 'patient_documents')
        .list(`${user.id}/`);
        
      if (error) throw error;
      
      if (updatedFiles) {
        setUploadedFiles(updatedFiles.map(file => ({
          name: file.name,
          size: file.metadata?.size || 0,
          created_at: file.created_at,
          id: file.id,
          path: `${user.id}/${file.name}`
        })));
      }
      
      // Switch to the documents tab after successful upload
      setActiveTab("documents");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (filePath: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .storage
        .from(user.role === 'doctor' ? 'doctor_verifications' : 'patient_documents')
        .remove([filePath]);
        
      if (error) throw error;
      
      // Update file list
      setUploadedFiles(prev => prev.filter(file => file.path !== filePath));
      
      toast({
        title: "File Deleted",
        description: "The file has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Determine what to show based on user role and verification status
  const renderContent = () => {
    if (user?.role === 'doctor' && verificationStatus) {
      if (verificationStatus === 'approved') {
        return (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">Verification Approved</AlertTitle>
            <AlertDescription className="text-green-600">
              Your medical credentials have been verified. You can now access all doctor features.
            </AlertDescription>
          </Alert>
        );
      } else if (verificationStatus === 'pending') {
        return (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-700">Verification Pending</AlertTitle>
            <AlertDescription className="text-yellow-600">
              Your degree verification is under review. Please upload your medical degree certificates for verification.
            </AlertDescription>
          </Alert>
        );
      } else if (verificationStatus === 'rejected') {
        return (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-700">Verification Rejected</AlertTitle>
            <AlertDescription className="text-red-600">
              Your verification was not approved. Please upload valid medical degree certificates.
            </AlertDescription>
          </Alert>
        );
      }
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {user?.role === 'doctor' ? 'Medical Degree Verification' : 'Upload Medical Reports'}
        </CardTitle>
        <CardDescription>
          {user?.role === 'doctor' 
            ? 'Upload your medical degree certificates for verification' 
            : 'Share your medical reports securely with your healthcare provider'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderContent()}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="documents">My Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="report-type">Document Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select type of document" />
                </SelectTrigger>
                <SelectContent>
                  {user?.role === 'doctor' ? (
                    <>
                      <SelectItem value="MedicalDegree">Medical Degree</SelectItem>
                      <SelectItem value="MedicalLicense">Medical License</SelectItem>
                      <SelectItem value="Certification">Specialty Certification</SelectItem>
                      <SelectItem value="Other">Other Credentials</SelectItem>
                    </>
                  ) : (
                    reportTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-date">{user?.role === 'doctor' ? 'Document Date' : 'Report Date'}</Label>
              <Input
                id="report-date"
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Files</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-gray-50">
                <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag and drop files here or click to browse</p>
                <p className="text-xs text-gray-400 mb-4">Supported formats: PDF, JPG, PNG (Max 10MB per file)</p>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Select Files
                </Button>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="border rounded-md divide-y">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Input
                id="notes"
                placeholder="Any additional information about these documents"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleUpload} 
              disabled={loading || selectedFiles.length === 0 || !reportType || !reportDate}
            >
              {loading ? "Uploading..." : "Upload Files"}
            </Button>
          </TabsContent>
          
          <TabsContent value="documents">
            {fetchingFiles ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lifesage-primary"></div>
                <p className="mt-2 text-gray-500">Loading your documents...</p>
              </div>
            ) : uploadedFiles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No documents found.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("upload")}
                >
                  Upload Your First Document
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {file.created_at && `Uploaded: ${new Date(file.created_at).toLocaleDateString()}`}
                          {file.size && ` • ${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => file.path && deleteFile(file.path)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        {activeTab === "documents" && (
          <Button onClick={() => setActiveTab("upload")}>
            Upload More
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MedicalReportUpload;
