
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, FileText, X } from 'lucide-react';

const reportTypes = [
  "Blood Test", "X-Ray", "MRI", "CT Scan", "Ultrasound", "ECG", "Pathology", "Other"
];

const MedicalReportUpload: React.FC = () => {
  const [reportType, setReportType] = useState<string>("");
  const [reportDate, setReportDate] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

    setLoading(true);

    try {
      // In a real implementation, this would upload to storage
      // For now, we'll just simulate a successful upload
      
      setTimeout(() => {
        toast({
          title: "Reports Uploaded Successfully",
          description: `${selectedFiles.length} medical report(s) have been uploaded and will be reviewed by your healthcare provider.`,
        });
        
        // Reset form
        setReportType("");
        setReportDate("");
        setSelectedFiles([]);
        setNotes("");
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error uploading reports:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your reports. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Medical Reports</CardTitle>
        <CardDescription>Share your medical reports securely with your healthcare provider</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Select type of report" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="report-date">Report Date</Label>
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
            placeholder="Any additional information about these reports"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleUpload} 
          disabled={loading || selectedFiles.length === 0 || !reportType || !reportDate}
        >
          {loading ? "Uploading..." : "Upload Reports"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MedicalReportUpload;
