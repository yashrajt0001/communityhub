import { SignUp } from '@clerk/nextjs'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return <SignUp/>
}

export default page