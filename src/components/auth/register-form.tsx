"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { BrainIcon, StethoscopeIcon } from "../shared/icons";

const formSchema = z
  .object({
    username: z.string().min(3, { message: "用户名至少需要3个字符" }),
    password: z.string().min(6, { message: "密码至少需要6个字符" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不匹配",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError("");
    const success = await register(values.username, values.password);
    if (success) {
      toast({
        title: "注册成功",
        description: "现在你可以登录了。",
        variant: "default",
      });
      router.push("/login");
    } else {
      setError("该用户名已被注册");
    }
    setIsLoading(false);
  };

  return (
    <Card className="mx-auto max-w-sm w-full glass-card">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
            <StethoscopeIcon className="w-8 h-8 text-primary"/>
            <BrainIcon className="w-8 h-8 text-primary"/>
        </div>
        <CardTitle className="text-2xl font-bold">创建账户</CardTitle>
        <CardDescription>加入我们，开启高效学习新篇章</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">用户名</Label>
            <Input id="username" {...form.register("username")} />
            {form.formState.errors.username && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full" variant="warm" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            注册
          </Button>
          <div className="mt-4 text-center text-sm">
            已经有账户了?{" "}
            <Link href="/login" className="underline text-primary">
              登录
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
