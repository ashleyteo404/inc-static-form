"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "src/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form"
import { Input } from "src/components/ui/input"
import { toast } from "src/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { api } from "~/utils/api"

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export default function staticForm() {
  const { data: session, status } = useSession();  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("data", JSON.stringify(data, null, 2))
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const createFormMutation = api.form.createStaticForm.useMutation({
    onSuccess: () => {
      toast({
        title: "Successfully created static form!",
      });
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast({
          title: errorMessage[0],
        });
      } else {
        toast({
          title: "Failed to create static form! Please try again later.",
        });
      }
    },
  });

  function createStaticForm() {
    createFormMutation.mutate({ 
      name: "Static Form Test", 
    });
  }

  return (
    <>
      {/* {status === 'loading' && <p>Loading...</p>} */}
      {!session && <p>Not logged in</p>}
      {status === 'authenticated' && session && (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="abc@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
          <Button type="button" onClick={() => createStaticForm()}>Save Form</Button>
        </>
      )}
    </>
  )
}
