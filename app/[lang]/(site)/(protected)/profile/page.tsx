import Container from '@/components/ui-custom/Container'
import React from 'react'
import ProfileForm from './_component/ProfileForm'

function page() {
  return (
    <Container className='py-[68px] space-y'>
        <h1 className='text-primary font-semibold text-[40px] leading-[150%] '>
            Profile Saya
        </h1>
        <ProfileForm></ProfileForm>

    </Container>
  )
}

export default page