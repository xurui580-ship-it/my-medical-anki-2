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
import { BrainIcon, StethoscopeIcon } from "@/components/shared/icons";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(1, { message: "请输入用户名" }),
  password: z.string().min(1, { message: "请输入密码" }),
});

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError("");
    const success = await login(values.username, values.password);
    if (success) {
      router.push("/decks");
    } else {
      setError("用户名或密码不正确");
      form.reset();
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
        <CardTitle className="text-2xl font-bold">欢迎你，医学牲</CardTitle>
        <CardDescription>登录以开始你的学习之旅</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              type="text"
              placeholder="请输入用户名"
              {...form.register("username")}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" placeholder="请输入密码" {...form.register("password")} required />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full" variant="warm" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            登录
          </Button>
          <div className="mt-4 text-center text-sm">
            还没有账户?{" "}
            <Link href="/register" className="underline text-primary">
              注册
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
