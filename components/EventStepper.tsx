'use client'

import { User } from '@prisma/client'
import React, { useState } from 'react'
import ChooseUserDates from './ChooseUserDates'
import Link from 'next/link'
import { getJSDateFromStr } from '@/lib/utilities'
import EventDetails from './EventDetails'
import AttendeeDetails from './AttendeeDetails'
import { createEvent, addDates, editUser } from '@/lib/actions'
import { useRouter } from 'next/navigation'

export interface UserDates {
  availableDates: Date[]
  preferredDates: Date[]
}

export interface FormDetails {
  eventName: string
  description?: string
  attendeeName: string
  attendeeEmail?: string
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
  const isNewEvent = !eventId && !user
  const steps = ['Choose Dates', 'Event Details', 'Attendees']
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormDetails>({
    eventName: '',
    attendeeName: '',
  })
  const [userDates, setUserDates] = useState<UserDates>({
    availableDates: user?.availableDates.map(getJSDateFromStr) ?? [],
    preferredDates: user?.preferredDates.map(getJSDateFromStr) ?? [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = isNewEvent ? 3 : 2

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
    const result = await saveData()
    setIsSubmitting(false)
  }

  const renderStep = () => {
    // ... Implement logic to render different step components based on currentStep and pass necessary props like formData and handleFormDataChange
    switch (currentStep) {
      case 1:
        return (
          <ChooseUserDates
            setDates={setDates}
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
            className={`step ${currentStep >= index + 1 ? 'step-primary' : ''}`}
          >
            <span
              className={`${currentStep === index + 1 ? 'text-3xl font-semibold' : ''}`}
            >
              {step}
            </span>
          </li>
        ))}
      </ul>
      <div className={`card bg-base-300 mt-6 min-h-[450px] w-full shadow-xl`}>
        <div className='card-body items-center justify-center'>{renderStep()}</div>
      </div>
      <div className='mt-4 flex justify-end gap-4'>
        {currentStep > 1 && (
          <button
            className='btn btn-secondary btn-soft'
            disabled={isSubmitting}
            onClick={prevStep}
          >
            Previous
          </button>
        )}
        {currentStep < totalSteps && (
          <button
            className='btn btn-secondary'
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
        {currentStep === totalSteps && (
          <button
            className='btn btn-primary'
            onClick={submitForm}
            disabled={formData.attendeeName === '' || isSubmitting}
          >
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
