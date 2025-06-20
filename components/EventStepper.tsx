'use client'

import { User } from '@prisma/client'
import React, { useState } from 'react'
import ChooseUserDates from './ChooseUserDates'
import Link from 'next/link'
import { getJSDateFromStr } from '@/lib/utilities'
import EventDetails from './EventDetails'
import AttendeeDetails from './AttendeeDetails'
import { createEvent, addDates, editUser } from '@/lib/actions'

export interface UserDates {
  availableDates: Date[]
  preferredDates: Date[]
}

export interface FormDetails {
  eventName: string
  description?: string
  attendeeName: string
  attendeeEmail?: string
  icon: string
}

const EventStepper = ({
  setDates,
  eventId,
  user,
}: {
  setDates?: string[]
  eventId?: string
  user?: User
}) => {
  const setJSDates = setDates?.map(getJSDateFromStr)
  const isNewEvent = !eventId && !user
  const steps = isNewEvent
    ? ['Availability', 'Event Details', 'Your Info']
    : ['Availability', 'Your Info']

  let saveButtonText = 'Create'
  if (eventId) {
    saveButtonText = 'Submit'
  } else if (user) {
    saveButtonText = 'Save'
  }

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormDetails>({
    eventName: '',
    description: '',
    attendeeName: user?.name ?? '',
    attendeeEmail: user?.email ?? '',
    icon: 'calendar',
  })
  const [userDates, setUserDates] = useState<UserDates>({
    availableDates: user?.availableDates.map(getJSDateFromStr) ?? [],
    preferredDates: user?.preferredDates.map(getJSDateFromStr) ?? [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleFormDataChange = (stepData: Partial<FormDetails>) => {
    setFormData({ ...formData, ...stepData })
  }

  const saveData = async () => {
    const availableDateStrs = userDates.availableDates.map(
      date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    )
    const preferredDateStrs = userDates.preferredDates.map(
      date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    )

    if (eventId) {
      return addDates(formData, preferredDateStrs, availableDateStrs, eventId)
    } else if (user) {
      return editUser(formData, preferredDateStrs, availableDateStrs, user.id)
    } else {
      return createEvent(formData, preferredDateStrs, availableDateStrs)
    }
  }

  const submitForm = async () => {
    setIsSubmitting(true)
    await saveData()
    setIsSubmitting(false)
  }

  const renderStep = () => {
    // ... Implement logic to render different step components based on currentStep and pass necessary props like formData and handleFormDataChange
    switch (currentStep) {
      case 1:
        return (
          <ChooseUserDates
            setDates={setJSDates}
            isUpdating={!isNewEvent}
            userDates={userDates}
            setUserDates={setUserDates}
          />
        )
      case 2:
        return isNewEvent ? (
          <EventDetails
            formData={formData}
            handleFormDataChange={handleFormDataChange}
          />
        ) : (
          <AttendeeDetails
            formData={formData}
            handleFormDataChange={handleFormDataChange}
          />
        )
      case 3:
        return (
          <AttendeeDetails
            formData={formData}
            handleFormDataChange={handleFormDataChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className='w-full'>
      <ul className='steps w-full text-sm sm:text-base'>
        {steps.map((step, index) => (
          <li
            key={index}
            className={`step ${currentStep >= index + 1 ? 'step-secondary' : ''}`}
          >
            <span
              className={`${currentStep === index + 1 ? 'text-base font-semibold sm:text-lg' : ''}`}
            >
              {step}
            </span>
          </li>
        ))}
      </ul>
      <div className='bg-base-200 mt-6 flex min-h-[460px] flex-col gap-12 rounded-lg py-6 sm:gap-0'>
        <div className='flex w-full flex-1 items-center justify-center'>
          {renderStep()}
        </div>
        <div className='flex justify-between px-6'>
          <button
            className={`btn btn-primary btn-soft ${currentStep === 1 || isSubmitting ? 'invisible' : ''}`}
            onClick={prevStep}
          >
            Previous
          </button>
          <div className='flex gap-4'>
            {!!user && (
              <Link href={`/event/results/${user.id}`} className='btn btn-soft'>
                Cancel
              </Link>
            )}
            {currentStep < steps.length && (
              <button
                className='btn btn-primary'
                onClick={nextStep}
                disabled={
                  (userDates.availableDates.length === 0 &&
                    userDates.preferredDates.length === 0) ||
                  (currentStep > 1 && formData.eventName === '')
                }
              >
                Next
              </button>
            )}
            {currentStep === steps.length && (
              <button
                className='btn btn-primary'
                onClick={submitForm}
                disabled={formData.attendeeName === '' || isSubmitting}
              >
                {isSubmitting && (
                  <span className='loading loading-spinner loading-xs mr-2'></span>
                )}
                {saveButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventStepper
