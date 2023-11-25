"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useFormContext } from "react-hook-form"
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

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function TextField({ onSubmit }: { onSubmit: (data: any) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  })

  console.log("TextField rendered");

  console.log("form context", useFormContext());

  const { handleSubmit } = useFormContext();

//   const onSubmit = (data: any) => {
//     // Handle the form submission here with the combined data from all form fields
//     console.log('Submitted data:', data);
//   };

  return (
    // <Form {...form}>
    //   <form 
    //     // onSubmit={form.handleSubmit(onSubmit)} 
    //     // onSubmit={handleSubmit((data) => {
    //     //     console.log("username", data);
    //     //     onSubmit({ username: data.username });
    //     // })}
    //     onSubmit={(data) => {
    //         console.log("TextField", data);
    //         onSubmit({ username: data })
    //     }} 
    //     className="w-2/3 space-y-6"
    //   >
    <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        // {/* <Button type="submit">Submit</Button> */}
    </form>
    // </Form>
  )
}
