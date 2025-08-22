import { AuthProvider } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
    return (
        <AuthProvider>
            <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
                <div className="hidden bg-muted lg:block relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    <div 
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill=\'%232A6EBB\' fill-opacity=\'0.1\'%3E%3Crect x=\'0\' y=\'0\' width=\'50\' height=\'50\' /%3E%3Crect x=\'50\' y=\'50\' width=\'50\' height=\'50\' /%3E%3C/g%3E%3C/svg%3E")',
                            backgroundSize: '30px'
                        }}
                    ></div>
                    <div className="flex h-full w-full items-center justify-center p-10">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold text-primary">MediFlash</h1>
                            <p className="mt-4 text-xl text-foreground/80">
                            高效记忆，轻松备考。
                            </p>
                            <p className="mt-2 text-muted-foreground">专为医学生打造的智能抽认卡平台。</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center py-12">
                   <LoginForm />
                </div>
            </div>
        </AuthProvider>
    );
}
