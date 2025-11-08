'use client'

import { Toaster as HotToaster, ToastOptions } from 'react-hot-toast'

const toastOptions: ToastOptions = {
  position: 'top-right',
}

export default function Toaster() {
  return <HotToaster toastOptions={toastOptions} />
}

