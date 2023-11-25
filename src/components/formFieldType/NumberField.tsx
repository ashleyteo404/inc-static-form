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

const FormSchema = z.object({
  age: z.number().min(0, {
    message: "Age must be a positive number.",
  }),
})

// export function NumberField({ name }: { name: string }) {
//   const { register, formState } = useFormContext();
//   const isError = formState.errors[name] !== undefined;

//   return (
//     <FormField name={name} render={() => (
//       <FormItem>
//         <FormLabel>Age</FormLabel>
//         <FormControl>
//           <Input type="number" {...register(name)} />
//         </FormControl>
//         <FormDescription>Enter your age as a positive number.</FormDescription>
//         <FormMessage>{isError && 'Age must be a positive number.'}</FormMessage>
//       </FormItem>
//     )} />
//   );
// }

// export function NumberField({ onSubmit }: { onSubmit: (data: any) => void }) {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       age: 0,
//     },
//   })

//   console.log("NumberField rendered");

//   // const { handleSubmit, control } = useForm<z.infer<typeof FormSchema>>({
//   //   resolver: zodResolver(FormSchema),
//   //   defaultValues: {
//   //     age: 0,
//   //   },
//   // });

//   // function onSubmit(data: z.infer<typeof FormSchema>) {
//   //   toast({
//   //     title: "You submitted the following values:",
//   //     description: (
//   //       <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//   //         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//   //       </pre>
//   //     ),
//   //   })
//   // }

//   return (
//     // <Form {...form}>
//     //   <form 
//     //     // onSubmit={form.handleSubmit(onSubmit)} 
//     //     // onSubmit={handleSubmit((data) => {
//     //     //     console.log("age", data);
//     //     //     onSubmit({ age: data.age });
//     //     // })}
//     //     onSubmit={(data) => {
//     //       console.log("NumberField", data);
//     //       onSubmit({ age: data })
//     //     }} 
//     //     className="w-2/3 space-y-6"
//     //   >
//         <FormField
//           control={form.control}
//           name="age"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Age</FormLabel>
//               <FormControl>
//                 <Input type="number" {...field} />
//               </FormControl>
//               <FormDescription>
//                 Enter your age as a positive number.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         // {/* <Button type="submit">Submit</Button> */}
//     //   </form>
//     // </Form>
//   )
// }
