import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface NewCardLimitDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onContinue: () => void;
    onReview: () => void;
    onExit: () => void;
}

export function NewCardLimitDialog({ open, onOpenChange, onContinue, onReview, onExit }: NewCardLimitDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>请选择接下来的操作：</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
                    <Button onClick={onContinue} variant="success">继续学习新卡</Button>
                    <Button onClick={onReview}>今日仅复习</Button>
                    <Button onClick={onExit} variant="outline">退出学习</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
