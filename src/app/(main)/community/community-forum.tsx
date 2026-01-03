
"use client";

import React, { useActionState, useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateCommunityFeed, type CommunityForumState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, Loader2, ThumbsUp, MessageSquare, Send, AlertCircle, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const initialState: CommunityForumState = {
  form: {
    location: "",
    postContent: "",
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Posting...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Post to Community
        </>
      )}
    </Button>
  );
}

function CommunityForumInternal() {
    const [state, formAction] = useActionState(generateCommunityFeed, initialState);
    const [location, setLocation] = useState('');
    const [hasSetLocation, setHasSetLocation] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

     useEffect(() => {
        if (state.form.postContent === '' && state.feed) {
            formRef.current?.reset();
        }
    }, [state]);

    const handleLocationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(location.trim()) {
            setHasSetLocation(true);
            // Trigger the form action to fetch initial feed
            const formData = new FormData();
            formData.append('location', location);
            formAction(formData);
        }
    }

    if (!hasSetLocation) {
        return (
            <div className="flex items-center justify-center pt-10">
                <Card className="w-full max-w-lg">
                    <form onSubmit={handleLocationSubmit}>
                        <CardHeader>
                            <CardTitle>Join the Community</CardTitle>
                            <CardDescription>Enter your state or district to see what farmers near you are talking about.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Guntur, Andhra Pradesh"
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full">
                                <Users className="mr-2 h-4 w-4"/>
                                View Community Feed
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        )
    }

    return (
    <div className="space-y-6">
       <Card>
            <CardHeader>
                <CardTitle>Community Forum: {location}</CardTitle>
                <CardDescription>Ask questions, share advice, and connect with farmers in your area.</CardDescription>
            </CardHeader>
             <form action={formAction} ref={formRef}>
                 <input type="hidden" name="location" value={location} />
                <CardContent>
                    <Label htmlFor="postContent" className="sr-only">New Post</Label>
                    <Textarea 
                        id="postContent" 
                        name="postContent"
                        placeholder="Share your thoughts or ask a question..." 
                        className="mb-2"
                        rows={3}
                     />
                </CardContent>
                <CardFooter className="justify-end">
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
      
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {useFormStatus().pending && !state.form.postContent && (
         <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading community feed for {location}...</p>
            </CardContent>
         </Card>
      )}

      <div className="space-y-4">
        {state.feed?.posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
                <div className="flex items-start gap-4">
                    <Avatar>
                        <AvatarFallback className="text-xl bg-secondary">{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                         <div className="flex items-center justify-between">
                            <p className="font-semibold">{post.author}</p>
                            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">{post.content}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes} Likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.replies.length} Replies</span>
                    </div>
                </div>

                {post.replies && post.replies.length > 0 && (
                   <div className="space-y-3 pt-3 pl-6 border-l-2 ml-5">
                     {post.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                           <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-lg bg-background">{reply.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-sm">{reply.author}</p>
                                     <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{reply.content}</p>
                            </div>
                        </div>
                     ))}
                   </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


export function CommunityForum() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Show a loader on the server
    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading Community Forum...</p>
            </CardContent>
        </Card>
    );
  }

  return <CommunityForumInternal />;
}
