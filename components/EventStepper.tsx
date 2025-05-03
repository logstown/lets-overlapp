'use client'

import { User } from '@prisma/client'
import React, { useState } from 'react'
import ChooseUserDates from './ChooseUserDates'
import Link from 'next/link'
import { getJSDateFromStr } from '@/lib/utilities'

export interface UserDates {
  availableDates: Date[]
  preferredDates: Date[]
}

const EventStepper = ({
  setDates,
  eventId,
  user,
}: {
  setDates?: Date[]
  eventId?: string
  user?: User
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(new FormData())
  const [userDates, setUserDates] = useState<UserDates>({
    availableDates: user?.availableDates.map(getJSDateFromStr) ?? [],
    preferredDates: user?.preferredDates.map(getJSDateFromStr) ?? [],
  })

  const totalSteps = 3

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleFormDataChange = (stepData: FormData) => {
    setFormData({ ...formData, ...stepData })
  }

  const submitForm = () => {
    console.log('Form submitted with data:', formData)
  }

  const renderStep = () => {
    // ... Implement logic to render different step components based on currentStep and pass necessary props like formData and handleFormDataChange
    switch (currentStep) {
      case 1:
        return (
          <ChooseUserDates
            setDates={setDates}
            isUpdating={!!eventId || !!user}
            userDates={userDates}
            setUserDates={setUserDates}
          />
        )
      case 2:
      //   return <Step2 formData={formData} handleFormDataChange={handleFormDataChange}  />;
      case 3:
      //   return <Step3 formData={formData} handleFormDataChange={handleFormDataChange} />;
      default:
        return null
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      {renderStep()}
      <div className='flex justify-end gap-4'>
        {currentStep > 1 && (
          <button className='btn btn-primary btn-lg' onClick={prevStep}>
            Previous
          </button>
        )}
        {currentStep < totalSteps && (
          <button
            className='btn btn-primary btn-lg'
            onClick={nextStep}
            disabled={
              userDates.availableDates.length === 0 &&
              userDates.preferredDates.length === 0
            }
          >
            Next
          </button>
        )}
        {currentStep === totalSteps && (
          <button className='btn btn-primary btn-lg' onClick={submitForm}>
            Submit
          </button>
        )}
        {!!user && currentStep === 1 && (
          <Link href={`/event/results/${user.id}`} className='btn btn-soft btn-lg'>
            Cancel
          </Link>
        )}
      </div>
    </div>
  )
}

export default EventStepper
