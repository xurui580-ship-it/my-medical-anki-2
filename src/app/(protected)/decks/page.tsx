"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BookOpen, Brain, Clock, FolderPlus, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function TodayStats() {
    const { user } = useAuth();

    // In a real app, this would come from the user's DB record.
    const userLearned = 0;
    const userReviewed = 0;

    return (
        <Card className="glass-card mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Brain size={24} />
                    今日统计
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">新学卡片</p>
                        <p className="text-2xl font-bold">{userLearned}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-secondary/10 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">复习卡片</p>
                        <p className="text-2xl font-bold">{userReviewed}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyDecksState() {
    return (
        <div className="text-center mt-16 flex flex-col items-center">
            <FolderPlus className="w-20 h-20 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">你的知识库空空如也</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                是时候开始构建你的医学知识殿堂了！从下面选择一种方式，添加你的第一个卡组吧。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                 <Button asChild variant="warm" size="lg">
                    <Link href="/add-manual">
                        <PlusCircle className="mr-2" /> 手动新建卡组
                    </Link>
                </Button>
                 <Button asChild variant="outline" size="lg">
                    <Link href="/add-system">系统卡组</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/add-document">文档导入</Link>
                </Button>
            </div>
        </div>
    );
}

export default function DecksPage() {
    const { user, logout } = useAuth();
    // In the prototype, we will show an empty state for all users.
    // When connected to a DB, this will fetch the user's actual decks.
    const decksToShow: any[] = [];

    return (
        <div className="sm:ml-14">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">我的卡组</h1>
                <div className="flex items-center gap-4">
                 {decksToShow.length > 0 && (
                    <Button asChild variant="warm">
                        <Link href="/add-manual">
                            <PlusCircle className="mr-2 h-4 w-4" /> 新建卡组
                        </Link>
                    </Button>
                 )}
                 <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                 </Button>
                </div>
            </div>

            <TodayStats />

            {decksToShow.length === 0 ? <EmptyDecksState /> : (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {decksToShow.map((deck) => (
                        <Card key={deck.id} className="flex flex-col glass-card hover:shadow-primary/20 transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="truncate">{deck.name}</CardTitle>
                                <CardDescription>{deck.cards.length} 张卡片</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-end">
                                <div className="text-sm text-muted-foreground mb-4">
                                    <p>待复习: {deck.cards.filter(c => new Date(c.dueAt) <= new Date()).length}</p>
                                    <p>新卡片: {deck.cards.filter(c => c.isNew).length}</p>
                                </div>
                                <Button asChild className="w-full">
                                    <Link href={`/decks/${deck.id}/study`}>开始学习</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    <Card className="flex flex-col items-center justify-center border-2 border-dashed bg-transparent glass-card hover:border-primary transition-colors duration-300">
                        <CardHeader className="items-center text-center">
                            <CardTitle>添加更多卡组</CardTitle>
                            <CardDescription>从系统或文档中导入</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 w-full px-10">
                            <Button asChild variant="outline">
                                <Link href="/add-system">系统卡组</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/add-document">文档导入</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
