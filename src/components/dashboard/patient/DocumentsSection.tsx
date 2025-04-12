
import React from 'react';
import { FileUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DocumentsSectionProps {
  documents: any[];
  goToReports: () => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents, goToReports }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileUp className="mr-2 h-5 w-5" />
          My Medical Documents
        </CardTitle>
        <CardDescription>
          Your recently uploaded medical reports and documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No documents uploaded yet.</p>
            <Button variant="outline" className="mt-4" onClick={goToReports}>
              Upload Your First Document
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4" onClick={goToReports}>
              Upload More Documents
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
