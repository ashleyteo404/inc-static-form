"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "src/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form"
import { Input } from "src/components/ui/input"
import { toast } from "src/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { api } from "~/utils/api"
import { useRouter } from "next/router";
import { useEffect } from "react"

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

    if (status === 'loading') {
        return <p>Loading...</p>
    }

    if (!session) {
        return <p>Not logged in</p>
    }

  const router = useRouter();
  const { id } = router.query;
  console.log("id", id)

  useEffect(() => {
    // Access the formId from the dynamic route
    if (id) {
      console.log("Form ID:", id);
      // Fetch additional data or perform actions based on the formId
    }
  }, [id]);

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

  const submitFormMutation = api.form.submitStaticForm.useMutation({
    onSuccess: () => {
      toast({
        title: "Successfully submitted static form!",
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
          title: "Failed to submit static form! Please try again later.",
        });
      }
    },
  });

  function submitStaticForm() {
    if (!id) {
        console.error("Form ID is undefined");
        return;
    } else {
        submitFormMutation.mutate({ 
        formId: id as string, 
        username: form.getValues("username"), 
        email: form.getValues("email"), 
        });
    }
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
              <Button type="submit" onClick={() => submitStaticForm()}>Submit</Button>
            </form>
          </Form>
        </>
      )}
    </>
  )
}
