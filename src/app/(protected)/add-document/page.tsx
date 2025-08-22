import { DocumentUploadForm } from "@/components/deck/document-upload-form";
import { FileUp } from "lucide-react";

export default function AddDocumentPage() {
    return (
        <div className="sm:ml-14">
             <div className="flex items-center gap-4 mb-6">
                <FileUp className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">文档导入卡组</h1>
            </div>
            <p className="text-muted-foreground mb-8">
                上传 PDF, Word, 或 TXT 文档，AI将自动为你抽取Q/A生成卡组。
            </p>
            <DocumentUploadForm />
        </div>
    );
}
