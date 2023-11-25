// DisplayForms.tsx

import { DeleteIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

export default function DisplayForms() {
    const { data: session, status } = useSession();
  
    const { data: forms, isLoading, isError } = api.form.getAll.useQuery();

    const ctx = api.useContext();
  
    const deleteFormMutation = api.form.deleteStaticForm.useMutation({
      onSuccess: () => {
        toast({
          title: "Successfully deleted static form!",
        });
        // Trigger a refetch of the 'getAll' query to fetch the updated data
        void ctx.form.getAll.invalidate();      
    },
      onError: (e) => {
        toast({
          title: "Failed to delete static form! Please try again later.",
        });
      },
    });
  
    function deleteStaticForm(formId: string) {
      deleteFormMutation.mutate({
        formId: formId,
      });
    }
  
    if (isLoading) {
      return <p>Loading...</p>;
    }
  
    if (isError) {
      return <p>Error loading forms</p>;
    }
  
    return (
      <>
        {!session && <p>Not logged in</p>}
        {status === 'authenticated' && session && (
          <div>
            <h1>Your Forms</h1>
            {forms.map((form) => (
              <div key={form.formId}>
                <Link href={`/form/${form.formId}`} passHref>
                  <p>Form Name: {form.name}</p>
                </Link>
                <DeleteIcon onClick={() => deleteStaticForm(form.formId)} />
              </div>
            ))}
          </div>
        )}
      </>
    );
  }