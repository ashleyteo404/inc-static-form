import React from 'react'
import { RadioGroupField } from '~/components/formFieldType/RadioGroupField'
import { EmailField } from '~/components/formFieldType/EmailField'
// import { NumberField } from '~/components/formFieldType/NumberField'
import { TextField } from '~/components/formFieldType/TextField'
import { CheckboxField } from '~/components/formFieldType/CheckboxField'
import { SelectField } from '~/components/formFieldType/SelectField'
import { TextAreaField } from '~/components/formFieldType/TextAreaField'
import { Button } from '~/components/ui/button'
import { Form } from "src/components/ui/form"
import { FormProvider, useForm } from 'react-hook-form';

function createForm() {
  const methods = useForm();

  const handleFormSubmit = (data: any) => {
    // Handle the form submission here with the combined data from all form fields
    console.log('Submitted data:', data);
  };

  return (
    // <FormProvider {...methods}>
    //   <Form onSubmit={handleFormSubmit}>
    //     <div>
    //       <TextField />
    //       {/* <NumberField name="age" /> */}
    //       {/* Other form fields */}
    //     </div>
    //     <Button type="submit">Submit</Button>
    //   </Form>
    // </FormProvider>
    <></>
  )
}

export default createForm